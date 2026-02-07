import Elysia from "elysia";

import { HttpDTO } from "@/commons/dto/http.dto";
import { TransactionModel } from "@/modules/transactions/model";
import { TransactionService } from "@/modules/transactions/service";

export const transactionsRouter = new Elysia({
  prefix: "/v1/transactions",
  tags: ["Transactions"],
}).get(
  "",
  async ({ query }) => {
    const { items, pagination } = await TransactionService.list(query);

    return {
      code: 200,
      message: "Transactions fetched successfully",
      data: {
        items,
        pagination,
      },
    };
  },
  {
    query: HttpDTO.PaginationQuery,
    response: {
      200: HttpDTO.ResponseDataListPagination(TransactionModel.Details),
      422: HttpDTO.ResponseValidationError,
      500: HttpDTO.ResponseInternalError,
    },
  },
);
