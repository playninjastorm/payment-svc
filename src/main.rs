use aide::axum::ApiRouter;
use aide::openapi::{Info, OpenApi};
use axum::{extract::Extension, routing::get};
use log::info;

use nkpay::config::{Config, db::Db};
use nkpay::http::health;
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

    let mut api = OpenApi {
        info: Info {
            title: "NK Payment Service".to_string(),
            description: Some("This service provides a single system of record for product promotions. Administrators create promotions (globally or per-SKU) with exact final prices; the service automatically activates promotions on schedule, synchronizes prices with external platforms, and restores base prices when promotions end".to_string()),
            version: "0.1.0".to_string(),
            ..Info::default()
        },
        ..OpenApi::default()
    };

    let app = ApiRouter::new()
        .nest("/health", health::router())
        .nest("/v1", v1::router())
        .route("/openapi.json", get(serve_api))
        .layer(Extension(db));

    // listener + serve using aide finish_api
    let listener = tokio::net::TcpListener::bind(addr).await?;

    axum::serve(
        listener,
        app.finish_api(&mut api)
            .layer(Extension(api))
            .into_make_service(),
    )
    .await?;

    Ok(())
}

async fn serve_api(Extension(api): Extension<OpenApi>) -> axum::Json<OpenApi> {
    axum::Json(api)
}
