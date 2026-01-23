import { status } from "elysia";
import type { Document } from "mongodb";
import { connectToDatabase } from "@/core/db";

export abstract class ProductsSvc {
  private static collection = "paymentsProducts";
  /**
   * List products from the `paymentsProducts` collection.
   *
   * - `filter` Mongo query filter.
   * - `limit` capped to 1000 to avoid huge responses.
   * - `skip` for pagination offset.
   * - `sort` sort specification.
   */
  static async list({
    filter = {},
    limit = 100,
    skip = 0,
    sort = {},
  }: {
    filter?: Record<string, any>;
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
  } = {}): Promise<Document[]> {
    const clampedLimit = Math.min(Math.max(0, limit), 1000);

    try {
      const db = await connectToDatabase();

      const cursor = db
        .collection(this.collection)
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(clampedLimit);

      const items = await cursor.toArray();
      return items;
    } catch (err: any) {
      throw status(500, {
        error: "Failed to fetch products",
        message: err?.message ?? String(err),
      });
    }
  }
}

export default ProductsSvc;
