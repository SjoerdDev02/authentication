use axum::{routing::patch, Router};

use crate::{models::general::AppState, services::otc::otc_user};

pub fn otc_routes() -> Router<AppState> {
    Router::new().route("/verify", patch(otc_user))
}
