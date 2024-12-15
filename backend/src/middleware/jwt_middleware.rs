use crate::{
    constants::auth_constants::{BEARER_EXPIRATION_SECONDS, REFRESH_EXPIRATION_SECONDS},
    models::auth_models::AuthState,
    utils::{
        cookie_utils::{delete_cookie, get_cookie, set_cookie},
        jwt_utils::{decode_jwt, encode_jwt, format_refresh_token_key, generate_refresh_token},
        redis_utils::{get_token, remove_token, set_token},
    },
};
use axum::{
    body::Body,
    extract::State,
    http::{Request, Response, StatusCode},
    middleware::Next,
};
use http::Method;

pub async fn jwt_middleware(
    State(state): State<AuthState>,
    req: Request<Body>,
    next: Next,
) -> Result<Response<Body>, StatusCode> {
    if req.method() == Method::OPTIONS {
        return Ok(next.run(req).await);
    }

    let jwt_cookie = get_cookie(&req, "Bearer");

    let claims = match &jwt_cookie {
        Some(token) => decode_jwt(&token).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?,
        None => return Err(StatusCode::UNAUTHORIZED),
    }
    .claims;

    let mut response = Response::new(Body::empty());

    if jwt_cookie.is_none() {
        let refresh_token_cookie = get_cookie(&req, "RefreshToken");

        match refresh_token_cookie {
            Some(token) => {
                let formatted_refresh_token_key = format_refresh_token_key(&token);
                let token_payload_user_id =
                    match get_token(&state, &formatted_refresh_token_key).await {
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

                response = delete_cookie(response, "RefreshToken")?;

                let new_jwt = encode_jwt(&claims.id, &claims.name, &claims.email)
                    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
                let new_refresh_token = generate_refresh_token();
                let new_refresh_token_key = format_refresh_token_key(&new_refresh_token);

                let _ = set_token(
                    &state,
                    &new_refresh_token_key,
                    &token_payload_user_id.to_string(),
                    REFRESH_EXPIRATION_SECONDS,
                )
                .await;

                response = set_cookie(
                    response,
                    "Bearer",
                    &new_jwt,
                    Some(BEARER_EXPIRATION_SECONDS),
                )?;
                response = set_cookie(
                    response,
                    "RefreshToken",
                    &new_refresh_token,
                    Some(REFRESH_EXPIRATION_SECONDS),
                )?;
            }
            None => return Err(StatusCode::UNAUTHORIZED),
        }
    }

    Ok(response)
}
