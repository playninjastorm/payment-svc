import { logger } from "@/core/logger";
import Elysia from "elysia";

export const requestLogger = (header = "X-Request-ID") =>
  new Elysia({ name: "request-logger" })
    .onRequest(({ store }) => {
      (store as any).startTime = performance.now();
    })
    .onAfterHandle({ as: "global" }, ({ request, set, store }) => {
      const start = ((store as any).startTime as number) ?? performance.now();
      const duration = (performance.now() - start).toFixed(1);
      const requestId = set.headers[header] ?? "no-id";

      logger.info(
        { requestId },
        `${request.method} ${new URL(request.url).pathname} -> ${set.status} | ${duration}ms`,
      );
    })
    .onError({ as: "global" }, ({ request, set, error, store }) => {
      const start = ((store as any).startTime as number) ?? performance.now();
      const duration = (performance.now() - start).toFixed(1);
      const requestId = set.headers[header] ?? "no-id";

      const err_message =
        error instanceof Error ? error.message : String(error);

      logger.error(
        {
          requestId,
          error: err_message,
          stack: error instanceof Error ? error.stack : undefined,
        },
        `${request.method} ${new URL(request.url).pathname} -> ${set.status ?? 500} | ${duration}ms`,
      );
    });
