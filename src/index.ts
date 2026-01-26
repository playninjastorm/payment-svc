import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";

import { ENV } from "@/config/env";
import { productsRouter } from "@/modules/products/router";
import { promotionsRouter } from "@/modules/promotions/router";
import { connectDb } from "@/core/db";

await connectDb();

const app = new Elysia()
  .use(
    openapi({
      path: "/docs",
      enabled: ENV.ENABLE_DOCS,
    }),
  )
  .get(
    "/",
    () => {
      return {
        code: 200,
        message: "Ninja Kaizen Payment Service",
      };
    },
    {
      tags: ["Health Check"],
    },
  )
  .use(productsRouter)
  .use(promotionsRouter)
  .listen(ENV.PORT);

console.log(
  `🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`,
);
