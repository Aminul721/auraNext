import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { Admin } from "../models/Admin.js";
import { ApiError } from "../utils/ApiError.js";
import type { LoginInput } from "../types/validated.js";

export async function login(
  _request: Request,
  response: Response,
): Promise<void> {
  const { email, password } = response.locals.validatedBody as LoginInput;
  const admin = await Admin.findOne({ email }).select("+passwordHash");
  if (!admin || !admin.isActive || !(await bcrypt.compare(password, admin.passwordHash))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = jwt.sign(
    { role: admin.role },
    env.JWT_ACCESS_SECRET,
    {
      subject: admin.id,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
      algorithm: "HS256",
    },
  );

  response.json({
    success: true,
    message: "Signed in.",
    accessToken: token,
    tokenType: "Bearer",
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    admin: { id: admin.id, email: admin.email, role: admin.role },
  });
}

export function logout(_request: Request, response: Response): void {
  response.json({ success: true, message: "Signed out." });
}

export async function getCurrentAdmin(
  request: Request,
  response: Response,
): Promise<void> {
  const admin = await Admin.findOne({
    _id: request.admin?.id,
    isActive: true,
  }).select("_id email role");
  if (!admin) throw new ApiError(401, "Authentication required.");
  response.json({
    success: true,
    admin: { id: admin.id, email: admin.email, role: admin.role },
  });
}
