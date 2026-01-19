use std::error::Error;

use crate::config::db::Db;
use crate::features::promotions::promotions_models::Promotion;
use crate::features::promotions::promotions_repo;

pub async fn list_promotions_svc(db: &Db) -> Result<Vec<Promotion>, Box<dyn Error + Send + Sync>> {
    let items = promotions_repo::get_all_promotions_db(db).await?;
    Ok(items)
}
