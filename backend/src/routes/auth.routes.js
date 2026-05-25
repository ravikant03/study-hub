import express from "express";
import {
  forgotPassword,
  getMe,
  login,
  register,
  resendVerificationOtp,
  resetPassword,
  verifyEmailOtp
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { requireFields } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), requireFields("name", "email", "password"), register);
router.post("/login", requireFields("email", "password"), login);
router.get("/me", authenticate, getMe);
router.post("/verify-otp", requireFields("email", "otp"), verifyEmailOtp);
router.post("/resend-verification-otp", requireFields("email"), resendVerificationOtp);
router.post("/forgot-password", requireFields("email"), forgotPassword);
router.post("/reset-password", requireFields("email", "otp", "password"), resetPassword);

export default router;
