import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId, userId } = req.body;
  const course = await Course.findById(courseId);
  if (!course) throw new AppError("Course not found", 404);

  const targetUser = req.user.role === "admin" && userId ? userId : req.user._id;

  const enrollment = await Enrollment.findOneAndUpdate(
    { user: targetUser, course: courseId },
    { $setOnInsert: { status: course.price === 0 ? "active" : "pending", enrolledAt: new Date() } },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(201).json({ success: true, data: enrollment });
});

export const getUserEnrollments = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;
  if (req.user.role !== "admin" && userId.toString() !== req.user._id.toString()) {
    throw new AppError("You can only view your own enrollments", 403);
  }

  const enrollments = await Enrollment.find({ user: userId })
    .populate("course", "title slug price thumbnail")
    .sort("-createdAt");

  res.json({ success: true, count: enrollments.length, data: enrollments });
});

export const getCourseEnrollments = asyncHandler(async (req, res) => {
  if (req.user.role === "instructor") {
    const course = await Course.findById(req.params.courseId).populate("instructor");
    if (!course || course.instructor.user.toString() !== req.user._id.toString()) {
      throw new AppError("You can only view enrollments for your own courses", 403);
    }
  }

  const enrollments = await Enrollment.find({ course: req.params.courseId })
    .populate("user", "name email")
    .sort("-createdAt");

  res.json({ success: true, count: enrollments.length, data: enrollments });
});

export const getAllEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find()
    .populate("user", "name email")
    .populate("course", "title slug price thumbnail")
    .sort("-createdAt");

  res.json({ success: true, count: enrollments.length, data: enrollments });
});

export const updateEnrollmentStatus = asyncHandler(async (req, res) => {
  const { status, progressPercent, userId, courseId } = req.body;
  const updates = {};

  if (status) updates.status = status;
  if (progressPercent !== undefined) updates.progressPercent = progressPercent;
  if (userId) updates.user = userId;
  if (courseId) updates.course = courseId;
  if (status === "completed") updates.completedAt = new Date();

  const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  if (!enrollment) throw new AppError("Enrollment not found", 404);
  res.json({ success: true, data: enrollment });
});

export const deleteEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
  if (!enrollment) throw new AppError("Enrollment not found", 404);
  res.json({ success: true, message: "Enrollment deleted" });
});
