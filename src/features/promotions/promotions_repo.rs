use futures_util::TryStreamExt;
use mongodb::{bson::doc, error::Error};

use crate::config::db::Db;
use crate::features::promotions::promotions_models::Promotion;

const COLLECTION_NAME: &str = "shopPromotions";

pub async fn get_all_promotions_db(db: &Db) -> Result<Vec<Promotion>, Error> {
    let collection = db.database().collection::<Promotion>(COLLECTION_NAME);

    let cursor = collection.find(doc! {}).await?;

    let items: Vec<Promotion> = cursor.try_collect().await?;

    Ok(items)
}
