pub mod products;

use aide::axum::ApiRouter;

pub fn router() -> ApiRouter {
    ApiRouter::new().merge(products::router())
}
