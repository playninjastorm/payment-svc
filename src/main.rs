use actix_web::web;
use actix_web::{App, HttpServer, middleware::Logger};
use log::info;

use nkstore::config::{Config, db::Db};
use nkstore::http::v1;

#[actix_web::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cfg = Config::load();

    env_logger::init();

    let db = Db::connect(&cfg.mongodb_uri, &cfg.mongodb_db_name).await?;
    info!("Connected to MongoDB");

    let addr = format!("0.0.0.0:{}", cfg.port);
    info!("Server running at http://{addr}");

    let collections = db.database().list_collection_names().await?;
    info!(
        "Database {} - Existing collections: {}",
        cfg.mongodb_db_name,
        collections.len()
    );

    let db_data = web::Data::new(db);

    HttpServer::new(move || {
        App::new()
            .app_data(db_data.clone())
            .wrap(Logger::default())
            .service(v1::scope())
    })
    .bind(addr)?
    .run()
    .await?;

    Ok(())
}
