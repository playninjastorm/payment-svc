import { ProductModel } from "@/modules/products/model";
import ProductRepository from "@/modules/products/repository";
import { PromotionModel } from "@/modules/promotions/model";
import { PromotionRepository } from "@/modules/promotions/repository";

export abstract class ProductService {
  private static DEFAULT_OFFER_PERCENT_OFF = 33;
  private static DEFAULT_OFFER_LABEL = "33% off";

  static async list() {
    const items = await ProductRepository.list();

    return items;
  }

  static async storeList() {
    const items = await ProductRepository.list();

    const products = await PromotionRepository.listActiveProducts();

    const storeItems: ProductModel.Store[] = [];
    // TODO: Usar PromotionsRepository para buscar las promociones activas y aplicarlas a los productos

    for (const item of items) {
      const promotion = products.find((p) => p.sku === item.sku);
      // TODO: EN XSOLLA TIENEN UN PRECIO DIFERENTE, PERO LOS PRODUCTS QUE PUSO JUNIOR TIENEN UN SOLO PRICE
      // TODO: Junior dice para dejar un solo price

      storeItems.push({
        sku: item.sku,
        display: {
          percentOff:
            promotion?.discount.percentOff ??
            ProductService.DEFAULT_OFFER_PERCENT_OFF,
          label: promotion?.discount.percentOff
            ? `${promotion?.discount.percentOff}% off`
            : ProductService.DEFAULT_OFFER_LABEL,
          prices: {
            stripe:
              promotion?.platformSync.stripe?.finalPrice ??
              item.platforms.stripe?.basePrice ??
              null,
            paypal:
              promotion?.platformSync.paypal?.finalPrice ??
              item.platforms.paypal?.basePrice ??
              null,
            xsolla:
              promotion?.platformSync.xsolla?.finalPrice ??
              item.platforms.xsolla?.basePrice ??
              null,
          },
        },
      });
    }

    return storeItems;
  }

  static async createBulk(products: ProductModel.Create[]) {
    const items = await ProductRepository.createBulk(products);

    return items;
  }
}

export default ProductService;
