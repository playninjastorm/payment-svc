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

  static async findByScheduleTime(date: Date) {
    return await PromotionDB.find({
      state: PromotionModel.StateEnum.SCHEDULED,
      "schedule.startsAt": { $lte: date },
      "schedule.endsAt": { $gte: date },
    });
  }

  static async updateState(id: string, state: PromotionModel.StateEnum) {
    const update: Record<string, any> = { state };

    if (state === PromotionModel.StateEnum.ACTIVE) {
      if (!update.audit) update.audit = {};
      update.audit.activatedAt = new Date();
    }

    if (state === PromotionModel.StateEnum.ENDED) {
      if (!update.audit) update.audit = {};
      update.audit.endedAt = new Date();
    }

    return PromotionDB.findByIdAndUpdate(id, update, { new: true });
  }
}
