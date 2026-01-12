pub mod products;

use actix_web::web;

pub fn scope() -> actix_web::Scope {
    web::scope("/v1").configure(products::routes)
}
