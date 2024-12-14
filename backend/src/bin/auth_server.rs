use backend::models::auth_models::AuthState;
use dotenv::dotenv;
use http::{header, HeaderValue, Method};
use redis::Client;
use sqlx::mysql::MySqlPoolOptions;
use std::{env, sync::Arc};
use tokio::{net::TcpListener, sync::Mutex};
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "mysql://root:root@db:3306/authentication".to_string());

    let pool = MySqlPoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Unable to connect to database");

    let redis_url = env::var("REDIS_URL").unwrap_or_else(|_| "redis://redis/".to_string());

    let redis_client = match Client::open(redis_url) {
        Ok(client) => client,
        Err(err) => {
            eprintln!("Error connecting to Redis: {}", err);
            std::process::exit(1);
        }
    };

    let redis_connection = match redis_client.get_tokio_connection().await {
        Ok(connection) => connection,
        Err(err) => {
            eprintln!("Error setting up Redis connection: {}", err);
            std::process::exit(1);
        }
    };

    let redis_connection = Arc::new(Mutex::new(redis_connection));

    let state = AuthState {
        db_pool: pool,
        redis: redis_connection,
    };

    let app = backend::routes::auth_routes::app(state);

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_methods(vec![
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::PATCH,
            Method::DELETE
        ])
        .allow_headers(vec![
            header::CONTENT_TYPE,
            header::AUTHORIZATION,
            header::COOKIE
        ])
        .allow_credentials(true);
    
    let app = app.layer(cors);

    let listener = match TcpListener::bind("0.0.0.0:8080").await {
        Ok(listner) => listner,
        Err(err) => {
            eprintln!("Error creating TCP listener: {}", err);
            std::process::exit(1);
        }
    };

    match axum::serve(listener, app).await {
        Ok(server) => server,
        Err(err) => {
            eprintln!("Error serving application: {}", err);
            std::process::exit(1);
        }
    }
}
