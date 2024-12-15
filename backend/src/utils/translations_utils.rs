use std::fs;
use http::StatusCode;
use serde_json;

use crate::models::translations_models::Translations;

pub fn load_translations(lang: &str) -> Result<Translations, StatusCode> {
    let path = format!("/app/src/translations/{}.json", lang.to_lowercase());

    let content = match fs::read_to_string(&path) {
        Ok(content) => content,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    match serde_json::from_str::<Translations>(&content) {
        Ok(translations) => Ok(translations),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}
