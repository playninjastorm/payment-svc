import { Queue, Worker } from "bullmq";

import { connectDb } from "@/core/db";
import { logger } from "@/core/logger";
import { redis } from "@/core/redis";
import { PromotionJob } from "@/modules/promotions/job";

await connectDb();

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
        worker: WORKER_QUEUE_NAME,
        name: job.name,
        data: job.data,
      },
      "Unknown job",
    );
  },
  { connection: redis },
);

worker.on("ready", () => {
  logger.info({ worker: WORKER_QUEUE_NAME }, "Worker is ready");
});

worker.on("failed", (job, err) => {
  logger.error(
    {
      worker: WORKER_QUEUE_NAME,
      job: job?.name,
      err,
    },
    "Failed to process job",
  );
});

// shutdown limpio
const shutdown = async () => {
  logger.info({ worker: WORKER_QUEUE_NAME }, "Shutting down...");
  await worker.close();
  await redis.quit();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
