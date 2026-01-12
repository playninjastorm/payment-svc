mod http;
mod services;

use actix_web::{App, HttpServer, middleware::Logger};
use log::info;

use nkstore::config::Config;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let cfg = Config::load();

    env_logger::init();

    let addr = format!("0.0.0.0:{}", cfg.port);
    info!("Server running at http://{addr}");

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .service(http::v1::scope())
    })
    .bind(addr)?
    .run()
    .await
}
