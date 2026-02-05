export const ENV = {
  IS_DEV: Bun.env.NODE_ENV != "production",
  PORT: Bun.env.PORT || "3100",
  API_KEY: Bun.env.API_KEY || "secret-api-key",
  MONGODB_URI: Bun.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase",
  REDIS_HOST: Bun.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: Number(Bun.env.REDIS_PORT) || 6379,
  REDIS_USERNAME: Bun.env.REDIS_USERNAME || "default",
  REDIS_PASSWORD: Bun.env.REDIS_PASSWORD || "my-top-secret",
  REDIS_DB: Number(Bun.env.REDIS_DB) || 0,
  ENABLE_DOCS:
    Bun.env.ENABLE_DOCS.toLowerCase() === "true" ||
    Bun.env.ENABLE_DOCS === "1" ||
    false,
};
