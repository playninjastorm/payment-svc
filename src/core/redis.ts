import { Redis } from "ioredis";

import { ENV } from "@/config/env";
import { logger } from "@/core/logger";

const redis = new Redis({
  port: ENV.REDIS_PORT,
  host: ENV.REDIS_HOST,
  username: ENV.REDIS_USERNAME,
  password: ENV.REDIS_PASSWORD,
  db: ENV.REDIS_DB,
});

redis.on("connect", () => {
  logger.info("⚡ Connected to Redis");
});

redis.on("error", (err) => {
  logger.error({ err }, "Redis connection error");
});

export { redis };
