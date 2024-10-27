extern crate backend;
use backend::models::auth_models::AuthState;
use dotenv::dotenv;
use sqlx::{migrate, mysql::MySqlPoolOptions};

use axum;
use redis::Client;
use std::{env, sync::Arc};
use tokio::{net::TcpListener, sync::Mutex};

#[tokio::main]
async fn main() {
    dotenv().ok();

    // Use Docker service name "db" to reference MySQL
    let database_url = env::var("DATABASE_URL")
        // .unwrap_or_else(|_| "mysql://name:password@localhost:3306/authentication".to_string());
        .unwrap_or_else(|_| "mysql://root:root@db:3306/authentication".to_string());

    println!("url:{}", database_url);
    
    let pool = MySqlPoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Unable to connect to database");

        // sqlx::migrate!("../migrations")
        // .run(&pool)
        // .await
        // .expect("Unable to run database migrations");

    // Use Docker service name "redis" to reference Redis
    // let redis_client = Client::open("redis://127.0.0.1/").expect("Unable to connect to Redis");
    let redis_url = env::var("REDIS_URL").unwrap_or_else(|_| "redis://redis/".to_string());
    let redis_client = Client::open(redis_url).expect("Unable to connect to Redis");

    let redis_connection = redis_client
        .get_tokio_connection()
        .await
        .expect("Unable to connect to Redis");

    let redis_connection = Arc::new(Mutex::new(redis_connection));

    let state = AuthState {
        db_pool: pool,
        redis: redis_connection,
    };

    let app = backend::routes::auth_routes::app(state);

    // Bind to 0.0.0.0 to allow connections from other containers
    // let listener = TcpListener::bind("127.0.0.1:8080")
    let listener = TcpListener::bind("0.0.0.0:8080")
        .await
        .expect("Unable to bind to the server");

    println!("Listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, app)
        .await
        .expect("Error serving application");
}
