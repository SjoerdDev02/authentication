use crate::models::auth_models::AppState;
use axum::http::StatusCode;
use redis::{AsyncCommands, RedisError};

pub async fn set_token(
    state: &AppState,
    key: &str,
    value: &str,
    expiration_seconds: i32,
) -> Result<(), RedisError> {
    let mut redis_con = state.redis.lock().await;

    let result: Result<(), redis::RedisError> = redis::cmd("SETEX")
        .arg(key)
        .arg(expiration_seconds)
        .arg(value)
        .query_async(&mut *redis_con)
        .await;

    result
}

pub async fn get_token(state: &AppState, key: &str) -> Result<Option<String>, redis::RedisError> {
    let mut redis_con = state.redis.lock().await;

    let token_json: Option<String> = redis_con.get(key).await?;

    Ok(token_json)
}

pub async fn remove_token(state: &AppState, key: &str) -> Result<(), redis::RedisError> {
    let mut redis_con = state.redis.lock().await;

    let _: () = redis_con.del(key).await?;

    Ok(())
}

pub async fn verify_token(state: &AppState, key: &str, id: &i32) -> Result<(), StatusCode> {
    let token = get_token(state, key)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match token {
        Some(token_value) => {
            if token_value == id.to_string() {
                Ok(())
            } else {
                Err(StatusCode::UNAUTHORIZED)
            }
        }
        None => Err(StatusCode::UNAUTHORIZED),
    }
}
