use crate::models::auth_models::AuthState;
use redis::AsyncCommands;

use super::auth_utils::format_jwt_token_key;

pub async fn set_token(state: &AuthState, key: &str, value: &str, expiration_seconds: i32) {
    let mut redis_con = state.redis.lock().await;

    let _: () = redis::cmd("SETEX")
        .arg(key)
        .arg(expiration_seconds)
        .arg(value)
        .query_async(&mut *redis_con)
        .await
        .unwrap();
}

pub async fn get_token(state: &AuthState, id: &i32) -> Result<Option<String>, redis::RedisError> {
    let mut redis_con = state.redis.lock().await;

    let key = format_jwt_token_key(&id);

    let token: Option<String> = redis_con.get(&key).await?;

    Ok(token)
}

pub async fn verify_token(state: &AuthState, id: &i32, expected_value: &str) -> bool {
    match get_token(state, id).await {
        Ok(Some(token)) => token == expected_value,
        Ok(None) => false,
        Err(_) => false,
    }
}
