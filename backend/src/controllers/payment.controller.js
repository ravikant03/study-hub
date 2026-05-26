import { getRazorpay } from "../config/razorpay.js";
import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";
import { Payment } from "../models/Payment.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyRazorpaySignature } from "../utils/razorpaySignature.js";

export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  if (!course) throw new AppError("Course not found", 404);
  if (course.price <= 0) throw new AppError("This course does not require payment", 400);

  const razorpay = getRazorpay();
  const receipt = `studyhub_${Date.now()}`;
  const order = await razorpay.orders.create({
    amount: Math.round(course.price * 100),
    currency: "INR",
    receipt,
    notes: {
      courseId: course._id.toString(),
      userId: req.user._id.toString()
    }
  });

  const payment = await Payment.create({
    user: req.user._id,
    course: course._id,
    amount: course.price,
    currency: order.currency,
    status: "created",
    razorpayOrderId: order.id,
    receipt,
    notes: order.notes
  });

  res.status(201).json({
    success: true,
    data: {
      payment,
      razorpay: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    }
  });
});

export const confirmPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) throw new AppError("Payment order not found", 404);

  if (payment.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new AppError("You can only confirm your own payment", 403);
  }

  const isValid = verifyRazorpaySignature({
    orderId: payment.razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature
  });

  if (!isValid) {
    payment.status = "failed";
    await payment.save();
    throw new AppError("Payment signature verification failed", 400);
  }

  let enrollment = await Enrollment.findOne({ user: payment.user, course: payment.course });
  if (!enrollment) {
    enrollment = await Enrollment.create({
      user: payment.user,
      course: payment.course,
      status: "active"
    });
  } else {
    enrollment.status = "active";
    await enrollment.save();
  }

  payment.status = "captured";
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.enrollment = enrollment._id;
  await payment.save();

  res.json({ success: true, data: { payment, enrollment } });
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate("user", "name email").populate("course", "title");
  if (!payment) throw new AppError("Payment not found", 404);

  if (req.user.role !== "admin" && payment.user._id.toString() !== req.user._id.toString()) {
    throw new AppError("You can only view your own payment details", 403);
  }

  res.json({ success: true, data: payment });
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).populate("course", "title slug").sort("-createdAt");
  res.json({ success: true, count: payments.length, data: payments });
});

export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("user", "name email")
    .populate("course", "title slug")
    .populate("enrollment", "status")
    .sort("-createdAt");

  res.json({ success: true, count: payments.length, data: payments });
});
