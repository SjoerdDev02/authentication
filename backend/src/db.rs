use sqlx::{MySql, Pool};
use std::env;
use std::error::Error;

pub struct Db {
    pub pool: Pool<MySql>,
}

impl Db {
    pub async fn new() -> Result<Self, Box<dyn Error>> {
        let database_url =
            env::var("DATABASE_URL").map_err(|_| "DATABASE_URL environment variable not set")?;

        let pool = Pool::<MySql>::connect(&database_url).await?;

        Ok(Db { pool })
    }
}
