import { ProductModel } from "@/modules/products/model";
import { Product, ProductDB } from "@/modules/products/schema";

export abstract class ProductRepository {
  static async list() {
    const cursor = await ProductDB.find();

    return cursor;
  }

  static async createBulk(products: ProductModel.Create[]): Promise<Product[]> {
    return await ProductDB.insertMany(products, { ordered: false });
  }
}

export default ProductRepository;
