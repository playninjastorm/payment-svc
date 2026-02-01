import { ProductModel } from "@/modules/products/model";
import ProductRepository from "@/modules/products/repository";

export abstract class ProductService {
  static async list() {
    const items = await ProductRepository.list();

    return items;
  }

  static async storeList() {
    const items = await ProductRepository.list();

    // TODO: Usar PromotionsRepository para buscar las promociones activas y aplicarlas a los productos
    const storeItems: ProductModel.Store[] = items.map((item) => ({
      sku: item.sku,
      display: {
        base: item.basePrice, // TODO: Aplicar promociones si existen
        final: item.basePrice, // TODO: Aplicar promociones si existen
        amountOff: 0, // TODO: Aplicar promociones si existen
        percentOff: 0, // TODO: Aplicar promociones si existen
        label: "No Promotion", // TODO: Aplicar promociones si existen
      },
    }));

    return storeItems;
  }

  static async createBulk(products: ProductModel.Create[]) {
    const items = await ProductRepository.createBulk(products);

    return items;
  }
}

export default ProductService;
