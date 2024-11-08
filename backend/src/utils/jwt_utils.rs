use axum::http::StatusCode;
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};

use crate::models::auth_models::Claims;

pub fn encode_jwt(id: &i32, name: &str, email: &str) -> Result<String, StatusCode> {
    let jwt_secret = "randomstring".to_string();

    let now = Utc::now();
    let expire = Duration::hours(24);
    let exp = (now + expire).timestamp() as usize;
    let iat = now.timestamp() as usize;

    let claims = Claims {
        exp,
        iat,
        id: id.clone(),
        name: name.to_string(),
        email: email.to_string(),
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(jwt_secret.as_ref()),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

pub fn decode_jwt(jwt: &str) -> Result<TokenData<Claims>, StatusCode> {
    let secret = "randomstring".to_string();

    let result: Result<TokenData<Claims>, StatusCode> = decode(
        &jwt,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::default(),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);

    result
}

pub fn verify_jwt(jwt: &str, expected_id: &i32) -> Result<Claims, StatusCode> {
    let secret = "your_secret_key";

    let token_data = decode::<Claims>(
        jwt,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::default(),
    )
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    if token_data.claims.id != expected_id.clone() {
        return Err(StatusCode::UNAUTHORIZED);
    }

    Ok(token_data.claims)
}

pub fn generate_refresh_token() -> String {
    let token: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(12)
        .map(char::from)
        .map(|c| c.to_ascii_uppercase())
        .collect();

    token
}

pub fn format_refresh_token_key(refresh_token_value: &str) -> String {
    let token_key = format!("refresh:{}", refresh_token_value);

    token_key
}
