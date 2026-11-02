import { Router } from "express";
import { createEnquiry } from "../controllers/enquiry.controller.js";
import { enquiryRateLimit } from "../middleware/rate-limit.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { createEnquirySchema } from "../validators/enquiry.validator.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.post(
  "/",
  enquiryRateLimit,
  validateBody(createEnquirySchema),
  asyncHandler(createEnquiry),
);

export default router;
