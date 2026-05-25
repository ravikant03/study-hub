import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled", "refunded"],
      default: "pending"
    },
    progressPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
