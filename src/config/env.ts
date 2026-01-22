export const ENV = {
  PORT: Bun.env.PORT || "3000",
  MONGO_URI: Bun.env.MONGO_URI || "mongodb://localhost:27017/mydatabase",
  API_KEY: Bun.env.API_KEY || "secret-api-key",
  ENABLE_DOCS:
    Bun.env.ENABLE_DOCS.toLowerCase() === "true" ||
    Bun.env.ENABLE_DOCS === "1" ||
    false,
};
