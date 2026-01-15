pub mod products;

use axum::Router;

pub fn router() -> Router {
    Router::new().merge(products::router())
}
