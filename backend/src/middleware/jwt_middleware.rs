use crate::{
    constants::auth_constants::JWT_EXPIRATION_SECONDS,
    models::auth_models::AuthState,
    utils::{
        auth_utils::get_user_by_id,
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

pub async fn jwt_middleware(
    State(state): State<AuthState>,
    mut req: Request<Body>,
    next: Next,
) -> Result<Response<Body>, StatusCode> {
    let jwt = req
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|h| h.to_str().ok())
        .map(|t| t.trim_start_matches("Bearer ").to_string());

    let mut claims = match jwt {
        Some(token) => decode_jwt(&token).map_err(|_| StatusCode::UNAUTHORIZED)?,
        None => return Err(StatusCode::UNAUTHORIZED),
    }
    .claims;

    let mut new_jwt = None;
    let mut new_refresh_token = None;

    if claims.exp < Utc::now().timestamp() as usize {
        let refresh_token = req
            .headers()
            .get(header::COOKIE)
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

        // Generate a new JWT and refresh token
        new_jwt =
            Some(encode_jwt(&id, &name, &email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?);
        claims = decode_jwt(new_jwt.as_ref().unwrap())
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
            .claims;

        new_refresh_token = Some(generate_refresh_token());
        let new_refresh_token_key = format_refresh_token_key(new_refresh_token.as_ref().unwrap());

        // Store new refresh token and remove old one
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
    }

    // Insert claims for downstream handlers
    req.extensions_mut().insert(claims);

    // Run the next handler in the middleware chain
    let mut response = next.run(req).await;

    // Add new tokens as cookies if they were generated
    if let Some(jwt) = new_jwt {
        response.headers_mut().append(
            header::SET_COOKIE,
            format!("JWT={}; HttpOnly; Secure; Path=/", jwt)
                .parse()
                .unwrap(),
        );
    }
    if let Some(refresh_token) = new_refresh_token {
        response.headers_mut().append(
            header::SET_COOKIE,
            format!("refresh_token={}; HttpOnly; Secure; Path=/", refresh_token)
                .parse()
                .unwrap(),
        );
    }

    Ok(response)
}
