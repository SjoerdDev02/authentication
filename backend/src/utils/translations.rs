use http::StatusCode;

use crate::{
    models::translations_models::Translations,
    translations::{
        DE_TRANSLATIONS, EN_TRANSLATIONS, ES_TRANSLATIONS, FR_TRANSLATIONS, NL_TRANSLATIONS,
    },
};
use serde_json::{from_str, Value};

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

    match from_str::<Translations>(&translations) {
        Ok(translations) => Ok(translations),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub fn get_translation_by_key(translations: &Translations, key: &str) -> String {
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
