import { Router } from "express";
import { getCurrentAdmin, login, logout } from "../controllers/auth.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { loginRateLimit } from "../middleware/rate-limit.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = Router();
router.post(
  "/login",
  loginRateLimit,
  validateBody(loginSchema),
  asyncHandler(login),
);
router.post("/logout", logout);
router.get("/me", requireAdmin, asyncHandler(getCurrentAdmin));

export default router;
