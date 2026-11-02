import { z } from "zod";

export const loginSchema = z.strictObject({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
});

export const enquiryListQuerySchema = z.strictObject({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(100).optional(),
  status: z
    .enum(["new", "contacted", "in_progress", "completed", "spam"])
    .optional(),
});

export const updateEnquirySchema = z.strictObject({
  status: z.enum(["new", "contacted", "in_progress", "completed", "spam"]),
});
