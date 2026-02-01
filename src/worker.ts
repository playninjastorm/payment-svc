import { Queue, Worker } from "bullmq";

import { redis } from "@/core/redis";
import { logger } from "@/core/logger";
import { PromotionJob } from "@/modules/promotions/job";

export const WORKER_QUEUE_NAME = "nk-payments-worker";

export const paymentQueue = new Queue(WORKER_QUEUE_NAME, {
  connection: redis,
});

export const worker = new Worker(
  WORKER_QUEUE_NAME,
  async (job) => {
    if (job.name === PromotionJob.JOB_ACTIVATE_SCHEDULED_NAME) {
      PromotionJob.activateScheduledPromotions();
      return;
    }

    logger.warn(
      {
        name: job.name,
        data: job.data,
      },
      `[${WORKER_QUEUE_NAME}] Unknown job`,
    );
  },
  { connection: redis },
);

worker.on("failed", (job, err) => {
  logger.error(
    {
      jobName: job?.name,
      err,
    },
    `[${WORKER_QUEUE_NAME}] failed`,
  );
});

// shutdown limpio
const shutdown = async () => {
  logger.info("[worker] shutting down...");
  await worker.close();
  await redis.quit();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

logger.info(`[${WORKER_QUEUE_NAME}] listening on queue`);
