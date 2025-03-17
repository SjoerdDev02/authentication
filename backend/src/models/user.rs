use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct User {
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