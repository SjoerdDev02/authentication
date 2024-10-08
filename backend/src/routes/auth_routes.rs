// use crate::{
//     models::auth_models::{LoginUser, RegisterUser},
//     services::auth_service::{login, register},
// };
// use axum::{extract::State, routing::post, Json, Router};
// use axum::{
//     extract::{FromRef, FromRequestParts},
//     http::{request::Parts, StatusCode},
//     routing::get,
// };
// use sqlx::MySqlPool;
// struct DatabaseConnection(sqlx::pool::PoolConnection<sqlx::MySql>);

// fn internal_error<E>(err: E) -> (StatusCode, String)
// where
//     E: std::error::Error,
// {
//     (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
// }
// async fn using_connection_pool_extractor(
//     State(pool): State<MySqlPool>,
// ) -> Result<String, (StatusCode, String)> {
//     sqlx::query_scalar("select 'hello world from pg'")
//         .fetch_one(&pool)
//         .await
//         .map_err(internal_error)
// }
// async fn using_connection_extractor(
//     DatabaseConnection(mut conn): DatabaseConnection,
// ) -> Result<String, (StatusCode, String)> {
//     sqlx::query_scalar("select 'hello world from pg'")
//         .fetch_one(&mut *conn)
//         .await
//         .map_err(internal_error)
// }

// pub fn app(pool: MySqlPool) -> Router {
//     Router::new()
//         .route(
//             "/register",
//             get(using_connection_pool_extractor).post(using_connection_extractor),
//         )
//         .with_state(pool)
//         .route(
//             "/login",
//             get(using_connection_pool_extractor).post(using_connection_extractor),
//         )
//         .with_state(pool)
// }
