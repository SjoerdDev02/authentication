use crate::utils::{cookie::get_cookie, translations::load_translations};
use axum::{
    body::Body,
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
};
use http::Method;
use std::sync::Arc;

pub async fn language_middleware(
    mut req: Request<Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    if req.method() == Method::OPTIONS {
        return Ok(next.run(req).await);
    }

    let language_cookie = match get_cookie(&req, "language") {
        Some(cookie) => cookie,
        None => "en".to_string(),
    };

    let translations = match load_translations(&language_cookie) {
        Ok(translations) => translations,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    req.extensions_mut().insert(Arc::new(translations));

    Ok(next.run(req).await)
}
