use axum::{body::Body, http::Request, response::Response};
use http::HeaderMap;

pub trait HasHeaders {
    fn headers_mut(&mut self) -> &mut HeaderMap;
}

impl HasHeaders for Response<Body> {
    fn headers_mut(&mut self) -> &mut HeaderMap {
        self.headers_mut()
    }
}

impl HasHeaders for Request<Body> {
    fn headers_mut(&mut self) -> &mut HeaderMap {
        self.headers_mut()
    }
}
