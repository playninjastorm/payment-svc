declare module "bun" {
  interface Env {
    PORT: string | number;
    API_KEY: string;
    MONGODB_URI: string;
    ENABLE_DOCS: string;
  }
}
