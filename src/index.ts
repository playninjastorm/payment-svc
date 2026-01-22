import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";

import { ENV } from "@/config/env";
import { productsRouter } from "@/modules/products/router";
import { promotionsRouter } from "@/modules/promotions/router";

const app = new Elysia()
  .use(
    openapi({
      path: "/docs",
      enabled: ENV.ENABLE_DOCS,
    }),
  )
  .get("/", () => {
    return {
      code: 200,
      message: "Ninja Kaizen Payment Service",
    };
  })
  .use(productsRouter)
  .use(promotionsRouter)
  .listen(ENV.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
