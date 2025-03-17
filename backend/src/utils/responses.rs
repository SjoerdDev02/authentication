use axum::response::{IntoResponse, Response};
use http::StatusCode;
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::models::translations::Translations;
use crate::utils::translations::get_translation_by_key;

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T: Serialize> {
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
}

impl<T: Serialize> IntoResponse for ApiResponse<T> {
    fn into_response(self) -> Response {
        let body = json!({
            "data": self.data,
            "message": self.message,
        });

        (StatusCode::OK, axum::Json(body)).into_response()
    }
}

#[derive(Debug)]
pub struct AppError {
    status_code: StatusCode,
    message: String,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let body = json!({
            "data": null,
            "message": self.message,
        });

        (self.status_code, axum::Json(body)).into_response()
    }
}

impl AppError {
    pub fn new(status_code: StatusCode, message: String) -> Self {
        Self {
            status_code,
            message,
        }
    }

    pub fn format_error(
        translations: &Translations,
        status_code: StatusCode,
        message_translation_key: &str,
    ) -> AppError {
        let error_message = get_translation_by_key(translations, message_translation_key);
        AppError::new(status_code, error_message)
    }

    pub fn format_internal_error(translations: &Translations) -> AppError {
        let error_message = get_translation_by_key(translations, "general.errors.internal_error");
        AppError::new(StatusCode::INTERNAL_SERVER_ERROR, error_message)
    }
}

impl<T: Serialize> ApiResponse<T> {
    pub fn format_success(
        translations: &Translations,
        status_code: StatusCode,
        message_translation_key: &str,
        data: Option<T>,
    ) -> (StatusCode, axum::Json<ApiResponse<T>>) {
        let message = get_translation_by_key(&translations, message_translation_key);

        let response = ApiResponse { data, message };

        (status_code, axum::Json(response))
    }
}
