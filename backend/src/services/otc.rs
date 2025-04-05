use std::sync::Arc;

use axum::{
    extract::{Query, State},
    response::IntoResponse,
    Extension,
};
use http::{header, HeaderValue, StatusCode};

use crate::{
    constants::auth::BEARER_EXPIRATION_SECONDS,
    models::{
        auth::models::AuthResponse,
        general::AppState,
        otc::models::{OtcPayload, OtcPayloadAction, OtcRequest},
        translations::Translations,
    },
    utils::{
        cookie::{delete_cookie, set_cookie},
        emails::send_otc_success_email,
        jwt::encode_jwt,
        otc::format_otc_key,
        redis::{get_token, remove_token},
        responses::{ApiResponse, AppError},
        user::{confirm_user, delete_user_by_id, update_user_email, update_user_password},
    },
};

pub async fn otc_user(
    State(state): State<AppState>,
    Extension(translations): Extension<Arc<Translations>>,
    Query(params): Query<OtcRequest>,
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

    let mut cookies_to_set: Vec<(&str, String, Option<i32>)> = Vec::new();
    let mut cookies_to_delete: Vec<&str> = Vec::new();
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

                cookies_to_set.push(("Bearer", new_jwt, Some(BEARER_EXPIRATION_SECONDS)));
            }

            response_data = Some(AuthResponse {
                id: user_id,
                name: token_payload.name,
                email: token_payload.email.clone(),
                phone: token_payload.phone,
            });
        }
        OtcPayloadAction::DeleteAccount => {
            confirm_mail_type = "delete_account";

            // TODO: Would be good to remove the refresh token from redis here with remove_token, but not sure how yet as otc is not a protected route thus the refresh token is not available in extensions
            cookies_to_delete.push("Bearer");
            cookies_to_delete.push("RefreshToken");

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

    let api_response = ApiResponse::format_success(
        &translations,
        StatusCode::OK,
        "auth.success.otc_processed",
        response_data,
    );

    let mut response = api_response.into_response();

    response.headers_mut().insert(
        header::CONTENT_TYPE,
        HeaderValue::from_str("application/json")
            .map_err(|_| AppError::format_internal_error(&translations))?,
    );

    for (key, value, max_age) in cookies_to_set {
        response = set_cookie(&translations, response, key, &value, max_age)?;
    }

    for key in cookies_to_delete {
        response = delete_cookie(&translations, response, key)?;
    }

    Ok(response)
}
