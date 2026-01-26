import Elysia from "elysia";

import { ProductsSvc } from "@/modules/products/service";

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
);
