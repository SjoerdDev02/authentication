use axum::{routing::post, Router};

use crate::services::auth_service;

pub async fn app() -> Router {
    Router::new().route("/login", post(auth_service::login))
}
