use futures_util::TryStreamExt;
use mongodb::{
    bson::{Document, to_bson},
    error::Error,
};

use crate::config::db::Db;
use crate::features::promotions::promotions_models::{Promotion, PromotionState};

const COLLECTION_NAME: &str = "paymentPromotions";

pub async fn get_all_promotions_db(
    db: &Db,
    state: Option<PromotionState>,
) -> Result<Vec<Promotion>, Error> {
    let collection = db.database().collection::<Promotion>(COLLECTION_NAME);

    let filter_doc: Document = match &state {
        Some(s) => {
            let b = to_bson(s).map_err(|e| Error::from(e))?;
            let mut d = Document::new();
            d.insert("state", b);
            d
        }
        None => Document::new(),
    };

    let cursor = collection.find(filter_doc).await?;

    let items: Vec<Promotion> = cursor.try_collect().await?;

    Ok(items)
}
