import Elysia from "elysia";

export const productsRouter = new Elysia({ prefix: "/v1/products" }).get(
  "/",
  () => {
    return {
      code: 200,
      message: "Products route is working",
    };
  },
);
