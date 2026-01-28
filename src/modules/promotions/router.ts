import Elysia from "elysia";

export const promotionsRouter = new Elysia({
  prefix: "/v1/promotions",
  tags: ["Promotions"],
})
  .get("", () => {
    // TODO: TEST ERROR 500 HANDLER
    return {
      code: 200,
      message: "Promotions route is working",
    };
  })
  .post("", () => {
    return {
      code: 201,
      message: "Promotion created successfully",
    };
  });
