use futures_util::TryStreamExt;
use mongodb::{bson::doc, error::Error};

use crate::config::db::Db;
use crate::models::products_models::Product;

const COLLECTION_NAME: &str = "storeProducts";

pub async fn get_all_products_db(db: &Db) -> Result<Vec<Product>, Error> {
    let collection = db.database().collection::<Product>(COLLECTION_NAME);

    let cursor = collection.find(doc! {}).await?;

    let products: Vec<Product> = cursor.try_collect().await?;

    Ok(products)
}
