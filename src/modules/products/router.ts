import Elysia from "elysia";

import { CommonDTO } from "@/commons/dto";
import { ProductsSvc } from "@/modules/products/service";
import { ProductDTO } from "@/modules/products/dto";

export const productsRouter = new Elysia({ prefix: "/v1/products" }).get(
  "/",
  async () => {
    const data = await ProductsSvc.list();

    return {
      code: 200,
      message: "Products route is working",
      data,
    };
  },
  {
    response: {
      200: CommonDTO.ResponseData(ProductDTO.ProductList),
    },
  },
);
