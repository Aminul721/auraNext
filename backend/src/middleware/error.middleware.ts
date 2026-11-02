import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

export const errorMiddleware: ErrorRequestHandler = (
  error: unknown,
  request,
  response,
  next,
) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details ? { errors: error.details } : {}),
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      success: false,
      message: "Please check the submitted information.",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    error.type === "entity.too.large"
  ) {
    response.status(413).json({
      success: false,
      message: "Request body is too large.",
    });
    return;
  }

  const errorName =
    typeof error === "object" && error !== null && "name" in error
      ? String(error.name)
      : "UnknownError";
  logger.error(
    { errorName, method: request.method, path: request.path },
    "Unhandled request error",
  );
  response.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
};
