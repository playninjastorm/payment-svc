import { status } from "elysia";

import { ProductModel } from "@/modules/products/model";
import ProductsRepository from "@/modules/products/repository";

export abstract class ProductsSvc {
  static async list() {
    try {
      const items = await ProductsRepository.list();

      return items;
    } catch (err: any) {
      throw status(500, {
        error: "Failed to fetch products",
        message: err?.message ?? String(err),
      });
    }
  }

  static async createBulk(products: ProductModel.Create[]) {
    try {
      const raw = await ProductsRepository.createBulk(products);

      const items: any = raw.map((item) => ({ ...item }));

      return items;
    } catch (err: any) {
      throw status(500, {
        error: "Failed to create products",
        message: err?.message ?? String(err),
      });
    }
  }
}

export default ProductsSvc;
