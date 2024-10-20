use crate::models::auth_models::AuthState;
use redis::AsyncCommands;

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

pub async fn get_token(state: &AuthState, key: &str) -> Result<Option<String>, redis::RedisError> {
    let mut redis_con = state.redis.lock().await;

    let token_json: Option<String> = redis_con.get(key).await?;

    Ok(token_json)
}

pub async fn remove_token(state: &AuthState, key: &str) -> Result<(), redis::RedisError> {
    let mut redis_con = state.redis.lock().await;

    let _: () = redis_con.del(key).await?;

    Ok(())
}
