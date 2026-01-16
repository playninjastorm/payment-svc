use log::info;
use std::error::Error;

use crate::config::{Config, db::Db};
use crate::features::product_svc;
use crate::features::products::product_models::{
    Product, ProductPlatformStripe, ProductPlatformXsolla, ProductPlatforms,
};

pub async fn create_products_seed() -> Result<(), Box<dyn Error + Send + Sync>> {
    let cfg = Config::load();

    let db = Db::connect(&cfg.mongodb_uri, &cfg.mongodb_db_name).await?;

    // Lista de productos derivada de la data proporcionada
    let products: Vec<Product> = vec![
        Product {
            id: None,
            sku: "token_30000".to_string(),
            name: "Token".to_string(),
            base_price: 49.99,
            active: true,
            platforms: Some(ProductPlatforms {
                stripe: Some(ProductPlatformStripe {
                    product_id: "".to_string(),
                    default_price_id: Some("price_1QMLyvFWwrZP60SHXerlkn51".to_string()),
                }),
                paypal: None,
                xsolla: Some(ProductPlatformXsolla {
                    sku: "token_30000".to_string(),
                }),
                google_play: None,
            }),
            created_at: None,
            updated_at: None,
        },
        Product {
            id: None,
            sku: "token_13500".to_string(),
            name: "Token".to_string(),
            base_price: 24.99,
            active: true,
            platforms: Some(ProductPlatforms {
                stripe: Some(ProductPlatformStripe {
                    product_id: "".to_string(),
                    default_price_id: Some("price_1QMLyyFWwrZP60SHbsqvLpKa".to_string()),
                }),
                paypal: None,
                xsolla: Some(ProductPlatformXsolla {
                    sku: "token_13500".to_string(),
                }),
                google_play: None,
            }),
            created_at: None,
            updated_at: None,
        },
        Product {
            id: None,
            sku: "token_5000".to_string(),
            name: "Token".to_string(),
            base_price: 9.99,
            active: true,
            platforms: Some(ProductPlatforms {
                stripe: Some(ProductPlatformStripe {
                    product_id: "".to_string(),
                    default_price_id: Some("price_1QMLz1FWwrZP60SHGT0utRlM".to_string()),
                }),
                paypal: None,
                xsolla: Some(ProductPlatformXsolla {
                    sku: "token_5000".to_string(),
                }),
                google_play: None,
            }),
            created_at: None,
            updated_at: None,
        },
        Product {
            id: None,
            sku: "token_2000".to_string(),
            name: "Token".to_string(),
            base_price: 4.99,
            active: true,
            platforms: Some(ProductPlatforms {
                stripe: Some(ProductPlatformStripe {
                    product_id: "".to_string(),
                    default_price_id: Some("price_1QMLz5FWwrZP60SH2DUYUill".to_string()),
                }),
                paypal: None,
                xsolla: Some(ProductPlatformXsolla {
                    sku: "token_2000".to_string(),
                }),
                google_play: None,
            }),
            created_at: None,
            updated_at: None,
        },
        Product {
            id: None,
            sku: "token_1000".to_string(),
            name: "Token".to_string(),
            base_price: 2.99,
            active: true,
            platforms: Some(ProductPlatforms {
                stripe: Some(ProductPlatformStripe {
                    product_id: "".to_string(),
                    default_price_id: Some("price_1QMLz7FWwrZP60SHIBX8DtZP".to_string()),
                }),
                paypal: None,
                xsolla: None,
                google_play: None,
            }),
            created_at: None,
            updated_at: None,
        },
        Product {
            id: None,
            sku: "token_500".to_string(),
            name: "Token".to_string(),
            base_price: 1.99,
            active: true,
            platforms: Some(ProductPlatforms {
                stripe: Some(ProductPlatformStripe {
                    product_id: "".to_string(),
                    default_price_id: Some("price_1QMLzAFWwrZP60SHcsfNxnYi".to_string()),
                }),
                paypal: None,
                xsolla: None,
                google_play: None,
            }),
            created_at: None,
            updated_at: None,
        },
        Product {
            id: None,
            sku: "token_200".to_string(),
            name: "Token".to_string(),
            base_price: 0.99,
            active: true,
            platforms: Some(ProductPlatforms {
                stripe: Some(ProductPlatformStripe {
                    product_id: "".to_string(),
                    default_price_id: None,
                }),
                paypal: None,
                xsolla: None,
                google_play: None,
            }),
            created_at: None,
            updated_at: None,
        },
        // Emblem
        Product {
            id: None,
            sku: "emblem_elite".to_string(),
            name: "Elite Emblem".to_string(),
            base_price: 9.99,
            active: true,
            platforms: Some(ProductPlatforms {
                stripe: Some(ProductPlatformStripe {
                    product_id: "".to_string(),
                    default_price_id: Some("price_1QMLxzFWwrZP60SHpXSznUl1".to_string()),
                }),
                paypal: None,
                xsolla: None,
                google_play: None,
            }),
            created_at: None,
            updated_at: None,
        },
        // Founder packages
        Product {
            id: None,
            sku: "founder_package_1".to_string(),
            name: "Founder Package Initiate".to_string(),
            base_price: 14.99,
            active: true,
            platforms: None,
            created_at: None,
            updated_at: None,
        },
        Product {
            id: None,
            sku: "founder_package_2".to_string(),
            name: "Founder Package Warrior".to_string(),
            base_price: 24.99,
            active: true,
            platforms: None,
            created_at: None,
            updated_at: None,
        },
        Product {
            id: None,
            sku: "founder_package_3".to_string(),
            name: "Founder Package Master".to_string(),
            base_price: 49.99,
            active: true,
            platforms: None,
            created_at: None,
            updated_at: None,
        },
    ];

    let inserted_products = product_svc::seed_products_svc(&db, products).await?;

    info!("Seeded products: {:?}", inserted_products);

    Ok(())
}
