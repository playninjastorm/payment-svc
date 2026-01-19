use crate::commons::ApiResponse;
use aide::axum::routing::get;
use aide::axum::ApiRouter;
use axum::Json;
use serde_json::json;

pub fn router() -> ApiRouter {
    ApiRouter::new().api_route("/", get(health_check))
}

async fn health_check() -> Json<ApiResponse<serde_json::Value, serde_json::Value>> {
    let mut resp = ApiResponse::new(200, "[NK] Payment Service is running");
    resp.data = Some(json!(null));
    Json(resp)
}
