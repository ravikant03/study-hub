import express from "express";
import {
  confirmPayment,
  createPaymentOrder,
  getAllPayments,
  getMyPayments,
  getPaymentById
} from "../controllers/payment.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { requireFields } from "../middleware/validate.middleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/orders", requireFields("courseId"), createPaymentOrder);
router.post(
  "/confirm",
  requireFields("razorpayOrderId", "razorpayPaymentId", "razorpaySignature"),
  confirmPayment
);
router.get("/me", getMyPayments);
router.get("/", authorize("admin"), getAllPayments);
router.get("/:id", getPaymentById);

export default router;
