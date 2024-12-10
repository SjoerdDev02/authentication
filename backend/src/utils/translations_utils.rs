use std::collections::HashMap;
use serde::Deserialize;
use std::fs;

#[derive(Debug, Deserialize)]
pub struct Translations {
    pub emails: HashMap<String, EmailTemplate>,
}

#[derive(Debug, Deserialize)]
pub struct EmailTemplate {
    pub subject: String,
    pub body: String,
}

pub fn load_translations(lang: &str) -> Translations {
    let path = format!("/app/src/translations/{}.json", lang.to_lowercase());
    let content = fs::read_to_string(path).expect("Could not read translation file");
    serde_json::from_str(&content).expect("Could not parse translation file")
}
