use mongodb::error::Error;

use crate::config::db::Db;
use crate::models::products_models::Product;
use crate::repositories::products_repo;

pub async fn seed_products() {
    // Here you can add logic to seed products into the database
    println!("Seeding products...");
    // Example: Insert predefined products into the database
}

pub async fn list_products(db: &Db) -> Result<Vec<Product>, Error> {
    let products = products_repo::get_all_products_db(db).await?;
    Ok(products)
}
