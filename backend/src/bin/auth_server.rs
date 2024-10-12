extern crate backend;
use backend::models::auth_models::AuthState;
use dotenv::dotenv;
use sqlx::mysql::MySqlPoolOptions;

use axum;
use std::{env, sync::Arc};
use tokio::{net::TcpListener, sync::Mutex};
use redis::Client;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "mysql://name:password@localhost:3306/todo_list".to_string());

    let pool = MySqlPoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Unable to connect to database");

        let redis_client = Client::open("redis://127.0.0.1/").expect("Unable to connect to Redis");

    let redis_connection = redis_client
        .get_tokio_connection()
        .await
        .expect("Unable to connect to Redis");

    let redis_connection = Arc::new(Mutex::new(redis_connection));

    let state = AuthState {
        db_pool: pool,
        redis: redis_connection
    };

    let app = backend::routes::auth_routes::app(state);

    let listener = TcpListener::bind("127.0.0.1:8080")
        .await
        .expect("Unable to connect to connect to the server");

    println!("Listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, app)
        .await
        .expect("Error serving application");
}
