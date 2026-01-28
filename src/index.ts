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
import { logger } from "@/core/logger";

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
      name: "promotions-check-scheduled ",
      pattern: "0 * * * * *",
      run() {
        logger.info(
          { timestamp: new Date().toISOString() },
          "[Cronjob] Check promotions",
        );
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

logger.info(
  `🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`,
);
