use crate::models::otc::aliases::Otc;
use crate::models::user::aliases::{Email, Id, Name, Phone};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct OtcRequest {
    pub otc: Otc,
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
    pub user_id: Id,
    pub action: OtcPayloadAction,
    pub name: Name,
    pub phone: Option<Phone>,
    pub email: Email,
    pub password_hash: Option<String>,
}
