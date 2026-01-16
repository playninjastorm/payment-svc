use axum::{Json, Router, routing::get};
use serde::Serialize;

pub fn router() -> Router {
    Router::new().route("/", get(health_check))
}

#[derive(Serialize)]
struct HealthResponse {
    code: u16,
    message: &'static str,
}

async fn health_check() -> Json<HealthResponse> {
    Json(HealthResponse {
        code: 200,
        message: "[NK] Payment Service is running",
    })
}
