import { status } from "elysia";

import { ProductDTO } from "@/modules/products/dto";
import ProductsRepository from "@/modules/products/repository";

export abstract class ProductsSvc {
  static async list() {
    try {
      const raw = await ProductsRepository.list();

      const items: any = raw.map((item) => ({ ...item }));

      return items;
    } catch (err: any) {
      throw status(500, {
        error: "Failed to fetch products",
        message: err?.message ?? String(err),
      });
    }
  }

  static async createBulk(products: ProductDTO.Create[]) {
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
