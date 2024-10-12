use axum::{routing::delete, routing::patch, routing::post, Router};

use crate::{models::auth_models::AuthState, services::auth_service::{delete_user, login_user, register_user, update_user}};

pub fn app(state: AuthState) -> Router {
    let routes = Router::new()
        .route("/register", post(register_user))
        .route("/login", post(login_user))
        .route("/update", patch(update_user))
        .route("/delete", delete(delete_user))
        .with_state(state);

    return routes;
}
