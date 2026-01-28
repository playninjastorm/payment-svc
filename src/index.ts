import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { serverTiming } from "@elysiajs/server-timing";
import { cron } from "@elysiajs/cron";

import { ENV } from "@/config/env";
import { productsRouter } from "@/modules/products/router";
import { promotionsRouter } from "@/modules/promotions/router";
import { connectDb } from "@/core/db";
import { requestID } from "@/plugins/requestId";
import { requestLogger } from "@/plugins/requestLogger";

await connectDb();

const app = new Elysia()
  .use(
    openapi({
      path: "/docs",
      enabled: ENV.ENABLE_DOCS,
    }),
  )
  .use(opentelemetry())
  .use(serverTiming())
  .use(requestID())
  .use(requestLogger())
  .use(
    cron({
      name: "heartbeat",
      pattern: "0 * * * * *",
      run() {
        console.log("Check promotions: ", new Date().toISOString());
      },
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
