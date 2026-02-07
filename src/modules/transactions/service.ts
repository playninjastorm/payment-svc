import { ListOptions } from "@/commons/interfaces/interface.types";
import { TransactionRepository } from "@/modules/transactions/repository";

export abstract class TransactionService {
  static async list({
    filter = {},
    limit = 100,
    skip = 0,
    sort = {},
  }: ListOptions = {}) {
    const { items, pagination } = await TransactionRepository.list({
      filter,
      limit,
      skip,
      sort,
    });

    return { items, pagination };
  }
}
