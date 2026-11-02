import bcrypt from "bcryptjs";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import { Admin } from "../models/Admin.js";
import { logger } from "../utils/logger.js";

async function createAdmin(): Promise<void> {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before running create-admin.",
    );
  }
  if (env.ADMIN_PASSWORD.length < 16) {
    throw new Error("ADMIN_PASSWORD must be at least 16 characters for admin creation.");
  }

  await connectDatabase();
  const email = env.ADMIN_EMAIL.toLowerCase();
  const existingAdmin = await Admin.findOne({ email }).select("_id");
  if (existingAdmin) throw new Error("An admin account already exists for that email.");

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  await Admin.create({ email, passwordHash, role: "admin", isActive: true });
  logger.info({ email }, "Admin account created");
}

createAdmin()
  .catch((error: unknown) => {
    const errorName =
      typeof error === "object" && error !== null && "name" in error
        ? String(error.name)
        : "UnknownError";
    logger.error({ errorName }, "Admin account creation failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase().catch(() => {
      logger.error("Admin setup could not close the MongoDB connection.");
      process.exitCode = 1;
    });
  });
