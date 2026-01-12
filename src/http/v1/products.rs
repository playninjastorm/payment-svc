use actix_web::{HttpResponse, web};

use crate::config::db::Db;
use crate::features::products_svc;

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.route("/products", web::get().to(get_list_products_route));
}

async fn get_list_products_route(db: web::Data<Db>) -> HttpResponse {
    match products_svc::list_products_svc(db.get_ref()).await {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}
