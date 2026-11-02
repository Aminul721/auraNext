import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const optionalNonEmpty = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional(),
);

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(5000),
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    FRONTEND_URL: z.string().min(1, "FRONTEND_URL is required"),
    JWT_ACCESS_SECRET: z
      .string()
      .min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
    JWT_ACCESS_EXPIRES_IN: z
      .string()
      .regex(/^\d+(s|m|h|d)$/, "must use a duration such as 15m")
      .default("15m"),
    ADMIN_EMAIL: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().email().optional(),
    ),
    ADMIN_PASSWORD: optionalNonEmpty,
    SMTP_HOST: optionalNonEmpty,
    SMTP_PORT: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().int().min(1).max(65535).optional(),
    ),
    SMTP_SECURE: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
    SMTP_USER: optionalNonEmpty,
    SMTP_PASS: optionalNonEmpty,
    MAIL_FROM: optionalNonEmpty,
    ENQUIRY_NOTIFICATION_EMAIL: z
      .string()
      .email()
      .default("admin@aurahumanoidtech.com"),
  })
  .superRefine((config, context) => {
    const smtpValues = [
      config.SMTP_HOST,
      config.SMTP_PORT,
      config.SMTP_USER,
      config.SMTP_PASS,
      config.MAIL_FROM,
    ];
    const smtpConfigured = smtpValues.some(Boolean);
    if (smtpConfigured && smtpValues.some((value) => !value)) {
      context.addIssue({
        code: "custom",
        message:
          "SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM must be configured together",
        path: ["SMTP_HOST"],
      });
    }

    if (config.ADMIN_PASSWORD && config.ADMIN_PASSWORD.length < 12) {
      context.addIssue({
        code: "custom",
        message: "ADMIN_PASSWORD must be at least 12 characters",
        path: ["ADMIN_PASSWORD"],
      });
    }
  });

  const parsedEnv = envSchema.safeParse(process.env);
  if (!parsedEnv.success) {
    const issues = parsedEnv.error.issues
      .map((issue) => `${issue.path.join(".") || "configuration"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Backend environment validation failed: ${issues}`);
  }

  export const env = parsedEnv.data;
export const allowedOrigins = env.FRONTEND_URL.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
export const smtpConfigured = Boolean(
  env.SMTP_HOST &&
    env.SMTP_PORT &&
    env.SMTP_USER &&
    env.SMTP_PASS &&
    env.MAIL_FROM,
);
