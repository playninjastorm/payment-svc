use crate::commons::ApiResponse;
use axum::{Json, Router, routing::get};

pub fn router() -> Router {
    Router::new().route("/", get(health_check))
}

async fn health_check() -> Json<ApiResponse> {
    Json(ApiResponse::new(200, "[NK] Payment Service is running"))
}
