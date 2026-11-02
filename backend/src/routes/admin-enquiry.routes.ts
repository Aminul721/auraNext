import { Router } from "express";
import {
  deleteEnquiry,
  getDashboard,
  getEnquiry,
  listEnquiries,
  updateEnquiry,
} from "../controllers/admin-enquiry.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { validateBody, validateQuery } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  enquiryListQuerySchema,
  updateEnquirySchema,
} from "../validators/auth.validator.js";

const router = Router();
router.use(requireAdmin);
router.get("/dashboard", asyncHandler(getDashboard));
router.get(
  "/enquiries",
  validateQuery(enquiryListQuerySchema),
  asyncHandler(listEnquiries),
);
router.get("/enquiries/:id", asyncHandler(getEnquiry));
router.patch(
  "/enquiries/:id",
  validateBody(updateEnquirySchema),
  asyncHandler(updateEnquiry),
);
router.delete("/enquiries/:id", asyncHandler(deleteEnquiry));

export default router;
