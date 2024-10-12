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
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Serialize, Deserialize)]
pub struct RegisterUser {
    pub email: String,
    pub name: String,
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
    pub email: Option<String>,
    pub name: Option<String>,
    pub password: Option<String>,
    pub password_confirm: Option<String>,
}

#[derive(Deserialize)]
pub struct DeleteUser {
    pub id: i32,
    pub jwt: String,
}

// Structure for holding claims data used in JWT tokens
#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub exp: usize,    // Expiry time of the token
    pub iat: usize,    // Issued at time of the token
    pub email: String, // Email associated with the token
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub id: i32,
    pub name: String,
    pub email: String,
}

#[derive(Clone)]
pub struct AuthState {
    pub db_pool: MySqlPool,
    pub redis: Arc<Mutex<Connection>>,
}
