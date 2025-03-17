use crate::{
    constants::{
        auth::{BEARER_EXPIRATION_SECONDS, REFRESH_EXPIRATION_SECONDS},
        routes::PROTECTED_ROUTES,
    },
    models::{general::AppState, translations::Translations},
    utils::{
        cookie::{delete_cookie, get_cookie, set_cookie},
        jwt::{decode_jwt, encode_jwt, format_refresh_token_key, generate_refresh_token},
        redis::{get_token, remove_token, set_token},
        responses::AppError,
    },
};
use axum::{
    body::Body,
    extract::State,
    http::{Request, Response, StatusCode},
    // middleware::Next,
    response::IntoResponse,
};

pub async fn jwt_middleware(
    State(state): State<AppState>,
    req: Request<Body>,
    // next: Next,
) -> Result<impl IntoResponse, AppError> {
    let mut response = Response::new(Body::empty());

    if let Some(translations) = req.extensions().get::<Translations>() {
        let path = req.uri().path();
        let method = req.method();

        if !PROTECTED_ROUTES.contains(&(path, method)) {
            // return Ok(next.run(req).await);
            return Ok(response);
        }

        let jwt_cookie = get_cookie(&req, "Bearer");

        let claims = match &jwt_cookie {
            Some(token) => {
                decode_jwt(&token).map_err(|_| AppError::format_internal_error(&translations))?
            }
            None => {
                return Err(AppError::format_error(
                    &translations,
                    StatusCode::UNAUTHORIZED,
                    "auth.errors.failed_to_read_token_payload",
                ))
            }
        }
        .claims;

        if jwt_cookie.is_none() {
            let refresh_token_cookie = get_cookie(&req, "RefreshToken");

            match refresh_token_cookie {
                Some(token) => {
                    let formatted_refresh_token_key = format_refresh_token_key(&token);
                    let token_payload_user_id =
                        match get_token(&state, &formatted_refresh_token_key).await {
                            Ok(Some(user_id)) => user_id,
                            Ok(None) => {
                                return Err(AppError::format_error(
                                    &translations,
                                    StatusCode::UNAUTHORIZED,
                                    "auth.errors.failed_to_read_token_payload",
                                ))
                            }
                            Err(_) => return Err(AppError::format_internal_error(&translations)),
                        };

                    let token_payload_user_id: i32 = match token_payload_user_id.parse() {
                        Ok(id) => id,
                        Err(_) => {
                            return Err(AppError::format_error(
                                &translations,
                                StatusCode::UNAUTHORIZED,
                                "auth.errors.failed_to_read_token_payload",
                            ))
                        }
                    };

                    remove_token(&state, &formatted_refresh_token_key)
                        .await
                        .map_err(|_| AppError::format_internal_error(&translations))?;

                    response = delete_cookie(&translations, response, "RefreshToken")?;

                    let new_jwt = encode_jwt(&claims.id, &claims.name, &claims.email)
                        .map_err(|_| AppError::format_internal_error(&translations))?;
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
                        &translations,
                        response,
                        "Bearer",
                        &new_jwt,
                        Some(BEARER_EXPIRATION_SECONDS),
                    )?;
                    response = set_cookie(
                        &translations,
                        response,
                        "RefreshToken",
                        &new_refresh_token,
                        Some(REFRESH_EXPIRATION_SECONDS),
                    )?;
                }
                None => {
                    return Err(AppError::format_error(
                        &translations,
                        StatusCode::UNAUTHORIZED,
                        "auth.errors.failed_to_read_token_payload",
                    ))
                }
            }
        }
    }

    Ok(response)
}
