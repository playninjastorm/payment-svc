use aide::axum::ApiRouter;
use aide::axum::routing::get;
use axum::{Json, extract::Extension, middleware::from_fn};

use crate::commons::ApiResponse;
use crate::config::db::Db;
use crate::features::product_svc;
use crate::features::products::product_models::Product;
use crate::middlewares::require_api_key;
use serde_json::{Value, json};

pub fn router() -> ApiRouter {
    ApiRouter::new()
        .api_route("/products", get(get_list_products_route))
        .route_layer(from_fn(require_api_key))
}

async fn get_list_products_route(
    Extension(db): Extension<Db>,
) -> Json<ApiResponse<Vec<Product>, Value>> {
    match product_svc::list_products_svc(&db).await {
        Ok(items) => {
            let resp: ApiResponse<Vec<Product>, Value> = ApiResponse {
                code: 200,
                message: "OK".to_string(),
                data: Some(items),
                errors: None,
            };
            Json(resp)
        }
        Err(e) => {
            let resp: ApiResponse<Vec<Product>, Value> = ApiResponse {
                code: 500,
                message: "Internal Server Error".to_string(),
                data: None,
                errors: Some(json!({"error": e.to_string()})),
            };
            Json(resp)
        }
    }
}
