import Elysia from "elysia";

export const promotionsRouter = new Elysia({
  prefix: "/v1/promotions",
  tags: ["Promotions"],
})
  .get("", () => {
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
