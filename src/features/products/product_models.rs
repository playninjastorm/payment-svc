use mongodb::bson::{DateTime, oid::ObjectId};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Product {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,

    pub sku: String,

    pub name: String,

    #[serde(rename = "basePrice")]
    pub base_price: f64,

    pub active: bool,

    #[serde(rename = "platforms", skip_serializing_if = "Option::is_none")]
    pub platforms: Option<ProductPlatforms>,

    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    pub created_at: Option<DateTime>,

    #[serde(rename = "updatedAt", skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<DateTime>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProductPlatforms {
    #[serde(rename = "stripe", skip_serializing_if = "Option::is_none")]
    pub stripe: Option<ProductPlatformStripe>,

    #[serde(rename = "paypal", skip_serializing_if = "Option::is_none")]
    pub paypal: Option<ProductPlatformPaypal>,

    #[serde(rename = "xsolla", skip_serializing_if = "Option::is_none")]
    pub xsolla: Option<ProductPlatformXsolla>,

    #[serde(rename = "googlePlay", skip_serializing_if = "Option::is_none")]
    pub google_play: Option<ProductPlatformGooglePlay>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProductPlatformStripe {
    #[serde(rename = "productId")]
    pub product_id: String,

    #[serde(rename = "defaultPriceId", skip_serializing_if = "Option::is_none")]
    pub default_price_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProductPlatformPaypal {
    #[serde(rename = "productId")]
    pub product_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProductPlatformXsolla {
    pub sku: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProductPlatformGooglePlay {
    #[serde(rename = "productId")]
    pub product_id: String,
}
