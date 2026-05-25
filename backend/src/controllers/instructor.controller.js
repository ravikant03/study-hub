import { Course } from "../models/Course.js";
import { Instructor } from "../models/Instructor.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createInstructor = asyncHandler(async (req, res) => {
  const { user, bio, expertise = [], qualifications = [], socialLinks } = req.body;
  const targetUser = await User.findById(user);

  if (!targetUser) throw new AppError("User not found", 404);
  targetUser.role = "instructor";
  await targetUser.save({ validateBeforeSave: false });

  const instructor = await Instructor.create({
    user,
    bio,
    expertise,
    qualifications,
    socialLinks
  });

  res.status(201).json({ success: true, data: instructor });
});

export const getInstructors = asyncHandler(async (req, res) => {
  const instructors = await Instructor.find()
    .populate("user", "name email avatar phone")
    .sort("-createdAt");

  res.json({ success: true, count: instructors.length, data: instructors });
});

export const getInstructorById = asyncHandler(async (req, res) => {
  const instructor = await Instructor.findById(req.params.id).populate("user", "name email avatar phone");
  if (!instructor) throw new AppError("Instructor not found", 404);

  const courses = await Course.find({ instructor: instructor._id }).select("title slug price status thumbnail");
  res.json({ success: true, data: { ...instructor.toObject(), courses } });
});

export const updateInstructor = asyncHandler(async (req, res) => {
  const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate("user", "name email avatar phone");

  if (!instructor) throw new AppError("Instructor not found", 404);
  res.json({ success: true, data: instructor });
});

export const deleteInstructor = asyncHandler(async (req, res) => {
  const instructor = await Instructor.findByIdAndDelete(req.params.id);
  if (!instructor) throw new AppError("Instructor not found", 404);
  res.json({ success: true, message: "Instructor deleted" });
});
