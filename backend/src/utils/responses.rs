use axum::response::{IntoResponse, Response};
use http::StatusCode;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

use crate::models::translations_models::Translations;

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub data: Option<T>,
    pub message: String,
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
        let error_message = Self::get_translation(translations, message_translation_key);
        AppError::new(status_code, error_message)
    }

    pub fn format_internal_error(translations: &Translations) -> AppError {
        let error_message = Self::get_translation(translations, "general.errors.internal_error");
        AppError::new(StatusCode::INTERNAL_SERVER_ERROR, error_message)
    }

    fn get_translation(translations: &Translations, key: &str) -> String {
        let keys: Vec<&str> = key.split('.').collect();
        let mut current_value = translations.auth.as_ref();

        for key in keys {
            if let Some(Value::Object(map)) = current_value {
                current_value = map.get(key);
            } else {
                return key.to_string();
            }
        }

        if let Some(Value::String(message)) = current_value {
            message.clone()
        } else {
            key.to_string()
        }
    }
}

impl ApiResponse<()> {
    pub fn format_success<T: Serialize>(
        translations: &Translations,
        status_code: StatusCode,
        message_translation_key: &str,
        data: Option<T>,
    ) -> (StatusCode, axum::Json<ApiResponse<T>>) {
        let message = AppError::get_translation(translations, message_translation_key);
        let response = ApiResponse { data, message };
        (status_code, axum::Json(response))
    }
}
