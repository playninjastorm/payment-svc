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
      // TODO: TEST ERROR 500 HANDLER
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
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      };
    },
    {
      response: {
        200: CommonDTO.ResponseDataListPagination(PromotionModel.Details),
        // TODO: 422
        // TODO: 500
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
        // TODO: 422
        // TODO: 500
      },
    },
  );
