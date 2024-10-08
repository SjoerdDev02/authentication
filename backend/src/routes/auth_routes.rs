use axum::{routing::post, Router};
use sqlx::MySqlPool;

use crate::services::auth_service::{login, register};

pub fn app(pool: MySqlPool) -> Router {
    let routes = Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
        .with_state(pool);

    return routes;
}
