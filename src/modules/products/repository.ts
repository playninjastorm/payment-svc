import { ProductDTO } from "@/modules/products/dto";
import { Product, ProductModel } from "@/modules/products/model";

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
  } = {}): Promise<Product[]> {
    const clampedLimit = Math.min(Math.max(0, limit), 1000);

    const cursor = await ProductModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(clampedLimit);

    return cursor;
  }

  static async createBulk(products: ProductDTO.Create[]): Promise<Product[]> {
    return await ProductModel.insertMany(products, { ordered: false });
  }
}

export default ProductsRepository;
