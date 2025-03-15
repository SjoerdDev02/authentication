use axum::{routing::patch, Router};

use crate::{models::auth_models::AppState, services::otc::otc_user};

pub fn otc_routes() -> Router<AppState> {
    Router::new().route("/verify", patch(otc_user))
}
