import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment"
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: "INR"
    },
    method: {
      type: String,
      enum: ["razorpay"],
      default: "razorpay"
    },
    status: {
      type: String,
      enum: ["created", "authorized", "captured", "failed", "refunded"],
      default: "created"
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    receipt: String,
    notes: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
