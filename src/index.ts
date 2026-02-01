import { cron } from "@elysiajs/cron";
import { openapi } from "@elysiajs/openapi";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { serverTiming } from "@elysiajs/server-timing";
import { Elysia } from "elysia";

import { ENV } from "@/config/env";
import { connectDb } from "@/core/db";
import { logger } from "@/core/logger";
import { productsRouter } from "@/modules/products/router";
import { promotionsRouter } from "@/modules/promotions/router";
import { errorHandler } from "@/plugins/errorHandler";
import { requestID } from "@/plugins/requestId";
import { requestLogger } from "@/plugins/requestLogger";
import { PromotionJob } from "@/modules/promotions/job";
import { paymentQueue } from "@/worker";

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
  .use(errorHandler())
  .use(
    cron({
      name: PromotionJob.JOB_ACTIVATE_SCHEDULED_NAME,
      pattern: "0 * * * * *",
      async run() {
        paymentQueue.add(
          PromotionJob.JOB_ACTIVATE_SCHEDULED_NAME,
          {},
          {
            removeOnComplete: true,
            attempts: 3,
            backoff: { type: "exponential", delay: 1000 },
          },
        );
      },
    }),
  )
  .use(errorHandler())
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
  `Server is running at http://${app.server?.hostname}:${app.server?.port}`,
);
