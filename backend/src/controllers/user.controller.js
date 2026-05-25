import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

const publicFields = "-password -passwordResetOtp -passwordResetOtpExpiresAt";

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const avatar = await uploadToCloudinary(req.file, "studyhub/users");
  const user = await User.create({ name, email, password, role, phone, avatar });

  res.status(201).json({ success: true, data: user });
});

export const getUsers = asyncHandler(async (req, res) => {
  const { role, isActive } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === "true";

  const users = await User.find(filter).select(publicFields).sort("-createdAt");
  res.json({ success: true, count: users.length, data: users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(publicFields);
  if (!user) throw new AppError("User not found", 404);
  res.json({ success: true, data: user });
});

export const updateMe = asyncHandler(async (req, res) => {
  const allowed = ["name", "phone"];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));

  if (req.file) {
    updates.avatar = await uploadToCloudinary(req.file, "studyhub/users");
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  }).select(publicFields);

  res.json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const allowed = ["name", "phone", "role", "isActive"];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));

  if (req.file) {
    updates.avatar = await uploadToCloudinary(req.file, "studyhub/users");
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  }).select(publicFields);

  if (!user) throw new AppError("User not found", 404);
  res.json({ success: true, data: user });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select(publicFields);

  if (!user) throw new AppError("User not found", 404);
  res.json({ success: true, data: user });
});
