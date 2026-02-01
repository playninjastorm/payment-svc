declare module "bun" {
  interface Env {
    PORT: string | number;
    API_KEY: string;
    MONGODB_URI: string;
    ENABLE_DOCS: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
    REDIS_DB: number;
  }
}
