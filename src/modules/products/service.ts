import { DiscountTypeEnum } from "@/commons/models/productPromotion.model";
import { ProductModel } from "@/modules/products/model";
import ProductRepository from "@/modules/products/repository";
import { PromotionRepository } from "@/modules/promotions/repository";

export abstract class ProductService {
  static async list() {
    const items = await ProductRepository.list();

    return items;
  }

  static async storeList() {
    const items = await ProductRepository.list();

    const activePromotions = await PromotionRepository.listActiveProducts();

    const storeItems: ProductModel.Store[] = [];

    for (const item of items) {
      const promotion = activePromotions.find((p) => p.sku === item.sku);

      const discount = promotion
        ? promotion.discount
        : {
            discountType: item.defaultDiscountType,
            discountValue: item.defaultDiscountValue,
          };

      let offerLabel = "";

      if (promotion) {
        if (promotion.discount.discountType === DiscountTypeEnum.PERCENT_OFF) {
          offerLabel = `${promotion.discount.discountValue}% off`;
        } else if (
          promotion.discount.discountType === DiscountTypeEnum.AMOUNT_OFF
        ) {
          offerLabel = `$${promotion.discount.discountValue} off`;
        }
      } else {
        if (item.defaultDiscountType === DiscountTypeEnum.PERCENT_OFF) {
          offerLabel = `${item.defaultDiscountValue}% off`;
        } else if (item.defaultDiscountType === DiscountTypeEnum.AMOUNT_OFF) {
          offerLabel = `$${item.defaultDiscountValue} off`;
        }
      }

      storeItems.push({
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        display: {
          ...discount,
          label: offerLabel,
          prices: {
            stripe:
              promotion?.platformSync.stripe?.finalPrice ??
              item.platforms.stripe?.defaultPrice ??
              null,
            paypal:
              promotion?.platformSync.paypal?.finalPrice ??
              item.platforms.paypal?.defaultPrice ??
              null,
            xsolla:
              promotion?.platformSync.xsolla?.finalPrice ??
              item.platforms.xsolla?.defaultPrice ??
              null,
          },
        },
      });
    }

    return {
      items: storeItems,
      metadata: {
        hasPromotions: activePromotions.length > 0,
      },
    };
  }

  static async createBulk(products: ProductModel.Create[]) {
    const items = await ProductRepository.createBulk(products);

    return items;
  }
}

export default ProductService;
