use axum::{
    body::Body,
    http::{Request, StatusCode},
    middleware::Next,
    response::IntoResponse,
};

use crate::config::Config;

pub async fn require_api_key(req: Request<Body>, next: Next) -> impl IntoResponse {
    let header_val = req
        .headers()
        .get("X-Api-Key")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    let cfg: Config = Config::load();

    if header_val == cfg.api_key {
        next.run(req).await
    } else {
        (StatusCode::UNAUTHORIZED, "Unauthorized").into_response()
    }
}
