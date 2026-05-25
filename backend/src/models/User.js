import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"]
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student"
    },
    phone: {
      type: String,
      trim: true
    },
    avatar: {
      url: String,
      publicId: String,
      resourceType: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationOtp: {
      type: String,
      select: false
    },
    emailVerificationOtpExpiresAt: {
      type: Date,
      select: false
    },
    passwordResetOtp: {
      type: String,
      select: false
    },
    passwordResetOtpExpiresAt: {
      type: Date,
      select: false
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
