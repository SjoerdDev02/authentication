use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

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
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct RegisterUser {
    pub email: String,
    pub name: String,
    pub password: String,
    pub password_confirm: String,
}

// Structure for holding claims data used in JWT tokens
#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub exp: usize,    // Expiry time of the token
    pub iat: usize,    // Issued at time of the token
    pub email: String, // Email associated with the token
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub id: i32,
    pub name: String,
    pub email: String,
}
