import { createServer } from "node:http";
import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

async function startServer(): Promise<void> {
  await connectDatabase();

  const server = createServer(app);
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(env.PORT, () => {
      server.off("error", reject);
      resolve();
    });
  });
  logger.info({ port: env.PORT }, "AURA API server listening");

  let shuttingDown = false;
  const shutdown = (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, "Graceful shutdown started");

    const timeout = setTimeout(() => {
      logger.error("Graceful shutdown timed out");
      process.exitCode = 1;
      server.closeAllConnections();
      void disconnectDatabase().finally(() => process.exit());
    }, 10_000);
    timeout.unref();

    server.close((error) => {
      if (error) {
        logger.error({ err: error }, "HTTP server close failed");
        process.exitCode = 1;
      }
      void disconnectDatabase()
        .then(() => logger.info("MongoDB disconnected"))
        .catch((disconnectError: unknown) => {
          logger.error({ err: disconnectError }, "MongoDB disconnect failed");
          process.exitCode = 1;
        })
        .finally(() => {
          clearTimeout(timeout);
        });
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error: unknown) => {
  const errorName =
    typeof error === "object" && error !== null && "name" in error
      ? String(error.name)
      : "UnknownError";
  logger.fatal(
    { errorName },
    "API startup failed. Check environment configuration and MongoDB connectivity.",
  );
  process.exitCode = 1;
});
