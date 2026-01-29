import Elysia from "elysia";

import { CommonDTO } from "@/commons/dto";
import { ProductsSvc } from "@/modules/products/service";
import { ProductModel } from "@/modules/products/model";

export const productsRouter = new Elysia({
  prefix: "/v1/products",
  tags: ["Products"],
}).get(
  "",
  async () => {
    const items = await ProductsSvc.list();

    return {
      code: 200,
      message: "Products route is working",
      data: { items },
    };
  },
  {
    response: {
      200: CommonDTO.ResponseDataList(ProductModel.Details),
      // TODO: 422
      // TODO: 500
    },
  },
);
