import { MongoClient, Db } from "mongodb";

import { ENV } from "@/config/env";

let client: MongoClient | null = null;
let database: Db | null = null;

const DEFAULTS = {
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
  // Keep a reasonable heartbeat to detect topology changes quickly in production
  heartbeatFrequencyMS: 10_000,
  appName: "nk-payment",
  retryWrites: true,
  w: "majority",
};

/**
 * Connects to MongoDB and returns the `Db` instance. Uses a singleton MongoClient
 * so multiple imports across the app reuse the same pool. Options are tuned
 * for production: larger pool, sensible timeouts, and retryWrites enabled.
 *
 * Designed to work on Bun and Node (Elysia) environments.
 */
export async function connectToDatabase(uri = ENV.MONGO_URI): Promise<Db> {
  if (database) return database;

  const opts = {
    maxPoolSize: DEFAULTS.maxPoolSize,
    minPoolSize: DEFAULTS.minPoolSize,
    connectTimeoutMS: DEFAULTS.connectTimeoutMS,
    socketTimeoutMS: DEFAULTS.socketTimeoutMS,
    serverSelectionTimeoutMS: DEFAULTS.serverSelectionTimeoutMS,
    heartbeatFrequencyMS: DEFAULTS.heartbeatFrequencyMS,
    appName: DEFAULTS.appName,
    retryWrites: DEFAULTS.retryWrites,
    w: DEFAULTS.w,
  } as any;

  client = new MongoClient(uri, opts);

  await client.connect();

  database = client.db();

  // Graceful shutdown handlers (Node/Bun compatible)
  try {
    if (
      typeof process !== "undefined" &&
      process &&
      typeof process.on === "function"
    ) {
      const shutdown = async () => {
        try {
          await closeDatabase();
        } catch (e) {
          // ignore
        }
        // don't call process.exit here in hosted environments
      };
      process.on("SIGINT", shutdown);
      process.on("SIGTERM", shutdown);
    }
  } catch (e) {
    // ignore environment that doesn't support process hooks
  }

  return database;
}

export function getDb(): Db {
  if (!database)
    throw new Error("MongoDB not connected. Call connectToDatabase() first.");
  return database;
}

export function getClient(): MongoClient {
  if (!client)
    throw new Error(
      "MongoClient not initialized. Call connectToDatabase() first.",
    );
  return client;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    try {
      await client.close();
    } finally {
      client = null;
      database = null;
    }
  }
}

/**
 * Lightweight helper to attach the DB to an Elysia app instance.
 * Elysia's API surface may vary; this simply sets `app.state.db` so handlers
 * can access `app.state.db`. Call this during app startup.
 */
export async function attachDbToElysia(app: any): Promise<any> {
  const db = await connectToDatabase();
  app.state = app.state || {};
  app.state.db = db;
  return app;
}

export default {
  connectToDatabase,
  getDb,
  getClient,
  closeDatabase,
  attachDbToElysia,
};
