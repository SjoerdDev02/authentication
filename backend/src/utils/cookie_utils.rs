use http::StatusCode;
use axum::body::Body;
use axum::http::{header, Response, HeaderValue};

pub fn set_cookie(
    mut response: Response<Body>,
    key: &str,
    value: &str,
    max_age: Option<u64>,
) -> Result<Response<Body>, StatusCode> {
    // Replace with the following in production: {}={}; HttpOnly; Secure; Path=/
    let mut cookie = format!("{}={}; HttpOnly; SameSite=None; Path=/", key, value);

    if let Some(seconds) = max_age {
        cookie.push_str(&format!(" Max-Age={};", seconds));
    }

    let cookie_header_value = match HeaderValue::from_str(&cookie) {
        Ok(val) => val,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    response
        .headers_mut()
        .append(header::SET_COOKIE, cookie_header_value);

    Ok(response)
}
