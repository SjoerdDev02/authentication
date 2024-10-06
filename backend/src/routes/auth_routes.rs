use axum::{routing::post, Json, Router};
use sqlx::MySqlPool;

use crate::{models::auth_models::{LoginUser, RegisterUser}, services::auth_service::{login, register}};

pub fn app(db: MySqlPool) -> Router {
    Router::new()
    .route(
        "/register",
        post(|data: Json<RegisterUser>| register(data, &db)),
    )
    .route(
        "/login", 
        post(|data: Json<LoginUser>| login(data, &db)),
    )
}
