extern crate backend;
use dotenv::dotenv;
use sqlx::mysql::MySqlPoolOptions;

use axum;
use std::env;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "mysql://name:password@localhost:3306/todo_list".to_string());

    let pool = MySqlPoolOptions::new()
        .connect(&database_url)
        .await
        .expect("can't connect to database");

    let app = backend::routes::auth_routes::app(pool);

    let listener = TcpListener::bind("127.0.0.1:8080")
        .await
        .expect("Unable to conne to connect to the server");

    println!("Listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, app)
        .await
        .expect("Error serving application");
}
