use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use crate::models::user::aliases::{Id, Name, Phone, Email, IsConfirmed, Password};

#[derive(Serialize, Deserialize)]
pub struct User {
    pub id: Id,
    pub name: Name,
    pub phone: Option<Phone>,
    pub email: Email,
    pub password_hash: String,
    pub is_confirmed: IsConfirmed,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Serialize, Deserialize)]
pub struct RegisterUser {
    pub name: Name,
    pub email: Email,
    pub password: Password,
    #[serde(rename = "passwordConfirm")]
    pub password_confirm: Password,
}

#[derive(Serialize, Deserialize)]
pub struct PasswordResetUser {
    pub password: Password,
    #[serde(rename = "passwordConfirm")]
    pub password_confirm: Password,
}

#[derive(Serialize, Deserialize)]
pub struct PasswordResetToken {
    pub token: String,
}

#[derive(Serialize, Deserialize)]
pub struct UpdateUser {
    pub id: Id,
    pub name: Name,
    pub phone: Option<Phone>,
    pub email: Email,
    #[serde(rename = "emailConfirm")]
    pub email_confirm: Option<Email>,
    pub password: Option<Password>,
    #[serde(rename = "passwordConfirm")]
    pub password_confirm: Option<Password>,
}