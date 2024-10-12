use axum::{routing::delete, routing::patch, routing::post, Router};
use sqlx::MySqlPool;

use crate::services::auth_service::{delete_user, login_user, register_user, update_user};

pub fn app(pool: MySqlPool) -> Router {
    println!("In the routerrr");
    let routes = Router::new()
        .route("/register", post(register_user))
        .route("/login", post(login_user))
        .route("/update", patch(update_user))
        .route("/delete", delete(delete_user))
        .with_state(pool);

    return routes;
}
