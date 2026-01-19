use schemars::JsonSchema;
use serde::Serialize;
use serde_json::Value;

/// Generic API response usable across the service.
/// - `TData` and `TErr` default to `serde_json::Value` so callers can omit concrete types.
#[derive(Serialize, JsonSchema)]
#[schemars(bound = "TData: JsonSchema, TErr: JsonSchema")]
pub struct ApiResponse<TData = Value, TErr = Value>
where
    TData: Serialize,
    TErr: Serialize,
{
    pub code: u16,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<TData>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub errors: Option<TErr>,
}

impl ApiResponse<Value, Value> {
    /// Convenience constructor when using dynamic `Value` types.
    pub fn new(code: u16, message: impl Into<String>) -> Self {
        ApiResponse {
            code,
            message: message.into(),
            data: None,
            errors: None,
        }
    }
}
