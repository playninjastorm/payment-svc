use mongodb::{
    Client, Database,
    bson::doc,
    options::{ClientOptions, ServerApi, ServerApiVersion},
};
use std::time::Duration;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum DbError {
    #[error("Missing environment variable: {0}")]
    MissiongEnv(&'static str),

    #[error("MongoDB error: {0}")]
    Mongo(#[from] mongodb::error::Error),
}

#[derive(Clone)]
pub struct Db {
    client: Client,
    db: Database,
}

impl Db {
    pub async fn connect(uri: &str, db_name: &str) -> Result<Self, DbError> {
        let mut options = ClientOptions::parse(uri).await?;

        options.app_name = Some(options.app_name.unwrap_or_else(|| "nkpay".to_string()));
        options.connect_timeout = Some(Duration::from_secs(5));
        options.server_selection_timeout = Some(Duration::from_secs(5));
        options.server_api = Some(ServerApi::builder().version(ServerApiVersion::V1).build());

        let client = Client::with_options(options)?;
        let db = client.database(db_name);

        db.run_command(doc! {"ping": 1}).await?;

        Ok(Self { client, db })
    }

    pub fn database(&self) -> &Database {
        &self.db
    }

    pub fn client(&self) -> &Client {
        &self.client
    }
}
