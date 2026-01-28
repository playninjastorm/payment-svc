import { connect, ConnectOptions } from "mongoose";

import { ENV } from "@/config/env";
import { logger } from "@/core/logger";

const opts: ConnectOptions = {
  maxPoolSize: parseInt(
    (globalThis as any).Bun?.env?.MONGO_MAX_POOL_SIZE || "50",
    10,
  ),
  minPoolSize: parseInt(
    (globalThis as any).Bun?.env?.MONGO_MIN_POOL_SIZE || "2",
    10,
  ),
  connectTimeoutMS: 10_000,
  socketTimeoutMS: 300_000,
  serverSelectionTimeoutMS: 5_000,
  heartbeatFrequencyMS: 10_000,
  retryWrites: true,
  w: "majority",
  autoIndex: true,
} as any;

export const connectDb = async () => {
  try {
    // TODO: Create singleton connection
    const res = await connect(ENV.MONGODB_URI, opts);

    logger.info(
      { databaseName: res.connection.name },
      "💿 MongoDB connection successful",
    );
  } catch (error) {
    logger.error({ error }, "❌ Failed to connect MongoDB:");
  }
};
