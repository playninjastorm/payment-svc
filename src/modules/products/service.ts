import { DiscountTypeEnum } from "@/commons/models/productPromotion.model";
import { ProductModel } from "@/modules/products/model";
import ProductRepository from "@/modules/products/repository";
import { PromotionModel } from "@/modules/promotions/model";
import { PromotionRepository } from "@/modules/promotions/repository";

type PlatformKey = "stripe" | "paypal" | "xsolla";
const PLATFORMS: PlatformKey[] = ["stripe", "paypal", "xsolla"];

export abstract class ProductService {
  static async list() {
    return ProductRepository.list();
  }

  static async storeList() {
    const [items, activePromotions] = await Promise.all([
      ProductRepository.list(),
      PromotionRepository.listActiveProducts(),
    ]);

    const storeItems: ProductModel.Store[] = items.map((item) => {
      const promotion = activePromotions.find((p) => p.sku === item.sku);
      const defaultLabel = this.formatDiscountLabel(
        item.defaultDiscountType,
        item.defaultDiscountValue,
      );

      const platforms = Object.fromEntries(
        PLATFORMS.map((key) => [
          key,
          this.buildStorePlatform(item, promotion, key, defaultLabel),
        ]),
      ) as ProductModel.Store["platforms"];

      return {
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        platforms,
      };
    });

    return {
      items: storeItems,
      metadata: { hasPromotions: activePromotions.length > 0 },
    };
  }

  static async createBulk(products: ProductModel.Create[]) {
    return ProductRepository.createBulk(products);
  }

  // --- Private helpers ---

  private static formatDiscountLabel(
    type: DiscountTypeEnum,
    value: number,
  ): string {
    if (type === DiscountTypeEnum.PERCENT_OFF) return `${value}% off`;
    if (type === DiscountTypeEnum.AMOUNT_OFF) return `$${value} off`;
    return "";
  }

  private static buildStorePlatform(
    item: ProductModel.Details,
    promotion: PromotionModel.PromotionLine | undefined,
    platform: PlatformKey,
    defaultLabel: string,
  ) {
    const platformConfig = item.platforms[platform];
    if (!platformConfig) return null;

    const hasPromoSync = !!promotion?.platformSync[platform];

    const discountType = hasPromoSync
      ? promotion!.discount.discountType
      : item.defaultDiscountType;

    const discountValue = hasPromoSync
      ? promotion!.discount.discountValue
      : item.defaultDiscountValue;

    const label = hasPromoSync
      ? this.formatDiscountLabel(discountType, discountValue)
      : defaultLabel;

    const price = hasPromoSync
      ? (promotion!.platformSync[platform] as { finalPrice: number }).finalPrice
      : platformConfig.defaultPrice;

    return { discountType, discountValue, label, price };
  }
}

export default ProductService;
