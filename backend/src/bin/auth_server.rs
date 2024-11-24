use tower_http::cors::{CorsLayer, Any};
use std::{env, sync::Arc};
use tokio::{net::TcpListener, sync::Mutex};
use redis::Client;
use dotenv::dotenv;
use sqlx::mysql::MySqlPoolOptions;
use backend::models::auth_models::AuthState;
use http::{HeaderValue, Method};

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

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_methods(vec![Method::GET, Method::POST, Method::PUT, Method::PATCH, Method::DELETE])
        .allow_headers(Any);

    let app = app.layer(cors);

    let listener = TcpListener::bind("0.0.0.0:8080")
        .await
        .expect("Unable to bind to the server");

    axum::serve(listener, app)
        .await
        .expect("Error serving application");
}