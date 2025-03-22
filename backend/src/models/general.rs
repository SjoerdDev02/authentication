use redis::aio::Connection;
use std::sync::Arc;
use tokio::sync::Mutex;

use sqlx::MySqlPool;

#[derive(Clone)]
pub struct AppState {
    pub db_pool: MySqlPool,
    pub redis: Arc<Mutex<Connection>>,
}
