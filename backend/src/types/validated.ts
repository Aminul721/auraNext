import type { z } from "zod";
import type {
  enquiryListQuerySchema,
  loginSchema,
  updateEnquirySchema,
} from "../validators/auth.validator.js";

export type LoginInput = z.infer<typeof loginSchema>;
export type EnquiryListQuery = z.infer<typeof enquiryListQuerySchema>;
export type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;
