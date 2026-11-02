import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

export const requireAdmin: RequestHandler = (request, response, next) => {
  const authorization = request.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : undefined;

  if (!token) {
    response.status(401).json({ success: false, message: "Authentication required." });
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      algorithms: ["HS256"],
    }) as JwtPayload;
    if (typeof payload.sub !== "string" || payload.role !== "admin") {
      response.status(401).json({ success: false, message: "Authentication required." });
      return;
    }
    request.admin = { id: payload.sub, role: "admin" };
    next();
  } catch {
    response.status(401).json({ success: false, message: "Authentication required." });
  }
};
