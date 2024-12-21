use serde::Deserialize;
use serde_json::Value;

#[derive(Debug, Deserialize)]
pub struct Translations {
    pub emails: Option<Value>,
    pub errors: Option<Value>,
}
