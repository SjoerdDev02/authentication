use backend::{models::auth_models::AuthState, utils::env::get_environment_variable};
use dotenv::dotenv;
use http::{header, HeaderValue, Method};
use redis::Client;
use sqlx::mysql::MySqlPoolOptions;
use std::sync::Arc;
use tokio::{net::TcpListener, sync::Mutex};
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let database_url = match get_environment_variable("DATABASE_URL") {
        Ok(database_url) => database_url,
        Err(err) => {
            eprintln!("Error getting DATABASE_URL: {}", err);
            std::process::exit(1);
        }
    };

    let pool = MySqlPoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Unable to connect to database");

    let redis_url = match get_environment_variable("REDIS_URL") {
        Ok(redis_url) => redis_url,
        Err(err) => {
            eprintln!("Error getting REDIS_URL: {}", err);
            std::process::exit(1);
        }
    };

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

    let allow_origin = match get_environment_variable("CLIENT_BASE_URL") {
        Ok(allow_origin_url) => allow_origin_url,
        Err(err) => {
            eprintln!("Error getting CLIENT_BASE_URL: {}", err);
            std::process::exit(1);
        }
    };

    let allow_origin = match allow_origin.parse::<HeaderValue>() {
        Ok(header) => header,
        Err(err) => {
            eprintln!(
                "Error parsing CLIENT_BASE_URL to allow origin header: {}",
                err
            );
            std::process::exit(1);
        }
    };

    let cors = CorsLayer::new()
        .allow_origin(allow_origin)
        .allow_methods(vec![
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::PATCH,
            Method::DELETE,
        ])
        .allow_headers(vec![
            header::CONTENT_TYPE,
            header::AUTHORIZATION,
            header::COOKIE,
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
