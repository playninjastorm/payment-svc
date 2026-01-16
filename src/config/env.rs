use std::env;

pub struct Config {
    pub port: u16,
    pub api_key: String,
    pub mongodb_uri: String,
    pub mongodb_db_name: String,
}

impl Config {
    pub fn load() -> Self {
        dotenvy::dotenv().ok();

        let port = env::var("PORT")
            .ok()
            .and_then(|s| s.parse::<u16>().ok())
            .unwrap_or(8080);

        let api_key = env::var("API_KEY").unwrap_or_else(|_| "your_api_key_here".to_string());

        let mongodb_uri =
            env::var("MONGODB_URI").unwrap_or_else(|_| "mongodb://localhost:27017".to_string());

        let mongodb_db_name =
            env::var("MONGODB_DB_NAME").unwrap_or_else(|_| "mydatabase".to_string());

        Self {
            port,
            api_key,
            mongodb_uri,
            mongodb_db_name,
        }
    }
}
