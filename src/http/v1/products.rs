use axum::{
    Json, Router, extract::Extension, http::StatusCode, response::IntoResponse, routing::get,
};

use crate::config::db::Db;
use crate::features::product_svc;

pub fn router() -> Router {
    Router::new().route("/products", get(get_list_products_route))
}

async fn get_list_products_route(Extension(db): Extension<Db>) -> impl IntoResponse {
    match product_svc::list_products_svc(&db).await {
        Ok(items) => (StatusCode::OK, Json(items)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}
