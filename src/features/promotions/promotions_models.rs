use mongodb::bson::{DateTime, oid::ObjectId};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct Promotion {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[schemars(skip)]
    pub id: Option<ObjectId>,

    pub name: String,

    pub schedule: PromotionSchedule,

    pub state: PromotionState,

    pub scope: PromotionScope,

    pub lines: Vec<PromotionLine>,

    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    #[schemars(skip)]
    pub created_at: Option<DateTime>,

    #[serde(rename = "updatedAt", skip_serializing_if = "Option::is_none")]
    #[schemars(skip)]
    pub updated_at: Option<DateTime>,

    #[serde(rename = "activatedAt", skip_serializing_if = "Option::is_none")]
    #[schemars(skip)]
    pub activated_at: Option<DateTime>,

    #[serde(rename = "endedAt", skip_serializing_if = "Option::is_none")]
    #[schemars(skip)]
    pub ended_at: Option<DateTime>,
}

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct PromotionSchedule {
    #[serde(rename = "startsAt")]
    pub starts_at: String,

    #[serde(rename = "endsAt")]
    pub ends_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "lowercase")]
pub enum PromotionState {
    Scheduled,
    Activating,
    Active,
    Ending,
    Ended,
}

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct PromotionScope {
    pub mode: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct PromotionLine {
    pub sku: String,

    #[serde(rename = "finalPrice")]
    pub final_price: f64,

    #[serde(rename = "baseSnapshot")]
    pub base_snapshot: f64,

    pub discount: PromotionDiscount,

    #[serde(rename = "platformSync", skip_serializing_if = "Option::is_none")]
    pub platform_sync: Option<PlatformSync>,
}

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct PromotionDiscount {
    #[serde(rename = "amountOff")]
    pub amount_off: f64,

    #[serde(rename = "percentOff")]
    pub percent_off: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct PlatformSync {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stripe: Option<PlatformStripeSync>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub paypal: Option<serde_json::Value>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub xsolla: Option<PlatformXsollaSync>,

    #[serde(rename = "googlePlay", skip_serializing_if = "Option::is_none")]
    pub google_play: Option<PlatformGooglePlaySync>,
}

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct PlatformStripeSync {
    #[serde(rename = "priceId", skip_serializing_if = "Option::is_none")]
    pub price_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct PlatformXsollaSync {
    #[serde(rename = "promotionId", skip_serializing_if = "Option::is_none")]
    pub promotion_id: Option<String>,

    #[serde(rename = "amountOff", skip_serializing_if = "Option::is_none")]
    pub amount_off: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct PlatformGooglePlaySync {
    pub price: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct PromotionResponse {
    #[serde(rename = "id", skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    pub name: String,

    pub schedule: PromotionSchedule,

    pub state: PromotionState,

    pub scope: PromotionScope,

    pub lines: Vec<PromotionLine>,

    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    #[serde(rename = "updatedAt", skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    #[serde(rename = "activatedAt", skip_serializing_if = "Option::is_none")]
    pub activated_at: Option<String>,

    #[serde(rename = "endedAt", skip_serializing_if = "Option::is_none")]
    pub ended_at: Option<String>,
}

impl From<Promotion> for PromotionResponse {
    fn from(p: Promotion) -> Self {
        PromotionResponse {
            id: p.id.map(|oid| oid.to_string()),
            name: p.name,
            schedule: p.schedule,
            state: p.state,
            scope: p.scope,
            lines: p.lines,
            created_at: p.created_at.map(|dt| dt.to_string()),
            updated_at: p.updated_at.map(|dt| dt.to_string()),
            activated_at: p.activated_at.map(|dt| dt.to_string()),
            ended_at: p.ended_at.map(|dt| dt.to_string()),
        }
    }
}
