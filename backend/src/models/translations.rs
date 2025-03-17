use serde::Deserialize;
use serde_json::Value;

#[derive(Debug, Deserialize)]
pub struct Translations {
    pub general: Option<Value>,
    pub auth: Option<Value>,
}
