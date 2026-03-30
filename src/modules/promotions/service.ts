import { ListOptions } from "@/commons/interfaces/interface.types";
import { DiscountTypeEnum } from "@/commons/models/productPromotion.model";
import { ServiceError } from "@/commons/utils/errors.utils";
import { stripe } from "@/core/stripe";
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

  static async findActiveOutOfSchedule(date: Date) {
    const data = await PromotionRepository.findActiveOutOfSchedule(date);
    return data;
  }

  static async activatePromotion(id: string) {
    const data = await PromotionRepository.updateState(
      id,
      PromotionModel.StateEnum.ACTIVE,
    );

    return data;
  }

  static async deactivatePromotion(promotion: PromotionModel.Details) {
    const newLines = await this.deleteStripeCoupons(promotion);

    const data = await PromotionRepository.updateState(
      promotion.id,
      PromotionModel.StateEnum.ENDED,
      newLines,
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

      // Calculate the final price for each platform if the line has a platform sync configuration and the product has the corresponding platform configured.
      let platformStripe: PromotionModel.PromotionLineStripe | null = null;
      if (line.platformSync.stripe && product.platforms.stripe) {
        const stripePriceBreakdown = this.calculatePriceBreakdown(
          product.platforms.stripe.basePrice,
          line.discount.discountType,
          line.discount.discountValue,
        );

        const stripeCoupon = await stripe.coupons.create({
          amount_off: Math.round(stripePriceBreakdown.discountAmount * 100), // Stripe expects amounts in cents
          name: payload.name,
          currency: "usd",
        });

        platformStripe = {
          couponId: stripeCoupon.id,
          baseSnapshot: product.platforms.stripe?.basePrice,
          finalPrice: stripePriceBreakdown.finalPrice,
          redeemedHistory: [],
        };
      }

      let platformPaypal: PromotionModel.PromotionLinePaypal | null = null;
      if (line.platformSync.paypal && product.platforms.paypal) {
        const paypalPriceBreakdown = this.calculatePriceBreakdown(
          product.platforms.paypal.basePrice,
          line.discount.discountType,
          line.discount.discountValue,
        );

        platformPaypal = {
          baseSnapshot: product.platforms.paypal?.basePrice,
          finalPrice: paypalPriceBreakdown.finalPrice,
        };
      }

      let platformXsolla: PromotionModel.PromotionLineXsolla | null = null;
      if (line.platformSync.xsolla && product.platforms.xsolla) {
        const xsollaPriceBreakdown = this.calculatePriceBreakdown(
          product.platforms.xsolla.basePrice,
          line.discount.discountType,
          line.discount.discountValue,
        );

        platformXsolla = {
          promotionId: line.platformSync.xsolla.promotionId,
          baseSnapshot: product.platforms.xsolla?.basePrice,
          finalPrice: xsollaPriceBreakdown.finalPrice,
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

  private static calculatePriceBreakdown(
    basePrice: number,
    discountType: DiscountTypeEnum,
    discountValue: number,
  ): { finalPrice: number; discountAmount: number } {
    const basePriceInt = Math.round(basePrice * 100);
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

    // Recalculate discount based on the forced final price
    discountAmountInt = basePriceInt - finalPriceInt;

    return {
      finalPrice: finalPriceInt / 100,
      discountAmount: discountAmountInt / 100,
    };
  }

  static async deleteStripeCoupons(promotion: PromotionModel.Details) {
    const newLines = [...promotion.lines];

    for (let i = 0; i < promotion.lines.length; i++) {
      const line = promotion.lines[i];

      if (line.platformSync.stripe) {
        const coupon = await stripe.coupons.retrieve(
          line.platformSync.stripe?.couponId!,
        );

        if (coupon) {
          line.platformSync.stripe.redeemedHistory = [
            ...line.platformSync.stripe.redeemedHistory,
            {
              couponId: line.platformSync.stripe.couponId,
              timesRedeemed: coupon.times_redeemed,
            },
          ];

          newLines[i].platformSync.stripe = line.platformSync.stripe;

          await stripe.coupons.del(line.platformSync.stripe.couponId);
        }
      }
    }

    return newLines;
  }
}
