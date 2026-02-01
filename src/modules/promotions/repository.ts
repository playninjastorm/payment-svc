import { ListOptions } from "@/commons/interfaces/interface.types";
import { PromotionModel } from "@/modules/promotions/model";
import { PromotionDB } from "@/modules/promotions/schema";

export abstract class PromotionRepository {
  static async list({
    filter = {},
    limit = 100,
    skip = 0,
    sort = {},
  }: ListOptions = {}) {
    const clampedLimit = Math.min(Math.max(0, limit), 1000);

    const cursor = await PromotionDB.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(clampedLimit);

    const count = await PromotionDB.countDocuments(filter);

    return {
      items: cursor,
      pagination: {
        page: Math.floor(skip / clampedLimit) + 1,
        limit: clampedLimit,
        totalItems: count,
        totalPages: Math.ceil(count / clampedLimit),
        hasNextPage: skip + clampedLimit < count,
        hasPreviousPage: skip > 0,
      },
    };
  }

  static async create(promotion: PromotionModel.Create) {
    return await PromotionDB.create(promotion);
  }
}
