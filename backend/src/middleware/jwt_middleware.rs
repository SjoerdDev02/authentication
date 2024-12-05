use crate::{
    constants::auth_constants::JWT_EXPIRATION_SECONDS,
    models::auth_models::AuthState,
    utils::{
        jwt_utils::{decode_jwt, encode_jwt, format_refresh_token_key, generate_refresh_token},
        redis_utils::{get_token, remove_token, set_token},
    },
};
use axum::body::Body;
use axum::{
    extract::State,
    http::{header, Request, Response, StatusCode},
    middleware::Next,
};
use chrono::Utc;
use http::Method;

pub async fn jwt_middleware(
    State(state): State<AuthState>,
    req: Request<Body>,
    next: Next,
) -> Result<Response<Body>, StatusCode> {
    if req.method() == Method::OPTIONS {
        return Ok(next.run(req).await);
    }

    let jwt = req
        .headers().get(header::COOKIE)
        .and_then(|h| h.to_str().ok())
        .map(|t| t.trim_start_matches("Bearer").to_string());

    // TODO: Remove this when debugging is finished
    match &jwt {
        Some(token) => println!("JWT: {}", token),
        None => println!("JWT is None"),
    }

    let claims = match jwt {
        Some(token) => decode_jwt(&token).map_err(|_| StatusCode::UNAUTHORIZED)?,
        None => return Err(StatusCode::UNAUTHORIZED),
    }
    .claims;

    let mut response = Response::new(Body::empty());

    if claims.exp < Utc::now().timestamp() as usize {
        let refresh_token = req
            .headers()
            .get(header::COOKIE)
            .and_then(|h| h.to_str().ok())
            .and_then(|c| c.split("; ").find(|s| s.starts_with("RefreshToken")))
            .map(|t| t.trim_start_matches("RefreshToken").to_string());

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

        remove_token(&state, &formatted_refresh_token_key)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        let new_jwt = encode_jwt(&claims.id, &claims.name, &claims.email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let refresh_token = generate_refresh_token();
        let refresh_token_key = format_refresh_token_key(&refresh_token);

        set_token(
            &state,
            &refresh_token_key,
            &token_payload_user_id.to_string(),
            JWT_EXPIRATION_SECONDS,
        )
        .await;

        let jwt_cookie = if cfg!(debug_assertions) {
            // Development: Allow cross-origin with SameSite=None
            format!("Bearer={}; HttpOnly; SameSite=None; Path=/", new_jwt)
        } else {
            // Production: Omit SameSite=None for stricter security
            format!("Bearer={}; HttpOnly; Secure; Path=/", new_jwt)
        };
    
        let jwt_cookie = jwt_cookie.parse().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
        let refresh_cookie = if cfg!(debug_assertions) {
            // Development: Allow cross-origin with SameSite=None
            format!(
                "RefreshToken={}; HttpOnly; SameSite=None; Path=/; Max-Age={}",
                refresh_token, JWT_EXPIRATION_SECONDS
            )
        } else {
            // Production: Omit SameSite=None for stricter security
            format!(
                "RefreshToken={}; HttpOnly; Secure; Path=/; Max-Age={}",
                refresh_token, JWT_EXPIRATION_SECONDS
            )
        };
    
        let refresh_cookie = refresh_cookie.parse().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
        response.headers_mut().append(header::SET_COOKIE, jwt_cookie);
        response.headers_mut().append(header::SET_COOKIE, refresh_cookie);
    }

    Ok(response)
}
