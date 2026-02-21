import { ListOptions } from "@/commons/interfaces/interface.types";
import { DiscountTypeEnum } from "@/commons/models/productPromotion.model";
import { ServiceError } from "@/commons/utils/errors.utils";
import { ProductRepository } from "@/modules/products/repository";
import { PromotionModel } from "@/modules/promotions/model";
import { PromotionRepository } from "@/modules/promotions/repository";

export abstract class PromotionService {
  static async list({
    filter = {},
    limit = 100,
    skip = 0,
    sort = {},
  }: ListOptions = {}) {
    const { items, pagination } = await PromotionRepository.list({
      filter,
      limit,
      skip,
      sort,
    });

    return { items, pagination };
  }

  static async findByScheduleTime(date: Date) {
    const data = await PromotionRepository.findByScheduleTime(date);
    return data;
  }

  static async activatePromotion(id: string) {
    const data = await PromotionRepository.updateState(
      id,
      PromotionModel.StateEnum.ACTIVE,
    );

    return data;
  }

  static async create(payload: PromotionModel.CreateRequest) {
    const promotionConflict = await PromotionRepository.findConflict(
      new Date(payload.schedule.startsAt),
      new Date(payload.schedule.endsAt),
    );

    if (promotionConflict) {
      throw new ServiceError(
        `This promotion conflicts with promotion ${promotionConflict.name} (ID: ${promotionConflict.id}). Therefore, it cannot be created; please modify your schedule.`,
        409,
      );
    }

    const products = await ProductRepository.list();

    const lines: PromotionModel.PromotionLine[] = [];

    for (const line of payload.lines) {
      const product = products.find((p) => p.sku === line.sku);

      if (!product) {
        throw new ServiceError(`Product with SKU ${line.sku} not found`);
      }

      // Exist platform sync configuration for the line, but the product does not have the corresponding platform configured.
      if (line.platformSync.stripe && !product.platforms.stripe) {
        throw new ServiceError(
          `Product with SKU ${line.sku} does not have a Stripe platform configured`,
        );
      }
      if (line.platformSync.xsolla && !product.platforms.xsolla) {
        throw new ServiceError(
          `Product with SKU ${line.sku} does not have a Xsolla platform configured`,
        );
      }

      // Calculate the final price for each platform if the line has a platform sync configuration and the product has the corresponding platform configured.
      let platformStripe: PromotionModel.PromotionLineStripe | null = null;
      if (line.platformSync.stripe && product.platforms.stripe) {
        platformStripe = {
          priceId: line.platformSync.stripe.priceId,
          baseSnapshot: product.platforms.stripe?.basePrice,
          finalPrice: this.calculateFinalPrice(
            product.platforms.stripe.basePrice,
            line.discount.discountType,
            line.discount.discountValue,
          ),
        };
      }

      let platformPaypal: PromotionModel.PromotionLinePaypal | null = null;
      if (product.platforms.paypal) {
        platformPaypal = {
          baseSnapshot: product.platforms.paypal?.basePrice,
          finalPrice: this.calculateFinalPrice(
            product.platforms.paypal.basePrice,
            line.discount.discountType,
            line.discount.discountValue,
          ),
        };
      }

      let platformXsolla: PromotionModel.PromotionLineXsolla | null = null;
      if (line.platformSync.xsolla && product.platforms.xsolla) {
        platformXsolla = {
          promotionId: line.platformSync.xsolla.promotionId,
          baseSnapshot: product.platforms.xsolla?.basePrice,
          finalPrice: this.calculateFinalPrice(
            product.platforms.xsolla.basePrice,
            line.discount.discountType,
            line.discount.discountValue,
          ),
        };
      }

      lines.push({
        sku: line.sku,
        discount: line.discount,
        platformSync: {
          stripe: platformStripe,
          paypal: platformPaypal,
          xsolla: platformXsolla,
        },
      });
    }

    const promotion: PromotionModel.Create = {
      ...payload,
      state: PromotionModel.StateEnum.SCHEDULED,
      lines,
    };

    const data = await PromotionRepository.create(promotion);

    return data;
  }

  private static calculateFinalPrice(
    basePrice: number, // 9.99
    discountType: DiscountTypeEnum, // PERCENT_OFF
    discountValue: number, // 40
  ) {
    const basePriceInt = Math.round(basePrice * 100); // 999
    let discountAmountInt = 0;

    if (discountType === DiscountTypeEnum.PERCENT_OFF) {
      discountAmountInt = Math.round((basePriceInt * discountValue) / 100);
    }

    if (discountType === DiscountTypeEnum.AMOUNT_OFF) {
      discountAmountInt = Math.round(discountValue * 100);
    }

    let finalPriceInt = Math.max(basePriceInt - discountAmountInt, 0);

    // Force termination .99
    if (finalPriceInt > 0) {
      finalPriceInt = Math.floor(finalPriceInt / 100) * 100 + 99;
    }

    return finalPriceInt / 100;
  }
}
