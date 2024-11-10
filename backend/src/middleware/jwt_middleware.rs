use axum::{
    extract::{State, Request},
    http::{StatusCode, Response, header},
    middleware::Next,
};
use axum::body::Body;
use crate::{constants::auth_constants::JWT_EXPIRATION_SECONDS, models::auth_models::AuthState, utils::{auth_utils::get_user_by_id, jwt_utils::{decode_jwt, encode_jwt, format_refresh_token_key, generate_refresh_token}, redis_utils::{get_token, remove_token, set_token}}};
use chrono::Utc;

pub async fn jwt_middleware(
    State(state): State<AuthState>,
    mut req: Request,
    next: Next,
) -> Result<Response<Body>, StatusCode> {
    let jwt = req
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|h| h.to_str().ok())
        .map(|t| t.trim_start_matches("Bearer ").to_string());

    let jwt = match jwt {
        Some(token) => decode_jwt(&token).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?,
        None => return Err(StatusCode::UNAUTHORIZED),
    };

    if jwt.claims.exp < Utc::now().timestamp() as usize {
        req.extensions_mut().insert(jwt.claims);
        
        let refresh_token = req
            .headers()
            .get("Cookie")
            .and_then(|h| h.to_str().ok())
            .and_then(|c| c.split("; ").find(|s| s.starts_with("refresh_token=")))
            .map(|t| t.trim_start_matches("refresh_token=").to_string());

        let refresh_token = match refresh_token {
            Some(token) => token,
            None => return Err(StatusCode::UNAUTHORIZED),
        };

        let formatted_refresh_token_key = format_refresh_token_key(&refresh_token);

        let token_payload_user_id = match get_token(&state, &formatted_refresh_token_key).await {
            Ok(Some(user_id)) => user_id,
            Ok(None) => return Err(StatusCode::UNAUTHORIZED),
            Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
        };

        let token_payload_user_id: i32 = match token_payload_user_id.parse() {
            Ok(id) => id,
            Err(_) => return Err(StatusCode::BAD_REQUEST),
        };

        let user = match get_user_by_id(&state, &token_payload_user_id).await {
            Ok(user) => user,
            Err(_) => return Err(StatusCode::NOT_FOUND),
        };

        let (id, name, email) = user;

        let new_jwt = encode_jwt(&id, &name, &email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let new_refresh_token = generate_refresh_token();
        let new_refresh_token_key = format_refresh_token_key(&new_refresh_token);

        set_token(
            &state,
            &new_refresh_token_key,
            &token_payload_user_id.to_string(),
            JWT_EXPIRATION_SECONDS,
        )
        .await;

        remove_token(&state, &formatted_refresh_token_key)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        // Clone the necessary parts: insert the new tokens into the response
        let mut response = next.run(req).await;

        response.headers_mut().append(
            header::SET_COOKIE,
            format!("JWT={}; HttpOnly; Secure; Path=/", new_jwt).parse().unwrap(),
        );
        response.headers_mut().append(
            header::SET_COOKIE,
            format!("refresh_token={}; HttpOnly; Secure; Path=/", new_refresh_token).parse().unwrap(),
        );
    
        return Ok(response);
    }

    req.extensions_mut().insert(jwt.claims);
    Ok(next.run(req).await)
}
