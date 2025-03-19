use std::sync::Arc;

use crate::constants::auth::{BEARER_EXPIRATION_SECONDS, REFRESH_EXPIRATION_SECONDS};
use crate::models::auth::models::{AuthResponse, LoginUser};
use crate::models::general::AppState;
use crate::models::translations::Translations;
use crate::utils::auth::verify_password;
use crate::utils::user::{get_user_by_email, get_user_by_id};
use crate::utils::cookie::{delete_cookie, get_cookie, set_cookie};
use crate::utils::jwt::{encode_jwt, format_refresh_token_key, generate_refresh_token};
use crate::utils::redis::{get_token, remove_token, set_token};
use crate::utils::responses::{ApiResponse, AppError};
use axum::response::IntoResponse;
use axum::{
    body::Body,
    extract::{Json, State},
    http::StatusCode,
    http::{header, Request, Response},
    Extension,
};
use http::HeaderValue;

pub async fn login_user(
    State(state): State<AppState>,
    Extension(translations): Extension<Arc<Translations>>,
    Json(user_data): Json<LoginUser>,
) -> Result<impl IntoResponse, AppError> {
    let user = match get_user_by_email(&state, &user_data.email).await {
        Ok(user) => user,
        Err(_) => {
            return Err(AppError::format_error(
                &translations,
                StatusCode::UNAUTHORIZED,
                "auth.errors.invalid_credentials",
            ))
        }
    };

    let (id, name, email, password_hash, phone, is_confirmed) = user;

    if !is_confirmed {
        return Err(AppError::format_error(
            &translations,
            StatusCode::UNAUTHORIZED,
            "auth.errors.account_not_confirmed",
        ));
    }

    if !verify_password(&user_data.password, &password_hash)
        .map_err(|_| AppError::format_internal_error(&translations))?
    {
        return Err(AppError::format_error(
            &translations,
            StatusCode::UNAUTHORIZED,
            "auth.errors.invalid_credentials",
        ));
    }

    let new_jwt = encode_jwt(&id, &name, &email)
        .map_err(|_| AppError::format_internal_error(&translations))?;
    let new_refresh_token = generate_refresh_token();
    let new_redis_refresh_token_key = format_refresh_token_key(&new_refresh_token);

    set_token(
        &state,
        &new_redis_refresh_token_key,
        &id.to_string(),
        REFRESH_EXPIRATION_SECONDS,
    )
    .await
    .map_err(|_| AppError::format_internal_error(&translations))?;

    let response_body = ApiResponse::format_success(
        &translations,
        StatusCode::OK,
        "auth.success.user_logged_in",
        Some(AuthResponse {
            id,
            name,
            email,
            phone,
        }),
    );

    let mut response = response_body.into_response();

    response = set_cookie(
        &translations,
        response,
        "Bearer",
        &new_jwt,
        Some(BEARER_EXPIRATION_SECONDS),
    )?;
    response = set_cookie(
        &translations,
        response,
        "RefreshToken",
        &new_refresh_token,
        Some(REFRESH_EXPIRATION_SECONDS),
    )?;

    let content_type_header_value = match "application/json".parse() {
        Ok(header) => header,
        Err(_) => return Err(AppError::format_internal_error(&translations)),
    };

    response
        .headers_mut()
        .insert(header::CONTENT_TYPE, content_type_header_value);

    Ok(response)
}

pub async fn logout_user(
    State(state): State<AppState>,
    Extension(translations): Extension<Arc<Translations>>,
    req: Request<Body>,
) -> Result<impl IntoResponse, AppError> {
    let refresh_token = match get_cookie(&req, "RefreshToken") {
        Some(payload) => payload,
        None => return Err(AppError::format_internal_error(&translations)),
    };

    let formatted_refresh_token_key = format_refresh_token_key(&refresh_token);

    remove_token(&state, &formatted_refresh_token_key)
        .await
        .map_err(|_| AppError::format_internal_error(&translations))?;

    let mut response = Response::new(Body::empty());

    response = delete_cookie(&translations, response, "Bearer")?;
    response = delete_cookie(&translations, response, "RefreshToken")?;

    let content_type_header_value = match "application/json".parse() {
        Ok(header) => header,
        Err(_) => return Err(AppError::format_internal_error(&translations)),
    };

    response
        .headers_mut()
        .insert(header::CONTENT_TYPE, content_type_header_value);

    Ok(response)
}

pub async fn refresh(
    State(state): State<AppState>,
    Extension(translations): Extension<Arc<Translations>>,
    req: Request<Body>,
) -> Result<impl IntoResponse, AppError> {
    let refresh_token = match get_cookie(&req, "RefreshToken") {
        Some(payload) => payload,
        None => return Err(AppError::format_internal_error(&translations)),
    };

    let formatted_refresh_token_key = format_refresh_token_key(&refresh_token);

    let token_payload: Option<i32> = get_token(&state, &formatted_refresh_token_key)
        .await
        .map_err(|_| {
            AppError::format_error(
                &translations,
                StatusCode::UNAUTHORIZED,
                "auth.errors.failed_to_read_token_payload",
            )
        })?
        .map(|json| {
            serde_json::from_str(&json).map_err(|_| AppError::format_internal_error(&translations))
        })
        .transpose()?;

    let user_id = match token_payload {
        Some(payload) => payload,
        None => {
            return Err(AppError::format_error(
                &translations,
                StatusCode::UNAUTHORIZED,
                "auth.errors.failed_to_read_token_payload",
            ))
        }
    };

    let user_data = match get_user_by_id(&state, &user_id).await {
        Ok(user) => user,
        Err(_) => return Err(AppError::format_internal_error(&translations)),
    };

    remove_token(&state, &formatted_refresh_token_key)
        .await
        .map_err(|_| AppError::format_internal_error(&translations))?;

    let new_refresh_token = generate_refresh_token();
    let new_refresh_token_key = format_refresh_token_key(&new_refresh_token);

    let _ = set_token(
        &state,
        &new_refresh_token_key,
        &user_id.to_string(),
        REFRESH_EXPIRATION_SECONDS,
    )
    .await;

    let new_jwt = encode_jwt(&user_id, &user_data.1, &user_data.2)
        .map_err(|_| AppError::format_internal_error(&translations))?;

    let response_body = ApiResponse::format_success(
        &translations,
        StatusCode::OK,
        "auth.success.refresh_processed",
        Some(AuthResponse {
            id: user_data.0,
            name: user_data.1,
            email: user_data.2,
            phone: None,
        }),
    );

    let mut response = response_body.into_response();

    response.headers_mut().insert(
        header::CONTENT_TYPE,
        HeaderValue::from_str("application/json")
            .map_err(|_| AppError::format_internal_error(&translations))?,
    );

    response = set_cookie(
        &translations,
        response,
        "Bearer",
        &new_jwt,
        Some(BEARER_EXPIRATION_SECONDS),
    )?;

    // Don't need to delete the old RefreshToken from the cookies, because it is overwritten here
    response = set_cookie(
        &translations,
        response,
        "RefreshToken",
        &new_refresh_token,
        Some(REFRESH_EXPIRATION_SECONDS),
    )?;

    Ok(response)
}
