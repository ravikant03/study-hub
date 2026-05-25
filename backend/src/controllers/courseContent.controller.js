import { Course } from "../models/Course.js";
import { CourseContent } from "../models/CourseContent.js";
import { Instructor } from "../models/Instructor.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

const ensureCourseManager = async (req, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError("Course not found", 404);
  if (req.user.role === "admin") return course;

  let instructor = await Instructor.findOne({ user: req.user._id });
  if (!instructor && req.user.role === "instructor") {
    instructor = await Instructor.create({
      user: req.user._id,
      bio: "Instructor profile pending update.",
      expertise: [],
      qualifications: []
    });
  }
  if (!instructor || course.instructor.toString() !== instructor._id.toString()) {
    throw new AppError("You can only manage content for your own courses", 403);
  }

  return course;
};

export const createCourseContent = asyncHandler(async (req, res) => {
  await ensureCourseManager(req, req.body.course);

  const media = await uploadToCloudinary(req.file, "studyhub/course-content");
  const content = await CourseContent.create({ ...req.body, media });

  res.status(201).json({ success: true, data: content });
});

export const getCourseContents = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.course) filter.course = req.query.course;

  const contents = await CourseContent.find(filter).populate("course", "title slug").sort("course order");
  res.json({ success: true, count: contents.length, data: contents });
});

export const getCourseContentById = asyncHandler(async (req, res) => {
  const content = await CourseContent.findById(req.params.id).populate("course", "title slug");
  if (!content) throw new AppError("Course content not found", 404);
  res.json({ success: true, data: content });
});

export const updateCourseContent = asyncHandler(async (req, res) => {
  const existing = await CourseContent.findById(req.params.id);
  if (!existing) throw new AppError("Course content not found", 404);

  await ensureCourseManager(req, existing.course);

  const updates = { ...req.body };
  if (req.file) updates.media = await uploadToCloudinary(req.file, "studyhub/course-content");

  const content = await CourseContent.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, data: content });
});

export const deleteCourseContent = asyncHandler(async (req, res) => {
  const existing = await CourseContent.findById(req.params.id);
  if (!existing) throw new AppError("Course content not found", 404);

  await ensureCourseManager(req, existing.course);
  await existing.deleteOne();

  res.json({ success: true, message: "Course content deleted" });
});
