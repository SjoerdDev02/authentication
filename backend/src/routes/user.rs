use axum::{
    routing::{delete, get, patch, post},
    Router,
};

use crate::{
    models::general::AppState,
    services::user::{
        delete_user, get_user, register_user, request_password_reset_token, reset_password_with_token, update_user
    },
};

pub fn user_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(get_user))
        .route("/", post(register_user))
        .route("/", patch(update_user))
        .route("/", delete(delete_user))
        .route(
            "/reset-password/request",
            post(request_password_reset_token),
        )
        .route("/reset-password", patch(reset_password_with_token))
}
