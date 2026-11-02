import nodemailer, { type Transporter } from "nodemailer";
import { env, smtpConfigured } from "../config/env.js";
import type { CreateEnquiryInput } from "../validators/enquiry.validator.js";

let transporter: Transporter | undefined;

export async function sendEnquiryNotification(
  enquiry: CreateEnquiryInput,
): Promise<"accepted" | "not_configured" | "not_accepted"> {
  if (!smtpConfigured) return "not_configured";

  transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 15_000,
  });

  const details = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || "Not provided"}`,
    `Company: ${enquiry.company || "Not provided"}`,
    `Service: ${enquiry.service || "Not provided"}`,
    `Event date: ${enquiry.eventDate?.toISOString().slice(0, 10) || "Not provided"}`,
    `Event location: ${enquiry.eventLocation || "Not provided"}`,
    "",
    "Message:",
    enquiry.message,
  ].join("\n");

  const result = await transporter.sendMail({
    from: env.MAIL_FROM,
    to: env.ENQUIRY_NOTIFICATION_EMAIL,
    replyTo: enquiry.email,
    subject: `New AURA HUMANOID TECH enquiry from ${enquiry.name}`,
    text: details,
  });

  return Array.isArray(result.accepted) && result.accepted.length > 0
    ? "accepted"
    : "not_accepted";
}
