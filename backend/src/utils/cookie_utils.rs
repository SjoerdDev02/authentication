use http::{Request, StatusCode};
use axum::body::Body;
use axum::http::{header, Response, HeaderValue};

pub fn set_cookie(
    mut response: Response<Body>,
    key: &str,
    value: &str,
    max_age: Option<i32>,
) -> Result<Response<Body>, StatusCode> {
        // Replace with the following in production: {}={}; HttpOnly; Secure; Path=/
    let mut cookie = format!("{}={}; HttpOnly; SameSite=None; Path=/;", key, value);

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

pub fn get_cookie(request: &Request<Body>, key: &str) -> Option<String> {
    if let Some(cookie_header) = request.headers().get(header::COOKIE) {
        if let Ok(cookie_str) = cookie_header.to_str() {
            for cookie in cookie_str.split(';') {
                let cookie = cookie.trim();
                if let Some((k, v)) = cookie.split_once('=') {
                    if k == key {
                        return Some(v.to_string());
                    }
                }
            }
        }
    }
    None
}

pub fn delete_cookie(
    mut response: Response<Body>,
    key: &str,
) -> Result<Response<Body>, StatusCode> {
    let cookie = format!(
        "{}=; HttpOnly; SameSite=None; Path=/; Max-Age=0;",
        key
    );

    let cookie_header_value = match HeaderValue::from_str(&cookie) {
        Ok(val) => val,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    response
        .headers_mut()
        .append(header::SET_COOKIE, cookie_header_value);

    Ok(response)
}