import type { Request, Response } from "express";
import { getDatabaseState } from "../config/database.js";

export function getHealth(_request: Request, response: Response): void {
  const database = getDatabaseState();
  response.status(database === "connected" ? 200 : 503).json({
    success: database === "connected",
    status: database === "connected" ? "ok" : "degraded",
    database,
    timestamp: new Date().toISOString(),
  });
}
