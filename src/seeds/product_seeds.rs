use log::info;
use std::error::Error;

use crate::config::{Config, db::Db};
use crate::features::product_models::Product;
use crate::features::product_svc;

pub async fn create_products_seed() -> Result<(), Box<dyn Error + Send + Sync>> {
    let cfg = Config::load();

    let db = Db::connect(&cfg.mongodb_uri, &cfg.mongodb_db_name).await?;

    // Lista de ejemplo con un `Product` para seed
    let products: Vec<Product> = vec![Product {
        id: None,
        sku: "TOKENS_30000".to_string(),
        name: "30,000 Tokens".to_string(),
        base_price: 84.99,
        active: true,
        platforms: None,
        created_at: None,
        updated_at: None,
    }];

    let inserted_products = product_svc::seed_products_svc(&db, products).await?;

    info!("Seeded products: {:?}", inserted_products);

    Ok(())
}
