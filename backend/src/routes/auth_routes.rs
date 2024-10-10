use axum::{routing::post, routing::patch, routing::delete, Router};
use sqlx::MySqlPool;

use crate::services::auth_service::{login_user, register_user, update_user, delete_user};

pub fn app(pool: MySqlPool) -> Router {
    let routes = Router::new()
        .route("/register", post(register_user))
        .route("/login", post(login_user))
        .route("/update", patch(update_user))
        .route("/delete", delete(delete_user))
        .with_state(pool);

    return routes;
}
