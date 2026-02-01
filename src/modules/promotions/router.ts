import Elysia from "elysia";

import { HttpDTO } from "@/commons/dto/http.dto";
import { PromotionModel } from "@/modules/promotions/model";
import { PromotionService } from "@/modules/promotions/service";
import { PromotionJob } from "./job";

export const promotionsRouter = new Elysia({
  prefix: "/v1/promotions",
  tags: ["Promotions"],
})
  .get(
    "",
    async ({ query }) => {
      const { items, pagination } = await PromotionService.list(query);

      await PromotionJob.activateScheduledPromotions();

      return {
        code: 200,
        message: "Promotions fetched successfully",
        data: {
          items,
          pagination,
        },
      };
    },
    {
      query: HttpDTO.PaginationQuery,
      response: {
        200: HttpDTO.ResponseDataListPagination(PromotionModel.Details),
        422: HttpDTO.ResponseValidationError,
        500: HttpDTO.ResponseInternalError,
      },
    },
  )
  .post(
    "",
    async ({ body }) => {
      const data = await PromotionService.create(body);

      return {
        code: 201,
        message: "Promotion created successfully",
        data,
      };
    },
    {
      body: PromotionModel.Create,
      response: {
        201: HttpDTO.ResponseData(PromotionModel.Details),
        422: HttpDTO.ResponseValidationError,
        500: HttpDTO.ResponseInternalError,
      },
    },
  );
