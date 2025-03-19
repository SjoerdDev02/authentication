use serde::{Deserialize, Serialize};
use crate::models::user::aliases::{Id, Name, Phone, Email, Password};

#[derive(Serialize, Deserialize)]
pub struct LoginUser {
    pub email: Email,
    pub password: Password,
}

#[derive(Serialize, Deserialize)]
pub struct ResetPasswordTokenUser {
    pub email: Email,
}

// Structure for holding JwtClaims data used in JWT tokens
#[derive(Clone, Serialize, Deserialize)]
pub struct JwtClaims {
    pub exp: usize, // Expiry time of the token
    pub iat: usize, // Issued at time of the token
    pub id: Id,
    pub name: Name,
    pub email: Email,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub id: Id,
    pub name: Name,
    pub phone: Option<Phone>,
    pub email: Email,
}
