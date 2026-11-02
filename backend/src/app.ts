import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { allowedOrigins } from "./config/env.js";
import adminEnquiryRoutes from "./routes/admin-enquiry.routes.js";
import authRoutes from "./routes/auth.routes.js";
import enquiryRoutes from "./routes/enquiry.routes.js";
import healthRoutes from "./routes/health.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { logger } from "./utils/logger.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: false,
      maxAge: 600,
    }),
  );
  app.use(
    pinoHttp({
      logger,
      serializers: {
        req(request) {
          let pathname = "/";
          try {
            pathname = new URL(request.url ?? "/", "http://localhost").pathname;
          } catch {
            pathname = "/";
          }
          return { method: request.method, url: pathname };
        },
        res(response) {
          return { statusCode: response.statusCode };
        },
      },
    }),
  );
  app.use(express.json({ limit: "32kb", strict: true }));

  app.use("/api/health", healthRoutes);
  app.use("/api/enquiries", enquiryRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminEnquiryRoutes);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

export const app = createApp();
