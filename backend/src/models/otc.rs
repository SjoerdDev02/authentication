use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Otc {
    pub otc: String,
}

#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub enum OtcPayloadAction {
    ConfirmAccount,
    DeleteAccount,
    UpdateAccount,
}

#[derive(Serialize, Deserialize)]
pub struct OtcPayload {
    pub otc: String,
    pub user_id: i32,
    pub action: OtcPayloadAction,
    pub name: String,
    pub phone: Option<String>,
    pub email: String,
    pub password_hash: Option<String>,
}