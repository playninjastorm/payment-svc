use actix_web::{App, HttpServer, Responder, get};
use log::info;

use nkstore::config::Config;

#[get("/")]
async fn hola_mundo() -> impl Responder {
    "hola mundo"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let cfg = Config::load();

    env_logger::init();

    let addr = format!("0.0.0.0:{}", cfg.port);
    info!("Server running at http://{addr}");

    HttpServer::new(|| App::new().service(hola_mundo))
        .bind(addr)?
        .run()
        .await
}
