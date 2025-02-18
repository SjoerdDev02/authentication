use std::sync::Arc;

use crate::constants::auth::{
    BEARER_EXPIRATION_SECONDS, OTC_EXPIRATION_SECONDS, PASSWORD_RESET_TOKEN_EXPIRATION_SECONDS,
    REFRESH_EXPIRATION_SECONDS,
};
use crate::models::auth_models::{
    AuthResponse, AuthState, JwtClaims, LoginUser, Otc, OtcPayload, OtcPayloadAction,
    PasswordResetToken, PasswordResetUser, RegisterUser, ResetPasswordTokenUser, UpdateUser,
};
use crate::models::translations_models::Translations;
use crate::utils::auth::{
    confirm_user, create_otc, create_user, delete_user_by_id, format_otc_key,
    format_reset_token_key, get_user_by_email, get_user_by_id, hash_password,
    update_non_sensitive_user_fields, update_user_email, update_user_password, verify_password,
};
use crate::utils::cookie::{delete_cookie, get_cookie, set_cookie};
use crate::utils::emails::{send_otc_email, send_otc_success_email, send_password_reset_email};
use crate::utils::jwt::{encode_jwt, format_refresh_token_key, generate_refresh_token};
use crate::utils::redis::{get_token, remove_token, set_token};
use crate::utils::responses::{ApiResponse, AppError};
use axum::response::IntoResponse;
use axum::{
    body::Body,
    extract::{Json, Query, State},
    http::StatusCode,
    http::{header, Request, Response},
    Extension,
};
use http::HeaderValue;

pub async fn register_user(
    State(state): State<AuthState>,
    Extension(translations): Extension<Arc<Translations>>,
    Json(user_data): Json<RegisterUser>,
) -> Result<impl IntoResponse, AppError> {
    if user_data.password != user_data.password_confirm {
        return Err(AppError::format_error(
            &translations,
            StatusCode::BAD_REQUEST,
            "auth.errors.password_mismatch",
        ));
    }

    let existing_user = get_user_by_email(&state, &user_data.email).await;

    if existing_user.is_ok() {
        return Err(AppError::format_error(
            &translations,
            StatusCode::CONFLICT,
            "auth.errors.email_already_exists",
        ));
    }

    let create_user_result = match create_user(
        &state,
        &user_data.name,
        &user_data.email,
        &user_data.password,
    )
    .await
    {
        Ok(user) => user,
        Err(_) => return Err(AppError::format_internal_error(&translations)),
    };

    let created_user_id: i32 = match create_user_result.last_insert_id().try_into() {
        Ok(id) => id,
        Err(_) => return Err(AppError::format_internal_error(&translations)),
    };

    let otc = create_otc();
    let otc_key = format_otc_key(&otc);

    let otc_payload = OtcPayload {
        otc: otc.to_string(),
        user_id: created_user_id,
        action: OtcPayloadAction::ConfirmAccount,
        name: user_data.name.clone(),
        email: user_data.email.clone(),
        password_hash: None,
        phone: None,
    };

    let otc_payload = serde_json::to_string(&otc_payload)
        .map_err(|_| AppError::format_internal_error(&translations))?;

    set_token(&state, &otc_key, &otc_payload, OTC_EXPIRATION_SECONDS)
        .await
        .map_err(|_| AppError::format_internal_error(&translations))?;

    send_otc_email(&translations, "confirm_account", &otc, &user_data.email)
        .await
        .map_err(|_| AppError::format_internal_error(&translations))?;

    let response = AuthResponse {
        id: created_user_id,
        name: user_data.name,
        email: user_data.email,
        phone: None,
    };

    Ok(ApiResponse::format_success(
        &translations,
        StatusCode::CREATED,
        "auth.success.user_registered",
        Some(response),
    ))
}

