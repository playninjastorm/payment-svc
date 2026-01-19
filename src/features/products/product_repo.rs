use futures_util::TryStreamExt;
use mongodb::{
    bson::{Bson, DateTime, doc},
    error::Error,
};

use crate::config::db::Db;
use crate::features::product_models::Product;

const COLLECTION_NAME: &str = "shopProducts";

/// Recupera todos los `Product` de la colección.
pub async fn get_all_products_db(db: &Db) -> Result<Vec<Product>, Error> {
    let collection = db.database().collection::<Product>(COLLECTION_NAME);

    let cursor = collection.find(doc! {}).await?;

    let products: Vec<Product> = cursor.try_collect().await?;

    Ok(products)
}

/// Inserta múltiples `Product` en la colección y devuelve los documentos
/// recién insertados con su campo `id` actualizado con los ObjectId generados.
pub async fn insert_products_db(
    db: &Db,
    mut products: Vec<Product>,
) -> Result<Vec<Product>, Error> {
    let collection = db.database().collection::<Product>(COLLECTION_NAME);

    // Establecemos timestamps antes de insertar y creamos la copia
    // que consumirá el driver. Mantener `products` para actualizar los `id`.
    let now = DateTime::now();
    for p in products.iter_mut() {
        p.created_at = Some(now.clone());
        p.updated_at = Some(now.clone());
    }

    let to_insert = products.clone();

    let result = collection.insert_many(to_insert).await?;

    // `inserted_ids` mapea el índice al Bson id generado.
    for (idx, id_bson) in result.inserted_ids {
        if let Bson::ObjectId(oid) = id_bson {
            if let Some(p) = products.get_mut(idx) {
                p.id = Some(oid);
            }
        }
    }

    Ok(products)
}
