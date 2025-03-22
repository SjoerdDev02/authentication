use axum::{
    body::Body,
    http::{header, HeaderValue, Response},
};
use http::Request;

use crate::{models::translations::Translations, traits::has_headers::HasHeaders};

use crate::utils::responses::AppError;

pub fn set_cookie<T>(
    translations: &Translations,
    mut container: T,
    key: &str,
    value: &str,
    max_age: Option<i32>,
) -> Result<T, AppError>
where
    T: HasHeaders,
{
    let mut cookie = format!("{}={}; HttpOnly; SameSite=Lax; Path=/;", key, value);

    if let Some(seconds) = max_age {
        cookie.push_str(&format!(" Max-Age={};", seconds));
    }

    let cookie_header_value = HeaderValue::from_str(&cookie)
        .map_err(|_| AppError::format_internal_error(translations))?;

    container
        .headers_mut()
        .append(header::SET_COOKIE, cookie_header_value);

    Ok(container)
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
    translations: &Translations,
    mut response: Response<Body>,
    key: &str,
) -> Result<Response<Body>, AppError> {
    // Explicitly specify the return type
    // let cookie = format!("{}=; HttpOnly; Secure; Path=/; Max-Age=0;", key);
    let cookie = format!("{}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0;", key);

    let cookie_header_value = match HeaderValue::from_str(&cookie) {
        Ok(val) => val,
        Err(_) => return Err(AppError::format_internal_error(&translations)),
    };

    response
        .headers_mut()
        .append(header::SET_COOKIE, cookie_header_value);

    Ok(response)
}
