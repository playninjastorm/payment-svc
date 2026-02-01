import { ListOptions } from "@/commons/interfaces/interface.types";
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

  static async create(promotion: PromotionModel.Create) {
    const data = await PromotionRepository.create(promotion);

    return data;
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
}
