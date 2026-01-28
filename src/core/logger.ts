import { ENV } from "@/config/env";
import pino from "pino";

let logger_transport = undefined;

if (ENV.IS_DEV) {
  logger_transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  };
}

const logger = pino({
  transport: logger_transport,
});

export { logger };
