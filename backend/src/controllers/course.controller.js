import { Course } from "../models/Course.js";
import { CourseContent } from "../models/CourseContent.js";
import { Instructor } from "../models/Instructor.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { slugify } from "../utils/slugify.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

const ensureInstructorCanManage = async (req, course = null) => {
  if (req.user.role === "admin") return;

  let instructor = await Instructor.findOne({ user: req.user._id });
  if (!instructor && req.user.role === "instructor") {
    instructor = await Instructor.create({
      user: req.user._id,
      bio: "Instructor profile pending update.",
      expertise: [],
      qualifications: []
    });
  }
  if (!instructor) throw new AppError("Instructor profile is required", 403);

  if (course && course.instructor.toString() !== instructor._id.toString()) {
    throw new AppError("You can only manage your own courses", 403);
  }

  return instructor;
};

export const createCourse = asyncHandler(async (req, res) => {
  const instructor = req.body.instructor || (await ensureInstructorCanManage(req))?._id;
  const files = req.files || {};

  if (!instructor) {
    throw new AppError("Instructor is required when an admin creates a course", 400);
  }

  const thumbnail = await uploadToCloudinary(files.thumbnail?.[0], "studyhub/courses/thumbnails");
  const previewVideo = await uploadToCloudinary(files.previewVideo?.[0], "studyhub/courses/previews");

  const course = await Course.create({
    ...req.body,
    instructor,
    slug: req.body.slug || slugify(req.body.title),
    thumbnail,
    previewVideo
  });

  res.status(201).json({ success: true, data: course });
});

export const getCourses = asyncHandler(async (req, res) => {
  const { category, instructor, status = "published", q } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (instructor) filter.instructor = instructor;
  if (status !== "all") filter.status = status;
  if (q) filter.$text = { $search: q };

  const courses = await Course.find(filter)
    .populate("category", "name slug")
    .populate({ path: "instructor", populate: { path: "user", select: "name avatar" } })
    .sort("-createdAt");

  res.json({ success: true, count: courses.length, data: courses });
});

export const getMyInstructorCourses = asyncHandler(async (req, res) => {
  let instructor = await Instructor.findOne({ user: req.user._id });

  if (!instructor && req.user.role === "instructor") {
    instructor = await Instructor.create({
      user: req.user._id,
      bio: "Instructor profile pending update.",
      expertise: [],
      qualifications: []
    });
  }

  if (!instructor) throw new AppError("Instructor profile is required", 403);

  const courses = await Course.find({ instructor: instructor._id })
    .populate("category", "name slug")
    .populate({ path: "instructor", populate: { path: "user", select: "name avatar" } })
    .sort("-createdAt");

  res.json({ success: true, count: courses.length, data: courses });
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("category", "name slug")
    .populate({ path: "instructor", populate: { path: "user", select: "name email avatar" } });

  if (!course) throw new AppError("Course not found", 404);
  res.json({ success: true, data: course });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new AppError("Course not found", 404);

  await ensureInstructorCanManage(req, course);

  const updates = { ...req.body };
  if (req.body.title && !req.body.slug) updates.slug = slugify(req.body.title);

  const files = req.files || {};
  if (files.thumbnail?.[0]) {
    updates.thumbnail = await uploadToCloudinary(files.thumbnail[0], "studyhub/courses/thumbnails");
  }
  if (files.previewVideo?.[0]) {
    updates.previewVideo = await uploadToCloudinary(files.previewVideo[0], "studyhub/courses/previews");
  }

  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, data: updatedCourse });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new AppError("Course not found", 404);

  await ensureInstructorCanManage(req, course);
  await CourseContent.deleteMany({ course: course._id });
  await course.deleteOne();

  res.json({ success: true, message: "Course deleted" });
});

export const getCoursesByCategory = asyncHandler(async (req, res) => {
  const courses = await Course.find({ category: req.params.categoryId, status: "published" });
  res.json({ success: true, count: courses.length, data: courses });
});

export const getCoursesByInstructor = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.params.instructorId });
  res.json({ success: true, count: courses.length, data: courses });
});

export const getCourseContent = asyncHandler(async (req, res) => {
  const content = await CourseContent.find({ course: req.params.id, isPublished: true }).sort("order");
  res.json({ success: true, count: content.length, data: content });
});
