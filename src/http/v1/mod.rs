pub mod products;
pub mod promotions;

use aide::axum::ApiRouter;

pub fn router() -> ApiRouter {
    ApiRouter::new()
        .merge(products::router())
        .merge(promotions::router())
}