pub async fn login_user(
    State(state): State<AuthState>,
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

pub async fn update_user(
    State(state): State<AuthState>,
    Extension(translations): Extension<Arc<Translations>>,
    Extension(claims): Extension<JwtClaims>,
    Json(user_data): Json<UpdateUser>,
) -> Result<impl IntoResponse, AppError> {
    if claims.id != user_data.id {
        return Err(AppError::format_error(
            &translations,
            StatusCode::BAD_REQUEST,
            "auth.errors.invalid_update_data_id",
        ));
    }

    let needs_otc = user_data.email_confirm.is_some()
        || user_data.password.is_some() && user_data.password_confirm.is_some();

    if needs_otc {
        if user_data.password != user_data.password_confirm {
            return Err(AppError::format_error(
                &translations,
                StatusCode::BAD_REQUEST,
                "auth.errors.password_mismatch",
            ));
        }

        if let Some(email_confirm) = user_data.email_confirm {
            if user_data.email != email_confirm {
                return Err(AppError::format_error(
                    &translations,
                    StatusCode::BAD_REQUEST,
                    "auth.errors.email_mismatch",
                ));
            }
        }

        let password_hash = match user_data.password {
            Some(password) => Some(
                hash_password(&password)
                    .map_err(|_| AppError::format_internal_error(&translations))?,
            ),
            None => None,
        };

        let otc = create_otc();
        let otc_key = format_otc_key(&otc);
        let otc_payload = OtcPayload {
            otc: otc.to_string(),
            user_id: user_data.id,
            action: OtcPayloadAction::UpdateAccount,
            name: user_data.name,
            phone: user_data.phone,
            email: user_data.email,
            password_hash,
        };

        let otc_payload = serde_json::to_string(&otc_payload)
            .map_err(|_| AppError::format_internal_error(&translations))?;

        set_token(&state, &otc_key, &otc_payload, OTC_EXPIRATION_SECONDS)
            .await
            .map_err(|_| AppError::format_internal_error(&translations))?;

        let old_user = match get_user_by_id(&state, &user_data.id).await {
            Ok(user) => user,
            Err(_) => return Err(AppError::format_internal_error(&translations)),
        };

        let (_, _, email) = old_user;

        send_otc_email(&translations, "update_account", &otc, &email)
            .await
            .map_err(|_| AppError::format_internal_error(&translations))?;
    } else {
        update_non_sensitive_user_fields(
            &state,
            &user_data.id,
            &user_data.name,
            user_data.phone.as_deref(),
        )
        .await
        .map_err(|_| AppError::format_internal_error(&translations))?;
    }

    let success_message = if needs_otc {
        "auth.success.user_updated_to_otc"
    } else {
        "auth.success.user_updated"
    };

    Ok(ApiResponse::<()>::format_success(
        &translations,
        StatusCode::OK,
        success_message,
        None,
    ))
}

pub async fn delete_user(
    State(state): State<AuthState>,
    Extension(translations): Extension<Arc<Translations>>,
    Extension(claims): Extension<JwtClaims>,
) -> Result<impl IntoResponse, AppError> {
    let otc = create_otc();
    let otc_key = format_otc_key(&otc);

    let otc_payload = OtcPayload {
        otc: otc.to_string(),
        user_id: claims.id,
        action: OtcPayloadAction::DeleteAccount,
        name: claims.name,
        email: claims.email.clone(),
        password_hash: None,
        phone: None,
    };

    let otc_payload_json = serde_json::to_string(&otc_payload)
        .map_err(|_| AppError::format_internal_error(&translations))?;

    set_token(&state, &otc_key, &otc_payload_json, OTC_EXPIRATION_SECONDS)
        .await
        .map_err(|_| AppError::format_internal_error(&translations))?;

    send_otc_email(&translations, "delete_account", &otc, &claims.email)
        .await
        .map_err(|_| AppError::format_internal_error(&translations))?;

    Ok(ApiResponse::<()>::format_success(
        &translations,
        StatusCode::NO_CONTENT,
        "auth.success.user_updated_to_otc",
        None,
    ))
}

pub async fn otc_user(
    State(state): State<AuthState>,
    Extension(translations): Extension<Arc<Translations>>,
    Query(params): Query<Otc>,
) -> Result<impl IntoResponse, AppError> {
    let otc_key = format_otc_key(&params.otc);

    let token_payload: Option<OtcPayload> = get_token(&state, &otc_key)
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

    let token_payload = match token_payload {
        Some(payload) => payload,
        None => {
            return Err(AppError::format_error(
                &translations,
                StatusCode::UNAUTHORIZED,
                "auth.errors.failed_to_read_token_payload",
            ))
        }
    };

    let action = token_payload.action;
    let user_id = token_payload.user_id;

    let confirm_mail_type: &str;

    let mut response = Response::new(Body::empty());
    let mut response_data: Option<AuthResponse> = None;

    match action {
        OtcPayloadAction::UpdateAccount => {
            confirm_mail_type = "update_account";

            if let Some(password) = &token_payload.password_hash {
                update_user_password(&state, &user_id, &password)
                    .await
                    .map_err(|_| AppError::format_internal_error(&translations))?;
            } else {
                update_user_email(&state, &user_id, &token_payload.email)
                    .await
                    .map_err(|_| AppError::format_internal_error(&translations))?;

                let new_jwt = encode_jwt(&user_id, &token_payload.name, &token_payload.email)
                    .map_err(|_| AppError::format_internal_error(&translations))?;

                response = set_cookie(
                    &translations,
                    response,
                    "Bearer",
                    &new_jwt,
                    Some(BEARER_EXPIRATION_SECONDS),
                )?;

                response.headers_mut().insert(
                    header::CONTENT_TYPE,
                    HeaderValue::from_str("application/json")
                        .map_err(|_| AppError::format_internal_error(&translations))?,
                );

                response_data = Some(AuthResponse {
                    id: user_id,
                    name: token_payload.name,
                    email: token_payload.email.clone(),
                    phone: token_payload.phone,
                });
            }
        }
        OtcPayloadAction::DeleteAccount => {
            confirm_mail_type = "delete_account";

            let refresh_token_key = format_refresh_token_key(&user_id.to_string());

            remove_token(&state, &refresh_token_key)
                .await
                .map_err(|_| AppError::format_internal_error(&translations))?;

            delete_user_by_id(&state, &user_id)
                .await
                .map_err(|_| AppError::format_internal_error(&translations))?;
        }
        OtcPayloadAction::ConfirmAccount => {
            confirm_mail_type = "confirm_account";

            confirm_user(&state, &user_id)
                .await
                .map_err(|_| AppError::format_internal_error(&translations))?;
        }
    }

    send_otc_success_email(&translations, confirm_mail_type, &token_payload.email)
        .await
        .map_err(|_| AppError::format_internal_error(&translations))?;

    remove_token(&state, &otc_key).await.map_err(|_| {
        AppError::format_error(
            &translations,
            StatusCode::UNAUTHORIZED,
            "auth.errors.failed_to_remove_token",
        )
    })?;

    Ok(ApiResponse::format_success(
        &translations,
        StatusCode::OK,
        "auth.success.otc_processed",
        response_data,
    ))
}

pub async fn password_reset_request_token(
    State(state): State<AuthState>,
    Extension(translations): Extension<Arc<Translations>>,
    Json(user_data): Json<ResetPasswordTokenUser>,
) -> Result<impl IntoResponse, AppError> {
    let user_email_exists = get_user_by_email(&state, &user_data.email).await;

    let user = match user_email_exists {
        Ok(user) => user,
        Err(_) => {
            return Err(AppError::format_error(
                &translations,
                StatusCode::BAD_REQUEST,
                "auth.errors.invalid_password_reset_email",
            ))
        }
    };

    let reset_token = create_otc();
    let reset_token_key = format_reset_token_key(&reset_token);

    set_token(
        &state,
        &reset_token_key,
        &user.0.to_string(),
        PASSWORD_RESET_TOKEN_EXPIRATION_SECONDS,
    )
    .await
    .map_err(|_| AppError::format_internal_error(&translations))?;

    send_password_reset_email(&translations, &reset_token, &user_data.email)
        .await
        .map_err(|_| AppError::format_internal_error(&translations))?;

    Ok(ApiResponse::<()>::format_success(
        &translations,
        StatusCode::NO_CONTENT,
        "auth.success.otc_processed",
        None,
    ))
}

pub async fn reset_password_with_token(
    State(state): State<AuthState>,
    Extension(translations): Extension<Arc<Translations>>,
    Query(params): Query<PasswordResetToken>,
    Json(user_data): Json<PasswordResetUser>,
) -> Result<impl IntoResponse, AppError> {
    if user_data.password != user_data.password_confirm {
        return Err(AppError::format_error(
            &translations,
            StatusCode::BAD_REQUEST,
            "auth.errors.password_mismatch",
        ));
    }

    let reset_token_key = format_reset_token_key(&params.token);

    let token_payload: Option<i32> = get_token(&state, &reset_token_key)
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

    let password_hash = hash_password(&user_data.password)
        .map_err(|_| AppError::format_internal_error(&translations))?;

    update_user_password(&state, &user_id, &password_hash)
        .await
        .map_err(|_| AppError::format_internal_error(&translations))?;

    let updated_user = match get_user_by_id(&state, &user_id).await {
        Ok(user) => user,
        Err(_) => return Err(AppError::format_internal_error(&translations)),
    };

    send_otc_success_email(&translations, "update_account", &updated_user.2)
        .await
        .map_err(|_| AppError::format_internal_error(&translations))?;

    Ok(ApiResponse::<()>::format_success(
        &translations,
        StatusCode::OK,
        "auth.success.otc_processed",
        None,
    ))
}

pub async fn refresh(
    State(state): State<AuthState>,
    Extension(translations): Extension<Arc<Translations>>,
    req: Request<Body>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = match get_cookie(&req, "RefreshToken") {
        Some(id) => id,
        None => return Err(AppError::format_internal_error(&translations)),
    };

    let numeric_user_id = match user_id.parse::<i32>() {
        Ok(id) => id,
        Err(_) => return Err(AppError::format_internal_error(&translations)),
    };

    let user_data = match get_user_by_id(&state, &numeric_user_id).await {
        Ok(user) => user,
        Err(_) => return Err(AppError::format_internal_error(&translations)),
    };

    let mut response = Response::new(Body::empty());
    let mut response_data: Option<AuthResponse> = None;

    //     let formatted_refresh_token_key = format_refresh_token_key(&refresh_token);

    //     remove_token(&state, &formatted_refresh_token_key)
    //     .await
    //     .map_err(|_| AppError::format_internal_error(&translations))?;

    // response = delete_cookie(&translations, response, "RefreshToken")?;

    let new_refresh_token = generate_refresh_token();
    let new_refresh_token_key = format_refresh_token_key(&new_refresh_token);

    let _ = set_token(
        &state,
        &new_refresh_token_key,
        &user_id.to_string(),
        REFRESH_EXPIRATION_SECONDS,
    )
    .await;

    response = set_cookie(
        &translations,
        response,
        "RefreshToken",
        &new_refresh_token,
        Some(REFRESH_EXPIRATION_SECONDS),
    )?;

    let new_jwt = encode_jwt(&numeric_user_id, &user_data.1, &user_data.2)
        .map_err(|_| AppError::format_internal_error(&translations))?;

    response = set_cookie(
        &translations,
        response,
        "Bearer",
        &new_jwt,
        Some(BEARER_EXPIRATION_SECONDS),
    )?;

    response.headers_mut().insert(
        header::CONTENT_TYPE,
        HeaderValue::from_str("application/json")
            .map_err(|_| AppError::format_internal_error(&translations))?,
    );

    response_data = Some(AuthResponse {
        id: numeric_user_id,
        name: user_data.1,
        email: user_data.2,
        phone: None,
    });

    Ok(ApiResponse::format_success(
        &translations,
        StatusCode::OK,
        "auth.success.refresh_processed",
        response_data,
    ))
}
