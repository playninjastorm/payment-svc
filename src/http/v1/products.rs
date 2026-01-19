use aide::axum::ApiRouter;
use aide::axum::routing::get;
use axum::{Json, extract::Extension, middleware::from_fn};

use crate::commons::ApiResponse;
use crate::config::db::Db;
use crate::features::product_svc;
use crate::features::products::product_models::ProductResponse;
use crate::middlewares::require_api_key;
use serde_json::{Value, json};

pub fn router() -> ApiRouter {
    ApiRouter::new()
        .api_route("/products", get(get_list_products_route))
        .route_layer(from_fn(require_api_key))
}

async fn get_list_products_route(
    Extension(db): Extension<Db>,
) -> Json<ApiResponse<Vec<ProductResponse>, Value>> {
    match product_svc::list_products_svc(&db).await {
        Ok(items) => {
            // Map domain `Product` into `ProductResponse` DTO to produce a friendly JSON shape.
            let values: Vec<ProductResponse> =
                items.into_iter().map(ProductResponse::from).collect();

            let resp: ApiResponse<Vec<ProductResponse>, Value> = ApiResponse {
                code: 200,
                message: "Products retrieved successfully".to_string(),
                data: Some(values),
                errors: None,
            };
            Json(resp)
        }
        Err(e) => {
            let resp: ApiResponse<Vec<ProductResponse>, Value> = ApiResponse {
                code: 500,
                message: "Internal Server Error".to_string(),
                data: None,
                errors: Some(json!({"error": e.to_string()})),
            };
            Json(resp)
        }
    }
}
