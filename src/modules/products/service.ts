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

    const DISCOUNT_DEFAULT = {
      discountType: DiscountTypeEnum.PERCENT_OFF,
      discountValue: 33,
    };
    const DEFAULT_OFFER_LABEL = `${DISCOUNT_DEFAULT.discountValue}% off`;

    for (const item of items) {
      const promotion = activePromotions.find((p) => p.sku === item.sku);

      const discount = promotion ? promotion.discount : DISCOUNT_DEFAULT;

      let offerLabel = DEFAULT_OFFER_LABEL;

      if (promotion) {
        if (promotion.discount.discountType === DiscountTypeEnum.PERCENT_OFF) {
          offerLabel = `${promotion.discount.discountValue}% off`;
        } else if (
          promotion.discount.discountType === DiscountTypeEnum.AMOUNT_OFF
        ) {
          offerLabel = `$${promotion.discount.discountValue} off`;
        } else {
          offerLabel = "";
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
