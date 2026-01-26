import { status } from "elysia";

import ProductsRepository from "@/modules/products/repository";
import { Product } from "@/modules/products/model";

export abstract class ProductsSvc {
  static async list(
    params: {
      filter?: Record<string, any>;
      limit?: number;
      skip?: number;
      sort?: Record<string, 1 | -1>;
    } = {},
  ) {
    try {
      const items = await ProductsRepository.list(params);

      // TODO: Convertir Document en Model de Elisia

      return items;
    } catch (err: any) {
      throw status(500, {
        error: "Failed to fetch products",
        message: err?.message ?? String(err),
      });
    }
  }

  static async createBulk(products: Product[]) {
    try {
      const items = await ProductsRepository.createBulk(products);

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
