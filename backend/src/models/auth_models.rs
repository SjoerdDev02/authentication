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
    pub password_confirm: String,
}

#[derive(Serialize, Deserialize)]
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct UpdateUser {
    pub id: i32,
    pub name: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,
    pub password_confirm: Option<String>,
}

#[derive(Deserialize)]
pub struct DeleteUser {
    pub id: i32,
    pub jwt: String,
}

#[derive(Serialize, Deserialize)]
pub struct Refresh {
    pub refresh: String,
}

// Structure for holding claims data used in JWT tokens
#[derive(Serialize, Deserialize)]
pub struct Claims {
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
    UpdateNameAndEmail,
    UpdatePassword,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct OtcPayload {
    pub otc: String,
    pub user_id: i32,
    pub action: OtcPayloadAction,
    pub name: Option<String>,
    pub email: Option<String>,
    pub password_hash: Option<String>,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub jwt: Option<String>,
    pub refresh: Option<String>,
    pub id: i32,
    pub name: String,
    pub email: String,
}

#[derive(Serialize)]
pub struct MinifiedAuthResponse {
    pub name: String,
    pub email: String,
}

#[derive(Clone)]
pub struct AuthState {
    pub db_pool: MySqlPool,
    pub redis: Arc<Mutex<Connection>>,
}
