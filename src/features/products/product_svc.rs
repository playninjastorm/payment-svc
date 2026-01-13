use mongodb::error::Error;

use crate::config::db::Db;
use crate::features::product_models::Product;
use crate::features::product_repo;

pub async fn seed_products_svc() {
    // Here you can add logic to seed products into the database
    println!("Seeding products...");
    // Example: Insert predefined products into the database
}

pub async fn list_products_svc(db: &Db) -> Result<Vec<Product>, Error> {
    let products = product_repo::get_all_products_db(db).await?;
    Ok(products)
}
