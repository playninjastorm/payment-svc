use axum::{Router, extract::Extension};
use log::info;

use nkpay::config::{Config, db::Db};
use nkpay::http::v1;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cfg = Config::load();

    env_logger::init();

    let db = Db::connect(&cfg.mongodb_uri, &cfg.mongodb_db_name).await?;

    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], cfg.port));
    info!("Server running at http://{}", addr);

    let collections = db.database().list_collection_names().await?;
    info!(
        "Database {} - Existing collections: {}",
        cfg.mongodb_db_name,
        collections.len()
    );

    let app = Router::new().nest("/v1", v1::router()).layer(Extension(db));

    // 👇 EXACTAMENTE como la doc oficial
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
