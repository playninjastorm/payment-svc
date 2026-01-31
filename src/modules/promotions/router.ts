import { CommonDTO } from "@/commons/dto";
import Elysia from "elysia";
import { PromotionModel } from "./model";

export const promotionsRouter = new Elysia({
  prefix: "/v1/promotions",
  tags: ["Promotions"],
})
  .get(
    "",
    () => {
      return {
        code: 200,
        message: "Promotions route is working",
        data: {
          items: [],
          pagination: {
            page: 1,
            limit: 10,
            totalItems: 0,
            totalPages: 0,
            hasNextPage: true,
            hasPreviousPage: false,
          },
        },
      };
    },
    {
      query: CommonDTO.PaginationQuery,
      response: {
        200: CommonDTO.ResponseDataListPagination(PromotionModel.Details),
        422: CommonDTO.ResponseValidationError,
        500: CommonDTO.ResponseInternalError,
      },
    },
  )
  .post(
    "",
    () => {
      return {
        code: 201,
        message: "Promotion created successfully",
      };
    },
    {
      response: {
        422: CommonDTO.ResponseValidationError,
        500: CommonDTO.ResponseInternalError,
      },
    },
  );
