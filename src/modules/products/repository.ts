import { ProductModel } from "@/modules/products/model";
import { Product, ProductDB } from "@/modules/products/schema";

export abstract class ProductsRepository {
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
  } = {}) {
    const clampedLimit = Math.min(Math.max(0, limit), 1000);

    const cursor = await ProductDB.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(clampedLimit);

    return cursor;
  }

  static async createBulk(products: ProductModel.Create[]): Promise<Product[]> {
    return await ProductDB.insertMany(products, { ordered: false });
  }
}

export default ProductsRepository;
