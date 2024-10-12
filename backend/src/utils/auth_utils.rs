use crate::{
    models::auth_models::{AuthState, Claims},
    queries::auth_queries::{
        CREATE_USER, DELETE_USER, GET_USER_BY_EMAIL, GET_USER_BY_ID, UPDATE_USER_EMAIL_AND_NAME,
        UPDATE_USER_PASSWORD,
    },
};
use axum::http::StatusCode;
use bcrypt::{hash, verify, DEFAULT_COST};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use sqlx::mysql::MySqlQueryResult;

pub fn verify_password(password: &str, hash: &str) -> Result<bool, bcrypt::BcryptError> {
    verify(password, hash)
}

pub fn hash_password(password: &str) -> Result<String, bcrypt::BcryptError> {
    let hash = hash(password, DEFAULT_COST)?;
    Ok(hash)
}

pub fn encode_jwt(email: &str) -> Result<String, StatusCode> {
    let jwt_token: String = "randomstring".to_string();

    let now = Utc::now();
    let expire: chrono::TimeDelta = Duration::hours(24);
    let exp: usize = (now + expire).timestamp() as usize;
    let iat: usize = now.timestamp() as usize;

    let claim = Claims {
        iat,
        exp,
        email: email.to_string(),
    };
    let secret = jwt_token.clone();

    encode(
        &Header::default(),
        &claim,
        &EncodingKey::from_secret(secret.as_ref()),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

pub fn decode_jwt(jwt: String) -> Result<TokenData<Claims>, StatusCode> {
    let secret = "randomstring".to_string();

    let result: Result<TokenData<Claims>, StatusCode> = decode(
        &jwt,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::default(),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);
    result
}

pub fn format_jwt_token_key(id: &i32) -> String {
    let token = format!("jwt:{}", id);

    token
}

pub async fn get_user_by_email(
    state: &AuthState,
    email: &str,
) -> Result<(i32, String, String, String), StatusCode> {
    let user = sqlx::query_as::<_, (i32, String, String, String)>(GET_USER_BY_EMAIL)
        .bind(email)
        .fetch_one(&state.db_pool)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED);

    user
}

pub async fn get_user_by_id(
    state: &AuthState,
    id: &i32,
) -> Result<(i32, String, String), StatusCode> {
    let user = sqlx::query_as::<_, (i32, String, String)>(GET_USER_BY_ID)
        .bind(&id)
        .fetch_one(&state.db_pool)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED);

    user
}

pub async fn create_user(
    state: &AuthState,
    name: &str,
    email: &str,
    password: &str,
) -> Result<MySqlQueryResult, StatusCode> {
    let password_hash = match hash_password(&password) {
        Ok(hash) => hash,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let created_user_result = sqlx::query(CREATE_USER)
        .bind(name)
        .bind(email)
        .bind(password_hash)
        .execute(&state.db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);

    created_user_result
}

pub async fn update_user_email_and_name(
    state: &AuthState,
    id: &i32,
    name: &str,
    email: &str,
) -> Result<MySqlQueryResult, StatusCode> {
    let update_user_result = sqlx::query(UPDATE_USER_EMAIL_AND_NAME)
        .bind(email)
        .bind(name)
        .bind(id)
        .execute(&state.db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);

    update_user_result
}

pub async fn update_user_password(
    state: &AuthState,
    id: &i32,
    password: &str,
    password_confirm: &str,
) -> Result<MySqlQueryResult, StatusCode> {
    if password != password_confirm {
        return Err(StatusCode::BAD_REQUEST);
    }

    let password_hash = match hash_password(password) {
        Ok(hash) => hash,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let update_user_result = sqlx::query(UPDATE_USER_PASSWORD)
        .bind(password_hash)
        .bind(id)
        .execute(&state.db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);

    update_user_result
}

pub async fn delete_user_by_id(
    state: &AuthState,
    id: &i32,
) -> Result<MySqlQueryResult, StatusCode> {
    let delete_user_result = sqlx::query(DELETE_USER)
        .bind(id)
        .execute(&state.db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);

    delete_user_result
}
