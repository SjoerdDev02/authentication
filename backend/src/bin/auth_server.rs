extern crate backend;
use backend::{models::auth_models::{LoginUser, RegisterUser}, services::auth_service::{login, register}};
use dotenv::dotenv;
use axum::{routing::post, Json, Router};

use axum;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let db = backend::db::Db::new()
        .await
        .expect("Failed to connect to the database");

    let listener = TcpListener::bind("127.0.0.1:8080")
        .await
        .expect("Unable to conne to connect to the server");

    println!("Listening on {}", listener.local_addr().unwrap());

    let routes = backend::routes::auth_routes::routes(db);

    axum::serve(listener, routes)
        .await
        .expect("Error serving application");
}
