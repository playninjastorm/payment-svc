import { ListOptions } from "@/commons/interfaces/interface.types";
import { TransactionDB } from "@/modules/transactions/schema";

export abstract class TransactionRepository {
  static async list({
    filter = {},
    limit = 100,
    skip = 0,
    sort = {},
  }: ListOptions = {}) {
    const clampedLimit = Math.min(Math.max(0, limit), 1000);

    const cursor = await TransactionDB.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(clampedLimit);

    const count = await TransactionDB.countDocuments(filter);

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
}
