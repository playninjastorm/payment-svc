use std::env;

pub struct Config {
    pub port: u16,
}

impl Config {
    pub fn load() -> Self {
        dotenvy::dotenv().ok();

        let port = env::var("PORT")
            .ok()
            .and_then(|s| s.parse::<u16>().ok())
            .unwrap_or(8080);

        Self { port }
    }
}
