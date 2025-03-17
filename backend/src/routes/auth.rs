use axum::{routing::post, Router};

use crate::{
    models::general::AppState, services::auth::{login_user, logout_user, refresh}
};

pub fn auth_routes() -> Router<AppState> {
    Router::new()
        .route("/token", post(refresh))
        .route("/", post(login_user))
        .route("/logout", post(logout_user))
}
