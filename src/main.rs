use actix_web::{App, HttpServer, Responder, get};
use log::info;

#[get("/")]
async fn hola_mundo() -> impl Responder {
    "hola mundo"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();
    env_logger::init();

    let addr = "0.0.0.0:8080";
    info!("Server running at http://{addr}");

    HttpServer::new(|| App::new().service(hola_mundo))
        .bind(addr)?
        .run()
        .await
}
