use aide::axum::ApiRouter;
use aide::axum::routing::get;
use axum::{Json, extract::Extension, middleware::from_fn};

use crate::commons::ApiResponse;
use crate::config::db::Db;
use crate::features::promotions::promotions_models::PromotionResponse;
use crate::features::promotions::promotions_svc;
use crate::middlewares::require_api_key;
use serde_json::{Value, json};

pub fn router() -> ApiRouter {
    ApiRouter::new()
        .api_route("/promotions", get(get_list_promotions_route))
        .route_layer(from_fn(require_api_key))
}

async fn get_list_promotions_route(
    Extension(db): Extension<Db>,
) -> Json<ApiResponse<Vec<PromotionResponse>, Value>> {
    // TODO: Filtrar por state
    match promotions_svc::list_promotions_svc(&db).await {
        Ok(items) => {
            let values: Vec<PromotionResponse> =
                items.into_iter().map(PromotionResponse::from).collect();

            let resp: ApiResponse<Vec<PromotionResponse>, Value> = ApiResponse {
                code: 200,
                message: "Promotions retrieved successfully".to_string(),
                data: Some(values),
                errors: None,
            };
            Json(resp)
        }
        Err(e) => {
            let resp: ApiResponse<Vec<PromotionResponse>, Value> = ApiResponse {
                code: 500,
                message: "Internal Server Error".to_string(),
                data: None,
                errors: Some(json!({"error": e.to_string()})),
            };
            Json(resp)
        }
    }
}
