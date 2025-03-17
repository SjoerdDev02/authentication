use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct ResetPasswordTokenUser {
    pub email: String,
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

#[derive(Serialize)]
pub struct AuthResponse {
    pub id: i32,
    pub name: String,
    pub phone: Option<String>,
    pub email: String,
}
