use crate::{
    models::general::AppState,
    queries::user::{
        CONFIRM_USER, CREATE_USER, DELETE_USER, GET_USER_BY_EMAIL, GET_USER_BY_ID,
        UPDATE_NON_SENSITIVE_USER_FIELDS, UPDATE_USER_EMAIL, UPDATE_USER_PASSWORD,
    },
    utils::auth::hash_password,
};
use axum::http::StatusCode;
use sqlx::mysql::MySqlQueryResult;

pub fn format_reset_token_key(token: &str) -> String {
    let reset_token_key = format!("reset-token:{}", token);

    reset_token_key
}

pub async fn get_user_by_email(
    state: &AppState,
    email: &str,
) -> Result<(i32, String, String, String, Option<String>, bool), StatusCode> {
    let user =
        sqlx::query_as::<_, (i32, String, String, String, Option<String>, bool)>(GET_USER_BY_EMAIL)
            .bind(email)
            .fetch_one(&state.db_pool)
            .await
            .map_err(|_| StatusCode::UNAUTHORIZED);

    user
}

pub async fn get_user_by_id(
    state: &AppState,
    id: &i32,
) -> Result<(i32, String, String, Option<String>, bool), StatusCode> {
    let user = sqlx::query_as::<_, (i32, String, String, Option<String>, bool)>(GET_USER_BY_ID)
        .bind(id)
        .fetch_one(&state.db_pool)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED);

    user
}

pub async fn create_user(
    state: &AppState,
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

pub async fn update_non_sensitive_user_fields(
    state: &AppState,
    id: &i32,
    name: &str,
    phone: Option<&str>,
) -> Result<MySqlQueryResult, StatusCode> {
    let update_user_result = sqlx::query(UPDATE_NON_SENSITIVE_USER_FIELDS)
        .bind(name)
        .bind(phone)
        .bind(id)
        .execute(&state.db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);

    update_user_result
}

pub async fn update_user_email(
    state: &AppState,
    id: &i32,
    email: &str,
) -> Result<MySqlQueryResult, StatusCode> {
    let update_user_result = sqlx::query(UPDATE_USER_EMAIL)
        .bind(email)
        .bind(id)
        .execute(&state.db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);

    update_user_result
}

pub async fn update_user_password(
    state: &AppState,
    id: &i32,
    password_hash: &str,
) -> Result<MySqlQueryResult, StatusCode> {
    let update_user_result = sqlx::query(UPDATE_USER_PASSWORD)
        .bind(password_hash)
        .bind(id)
        .execute(&state.db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);

    update_user_result
}

pub async fn delete_user_by_id(state: &AppState, id: &i32) -> Result<MySqlQueryResult, StatusCode> {
    let delete_user_result = sqlx::query(DELETE_USER)
        .bind(id)
        .execute(&state.db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);

    delete_user_result
}

pub async fn confirm_user(state: &AppState, id: &i32) -> Result<MySqlQueryResult, StatusCode> {
    let confirm_user_result = sqlx::query(CONFIRM_USER)
        .bind(id)
        .execute(&state.db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);

    confirm_user_result
}
