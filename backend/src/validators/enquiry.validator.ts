import { z } from "zod";
import { enquiryServices } from "../models/Enquiry.js";

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().trim().max(max).optional(),
  );

export const createEnquirySchema = z.strictObject({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: optionalText(40),
  company: optionalText(120),
  service: z.enum(enquiryServices).optional(),
  eventDate: z
    .preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().date().optional(),
    )
    .transform((value) => (value ? new Date(`${value}T00:00:00.000Z`) : undefined)),
  eventLocation: optionalText(160),
  message: z.string().trim().min(1).max(5000),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
