use std::sync::Arc;
use tokio::sync::Mutex;
use redis::aio::Connection;

use sqlx::MySqlPool;

#[derive(Clone)]
pub struct AppState {
    pub db_pool: MySqlPool,
    pub redis: Arc<Mutex<Connection>>,
}