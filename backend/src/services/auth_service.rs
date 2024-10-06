use crate::models::auth_models::{LoginResponse, LoginUser, RegisterUser};
use crate::utils::auth_utils::{encode_jwt, hash_password, verify_password};
use axum::{extract::Json, http::StatusCode};
use sqlx::MySqlPool;

pub async fn register(
    Json(user_data): Json<RegisterUser>,
    db: &MySqlPool,
) -> Result<Json<LoginResponse>, StatusCode> {
    if user_data.password != user_data.password_confirm {
        return Err(StatusCode::BAD_REQUEST);
    }

    let password_hash = match hash_password(&user_data.password) {
        Ok(hash) => hash,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let create_user_query = r#"
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
    "#;

    let result = sqlx::query(create_user_query)
        .bind(&user_data.name)
        .bind(&user_data.email)
        .bind(&password_hash)
        .execute(db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let user_id = result.last_insert_id();

    let select_user_query = "SELECT id, name, email FROM users WHERE id = ?;";

    let user = sqlx::query_as::<_, (i32, String, String)>(select_user_query)
        .bind(&user_id)
        .fetch_one(db)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    let (id, name, email) = user;

    let token = encode_jwt(&user_data.email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response = LoginResponse {
        id,
        token,
        name,
        email,
    };

    Ok(Json(response))
}

pub async fn login(
    Json(user_data): Json<LoginUser>,
    db: &MySqlPool,
) -> Result<Json<LoginResponse>, StatusCode> {
    let user_query = "SELECT id, name, email, password_hash FROM users WHERE email = ?;";

    let user = sqlx::query_as::<_, (i32, String, String, String)>(user_query)
        .bind(&user_data.email)
        .fetch_one(db)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    let (id, name, email, password_hash) = user;

    if !verify_password(&user_data.password, &password_hash)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let token = encode_jwt(&email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response = LoginResponse {
        id,
        token,
        name,
        email,
    };

    Ok(Json(response))
}
