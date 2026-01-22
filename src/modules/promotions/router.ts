import Elysia from "elysia";

export const promotionsRouter = new Elysia({ prefix: "/v1/promotions" }).get(
  "/",
  () => {
    return {
      code: 200,
      message: "Promotions route is working",
    };
  },
);
