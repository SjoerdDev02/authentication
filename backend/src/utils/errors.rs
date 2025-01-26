use axum::response::{IntoResponse, Response};
use http::StatusCode;
use serde_json::{json, Value};

use crate::models::translations_models::Translations;

#[derive(Debug)]
pub struct AppError {
    status_code: StatusCode,
    message: String,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let body = json!({
            "error": self.message,
        });

        (self.status_code, axum::Json(body)).into_response()
    }
}

impl AppError {
    pub fn new(status_code: StatusCode, message: String) -> Self {
        Self { status_code, message }
    }

        pub fn format_error(translations: &Translations, status_code: StatusCode, message_translation_key: &str) -> AppError {
            let keys: Vec<&str> = message_translation_key.split('.').collect();
            let mut current_value = translations.auth.as_ref();
    
            for key in keys {
                if let Some(Value::Object(map)) = current_value {
                    current_value = map.get(key);
                } else {
                    current_value = None;
                    break;
                }
            }
    
            let error_message = if let Some(Value::String(message)) = current_value {
                message.clone()
            } else {
                message_translation_key.to_string()
            };
    
            AppError::new(status_code, error_message)
    }

    pub fn format_internal_error(translations: &Translations) -> AppError {
        let mut error_message = "".to_string();

        if let Some (auth_translations) = &translations.general {
            if let Some(errors) = &auth_translations.get("errors") {
                if let Some(general_message) = &errors.get("internal_error") {
                    error_message = general_message.to_string()
                }
            }
        }

        AppError::new(StatusCode::INTERNAL_SERVER_ERROR, error_message)
    }
}
