use aide::axum::ApiRouter;
use aide::axum::routing::get;
use axum::response::Html;

pub fn router() -> ApiRouter {
    ApiRouter::new().route("/", get(docs))
}

async fn docs() -> Html<&'static str> {
    const HTML: &str = r#"<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>NK Payment Service API Docs</title>
  </head>
  <body>
    <redoc spec-url="/openapi.json"></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>"#;

    Html(HTML)
}
