use actix_web::{HttpResponse, web};

use crate::services::products;

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.route("/products", web::get().to(get_list_products));
}

async fn get_list_products() -> HttpResponse {
    let msg = products::service::list_products();
    HttpResponse::Ok().body(msg)
}
