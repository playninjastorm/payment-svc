use std::error::Error;

use crate::config::db::Db;
use crate::features::product_models::Product;
use crate::features::product_repo;

pub async fn seed_products_svc(
    db: &Db,
    products: Vec<Product>,
) -> Result<Vec<Product>, Box<dyn Error + Send + Sync>> {
    let inserted_products = product_repo::insert_products_db(db, products).await?;
    Ok(inserted_products)
}

pub async fn list_products_svc(db: &Db) -> Result<Vec<Product>, Box<dyn Error + Send + Sync>> {
    let products = product_repo::get_all_products_db(db).await?;
    Ok(products)
}
