use axum::{
    body::Body,
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
};
use crate::utils::cookie_utils::get_cookie;
use std::sync::Arc;
use http::Method;

pub async fn language_middleware(
    mut req: Request<Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    if req.method() == Method::OPTIONS {
        return Ok(next.run(req).await);
    }

    let language_cookie = get_cookie(&req, "language")
        .unwrap_or_else(|| "en".to_string());

    req.extensions_mut().insert(Arc::new(language_cookie));

    Ok(next.run(req).await)
}
