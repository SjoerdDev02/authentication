use chrono::NaiveDateTime;
use redis::aio::Connection;
use serde::{Deserialize, Serialize};
use sqlx::MySqlPool;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Serialize, Deserialize)]
pub struct CurrentUser {
    pub id: i32,
    pub name: String,
    pub phone: Option<String>,
    pub email: String,
    pub password_hash: String,
    pub is_confirmed: bool,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Serialize, Deserialize)]
pub struct RegisterUser {
    pub name: String,
    pub email: String,
    pub password: String,
    #[serde(rename = "passwordConfirm")]
    pub password_confirm: String,
}

#[derive(Serialize, Deserialize)]
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct ResetPasswordTokenUser {
    pub email: String,
}

#[derive(Serialize, Deserialize)]
pub struct PasswordResetUser {
    pub password: String,
    #[serde(rename = "passwordConfirm")]
    pub password_confirm: String,
}

#[derive(Serialize, Deserialize)]
pub struct PasswordResetToken {
    pub token: String,
}

#[derive(Serialize, Deserialize)]
pub struct UpdateUser {
    pub id: i32,
    pub name: String,
    pub phone: Option<String>,
    pub email: String,
    #[serde(rename = "emailConfirm")]
    pub email_confirm: Option<String>,
    pub password: Option<String>,
    #[serde(rename = "passwordConfirm")]
    pub password_confirm: Option<String>,
}

// Structure for holding JwtClaims data used in JWT tokens
#[derive(Clone, Serialize, Deserialize)]
pub struct JwtClaims {
    pub exp: usize, // Expiry time of the token
    pub iat: usize, // Issued at time of the token
    pub id: i32,
    pub name: String,
    pub email: String,
}

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

#[derive(Serialize, Deserialize, Debug)]
pub struct OtcPayload {
    pub otc: String,
    pub user_id: i32,
    pub action: OtcPayloadAction,
    pub name: String,
    pub phone: Option<String>,
    pub email: String,
    pub password_hash: Option<String>,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub id: i32,
    pub name: String,
    pub phone: Option<String>,
    pub email: String,
}

#[derive(Clone)]
pub struct AppState {
    pub db_pool: MySqlPool,
    pub redis: Arc<Mutex<Connection>>,
}
