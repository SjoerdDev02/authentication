use crate::models::auth::models::JwtClaims;
use crate::utils::env::get_environment_variable;
use axum::http::StatusCode;
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use rand::{distributions::Alphanumeric, thread_rng, Rng};

pub fn encode_jwt(id: &i32, name: &str, email: &str) -> Result<String, StatusCode> {
    let jwt_secret = match get_environment_variable("JWT_SECRET_KEY") {
        Ok(jwt_secret) => jwt_secret,
        Err(_) => return Err(StatusCode::BAD_REQUEST),
    };

    let now = Utc::now();
    let expire = Duration::hours(24);
    let exp = (now + expire).timestamp() as usize;
    let iat = now.timestamp() as usize;

    let claims = JwtClaims {
        exp,
        iat,
        id: *id,
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

pub fn decode_jwt(jwt: &str) -> Result<TokenData<JwtClaims>, StatusCode> {
    let jwt_secret = match get_environment_variable("JWT_SECRET_KEY") {
        Ok(jwt_secret) => jwt_secret,
        Err(_) => return Err(StatusCode::BAD_REQUEST),
    };

    let result: Result<TokenData<JwtClaims>, StatusCode> = decode(
        &jwt,
        &DecodingKey::from_secret(jwt_secret.as_ref()),
        &Validation::default(),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);

    result
}

pub fn verify_jwt(jwt: &str, expected_id: &i32) -> Result<JwtClaims, StatusCode> {
    let jwt_secret = match get_environment_variable("JWT_SECRET_KEY") {
        Ok(jwt_secret) => jwt_secret,
        Err(_) => return Err(StatusCode::BAD_REQUEST),
    };

    let token_data = decode::<JwtClaims>(
        jwt,
        &DecodingKey::from_secret(jwt_secret.as_ref()),
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
