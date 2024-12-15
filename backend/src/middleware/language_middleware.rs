use crate::utils::{cookie_utils::get_cookie, translations_utils::load_translations};
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

    let translations = load_translations(&language_cookie);

    req.extensions_mut().insert(Arc::new(translations));

    Ok(next.run(req).await)
}
