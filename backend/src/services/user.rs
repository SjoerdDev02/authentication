use std::sync::Arc;

use axum::{
    extract::{Query, State},
    response::IntoResponse,
    Extension, Json,
};
use http::StatusCode;

use crate::{
    constants::auth::{OTC_EXPIRATION_SECONDS, PASSWORD_RESET_TOKEN_EXPIRATION_SECONDS},
    models::{
        auth::models::{AuthResponse, JwtClaims, ResetPasswordTokenUser}, general::AppState, otc::models::{OtcPayload, OtcPayloadAction}, translations::Translations, user::models::{PasswordResetToken, PasswordResetUser, RegisterUser, UpdateUser}
    },
    utils::{
        auth::hash_password, emails::{send_otc_email, send_otc_success_email, send_password_reset_email}, otc::{create_otc, format_otc_key}, redis::{get_token, remove_token, set_token}, responses::{ApiResponse, AppError}, user::{
            create_user, format_reset_token_key, get_user_by_email,
            get_user_by_id, update_non_sensitive_user_fields, update_user_password,
        }, validation::{
            validate_password_reset_user_data, validate_register_user_data,
            validate_update_user_data,
        }
    },
};

pub async fn register_user(
    State(state): State<AppState>,
    Extension(translations): Extension<Arc<Translations>>,
    Json(user_data): Json<RegisterUser>,
) -> Result<impl IntoResponse, AppError> {
    match validate_register_user_data(&user_data) {
        Some(validation_error) => {
            return Err(AppError::format_error(
                &translations,
                StatusCode::BAD_REQUEST,
                validation_error,
            ))
        }
        None => (),
    };

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

pub async fn update_user(
    State(state): State<AppState>,
    Extension(translations): Extension<Arc<Translations>>,
    // Extension(claims): Extension<JwtClaims>,
    Json(user_data): Json<UpdateUser>,
) -> Result<impl IntoResponse, AppError> {
    // if claims.id != user_data.id {
    if user_data.id != user_data.id {
        return Err(AppError::format_error(
            &translations,
            StatusCode::BAD_REQUEST,
            "auth.errors.invalid_update_data_id",
        ));
    }

    match validate_update_user_data(&user_data) {
        Some(validation_error) => {
            return Err(AppError::format_error(
                &translations,
                StatusCode::BAD_REQUEST,
                validation_error,
            ))
        }
        None => (),
    };

    let needs_otc = user_data.email_confirm.is_some()
        || user_data.password.is_some() && user_data.password_confirm.is_some();

    if needs_otc {
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
    State(state): State<AppState>,
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

pub async fn request_password_reset_token(
    State(state): State<AppState>,
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
        StatusCode::OK,
        "auth.success.otc_processed",
        None,
    ))
}

pub async fn reset_password_with_token(
    State(state): State<AppState>,
    Extension(translations): Extension<Arc<Translations>>,
    Query(params): Query<PasswordResetToken>,
    Json(user_data): Json<PasswordResetUser>,
) -> Result<impl IntoResponse, AppError> {
    match validate_password_reset_user_data(&user_data) {
        Some(validation_error) => {
            return Err(AppError::format_error(
                &translations,
                StatusCode::BAD_REQUEST,
                validation_error,
            ))
        }
        None => (),
    };

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

    remove_token(&state, &reset_token_key)
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
