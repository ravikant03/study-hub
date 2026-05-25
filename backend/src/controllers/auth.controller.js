import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateOtp, hashOtp } from "../utils/otp.js";
import { signToken } from "../utils/token.js";
import { sendEmailVerificationOtp, sendPasswordResetOtp } from "../services/email.service.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  avatar: user.avatar,
  isActive: user.isActive,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role = "student" } = req.body;

  if (role === "admin") {
    throw new AppError("Admin accounts must be created by an existing admin", 403);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const avatar = await uploadToCloudinary(req.file, "studyhub/users");
  const otp = generateOtp();
  const ttlMinutes = Number(process.env.EMAIL_VERIFICATION_OTP_TTL_MINUTES || 10);

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role,
    avatar,
    isEmailVerified: false,
    emailVerificationOtp: hashOtp(otp),
    emailVerificationOtpExpiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000)
  });

  await sendEmailVerificationOtp({ to: user.email, name: user.name, otp });

  res.status(201).json({
    success: true,
    message: "Registration successful. Please verify your email with the OTP sent to your inbox.",
    data: { email: user.email, needsVerification: true }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account is disabled", 403);
  }

  if (!user.isEmailVerified) {
    throw new AppError("Please verify your email before logging in", 403);
  }

  const token = signToken(user);
  res.json({ success: true, token, data: sanitizeUser(user) });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: sanitizeUser(req.user) });
});

export const verifyEmailOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email }).select("+emailVerificationOtp +emailVerificationOtpExpiresAt");

  if (!user || !user.emailVerificationOtp || !user.emailVerificationOtpExpiresAt) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  const isExpired = user.emailVerificationOtpExpiresAt.getTime() < Date.now();
  if (isExpired || user.emailVerificationOtp !== hashOtp(otp)) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationOtp = undefined;
  user.emailVerificationOtpExpiresAt = undefined;
  await user.save({ validateBeforeSave: false });

  const token = signToken(user);
  res.json({ success: true, token, data: sanitizeUser(user) });
});

export const resendVerificationOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select("+emailVerificationOtp +emailVerificationOtpExpiresAt");

  if (!user) throw new AppError("User not found", 404);
  if (user.isEmailVerified) throw new AppError("Email is already verified", 400);

  const otp = generateOtp();
  const ttlMinutes = Number(process.env.EMAIL_VERIFICATION_OTP_TTL_MINUTES || 10);

  user.emailVerificationOtp = hashOtp(otp);
  user.emailVerificationOtpExpiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  await sendEmailVerificationOtp({ to: user.email, name: user.name, otp });

  res.json({ success: true, message: "Verification OTP sent" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select("+passwordResetOtp +passwordResetOtpExpiresAt");

  if (!user) {
    res.json({ success: true, message: "If the email exists, an OTP has been sent" });
    return;
  }

  const otp = generateOtp();
  const ttlMinutes = Number(process.env.PASSWORD_RESET_OTP_TTL_MINUTES || 10);

  user.passwordResetOtp = hashOtp(otp);
  user.passwordResetOtpExpiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  await sendPasswordResetOtp({ to: user.email, name: user.name, otp });

  res.json({ success: true, message: "If the email exists, an OTP has been sent" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({ email }).select("+password +passwordResetOtp +passwordResetOtpExpiresAt");

  if (!user || !user.passwordResetOtp || !user.passwordResetOtpExpiresAt) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  const isExpired = user.passwordResetOtpExpiresAt.getTime() < Date.now();
  if (isExpired || user.passwordResetOtp !== hashOtp(otp)) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  user.password = password;
  user.passwordResetOtp = undefined;
  user.passwordResetOtpExpiresAt = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successfully" });
});
