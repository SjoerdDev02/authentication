use std::sync::Arc;

use axum::{
    body::Body,
    extract::{Query, State},
    response::{IntoResponse, Response},
    Extension,
};
use http::{header, HeaderValue, StatusCode};

use crate::{
    constants::auth::BEARER_EXPIRATION_SECONDS,
    models::{
        auth::models::AuthResponse, general::AppState, otc::models::{OtcRequest, OtcPayload, OtcPayloadAction}, translations::Translations
    },
    utils::{
        cookie::set_cookie, emails::send_otc_success_email, jwt::{encode_jwt, format_refresh_token_key}, otc::format_otc_key, redis::{get_token, remove_token}, responses::{ApiResponse, AppError}, user::{
            confirm_user, delete_user_by_id, update_user_email,
            update_user_password,
        }
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
            }

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
