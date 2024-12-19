use http::StatusCode;
use serde_json;

use crate::{models::translations_models::Translations, translations::{DE_TRANSLATIONS, EN_TRANSLATIONS, ES_TRANSLATIONS, FR_TRANSLATIONS, NL_TRANSLATIONS}};

pub fn load_translations(lang: &str) -> Result<Translations, StatusCode> {
    let lang = lang.to_lowercase();

    let translations = match lang.as_str() {
        "en" => EN_TRANSLATIONS,
        "nl" => NL_TRANSLATIONS,
        "de" => DE_TRANSLATIONS,
        "es" => ES_TRANSLATIONS,
        "fr" => FR_TRANSLATIONS,
        _ => "",
    };

    if translations.is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }

    match serde_json::from_str::<Translations>(&translations) {
        Ok(translations) => Ok(translations),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}
