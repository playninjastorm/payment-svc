import Elysia from "elysia";

import { HttpDTO } from "@/commons/dto/http.dto";
import { ProductService } from "@/modules/products/service";
import { ProductModel } from "@/modules/products/model";

export const productsRouter = new Elysia({
  prefix: "/v1/products",
  tags: ["Products"],
})
  .get(
    "",
    async () => {
      const items = await ProductService.list();

      return {
        code: 200,
        message: "Products route is working",
        data: { items },
      };
    },
    {
      response: {
        200: HttpDTO.ResponseDataList(ProductModel.Details),
        500: HttpDTO.ResponseInternalError,
      },
    },
  )
  .get(
    "/store",
    async () => {
      const data = await ProductService.storeList();

      return {
        code: 200,
        message: "Products store route is working",
        data,
      };
    },
    {
      response: {
        200: HttpDTO.ResponseDataList(
          ProductModel.Store,
          ProductModel.StoreMetadata,
        ),
        500: HttpDTO.ResponseInternalError,
      },
    },
  );
