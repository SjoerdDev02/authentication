use std::sync::Arc;

use crate::{
    constants::{
        auth::{BEARER_EXPIRATION_SECONDS, REFRESH_EXPIRATION_SECONDS},
        routes::PROTECTED_ROUTES,
    },
    models::{auth::models::JwtClaims, general::AppState, translations::Translations},
    utils::{
        cookie::{get_cookie, set_cookie},
        jwt::{decode_jwt, encode_jwt, format_refresh_token_key, generate_refresh_token},
        redis::{get_token, remove_token, set_token},
        responses::AppError,
        user::get_user_by_id,
    },
};
use axum::{
    body::Body,
    extract::State,
    http::{Request, StatusCode},
    middleware::Next,
    response::IntoResponse,
};

pub async fn jwt_middleware(
    State(state): State<AppState>,
    req: Request<Body>,
    next: Next,
) -> Result<impl IntoResponse, AppError> {
    let path = req.uri().path().to_string();
    let method = req.method().clone();

    let jwt_cookie = get_cookie(&req, "Bearer");
    let refresh_token_cookie = get_cookie(&req, "RefreshToken");

    let translations = req.extensions().get::<Arc<Translations>>().cloned();

    let mut request = req;

    if !PROTECTED_ROUTES.contains(&(path.as_str(), &method)) {
        return Ok(next.run(request).await);
    }

    match translations {
        Some(translations) => {
            let claims: JwtClaims;

            match jwt_cookie {
                Some(bearer) => {
                    claims = decode_jwt(&bearer)
                        .map_err(|_| AppError::format_internal_error(&translations))?
                        .claims;
                }
                None => match refresh_token_cookie {
                    Some(refresh_token) => {
                        let formatted_refresh_token_key = format_refresh_token_key(&refresh_token);
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
                                Err(_) => {
                                    return Err(AppError::format_internal_error(&translations))
                                }
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

                        let user_data = match get_user_by_id(&state, &token_payload_user_id).await {
                            Ok(user) => user,
                            Err(_) => return Err(AppError::format_internal_error(&translations)),
                        };

                        let new_jwt = encode_jwt(&user_data.0, &user_data.1, &user_data.2)
                            .map_err(|_| AppError::format_internal_error(&translations))?;

                        let new_refresh_token = generate_refresh_token();
                        let new_refresh_token_key = format_refresh_token_key(&new_refresh_token);

                        let new_jwt_claims = decode_jwt(&new_jwt)
                            .map_err(|_| AppError::format_internal_error(&translations))?
                            .claims;

                        claims = new_jwt_claims;

                        let _ = set_token(
                            &state,
                            &new_refresh_token_key,
                            &token_payload_user_id.to_string(),
                            REFRESH_EXPIRATION_SECONDS,
                        )
                        .await;

                        request = set_cookie(
                            &translations,
                            request,
                            "Bearer",
                            &new_jwt,
                            Some(BEARER_EXPIRATION_SECONDS),
                        )?;

                        // Don't need to delete the old RefreshToken from the cookies, because it is overwritten here
                        request = set_cookie(
                            &translations,
                            request,
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
                },
            }

            request.extensions_mut().insert(claims);
        }
        None => {
            return Err(AppError::format_raw_error(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to read translations",
            ))
        }
    }

    Ok(next.run(request).await)
}
