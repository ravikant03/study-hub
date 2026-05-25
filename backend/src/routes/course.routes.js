import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourseContent,
  getCourses,
  getMyInstructorCourses,
  getCoursesByCategory,
  getCoursesByInstructor,
  updateCourse
} from "../controllers/course.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { requireFields } from "../middleware/validate.middleware.js";

const router = express.Router();

const courseMediaUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "previewVideo", maxCount: 1 }
]);

router.get("/", getCourses);
router.get("/mine", authenticate, authorize("instructor"), getMyInstructorCourses);
router.get("/category/:categoryId", getCoursesByCategory);
router.get("/instructor/:instructorId", getCoursesByInstructor);
router.get("/:id", getCourseById);
router.get("/:id/content", getCourseContent);
router.post(
  "/",
  authenticate,
  authorize("admin", "instructor"),
  courseMediaUpload,
  requireFields("title", "description", "category", "price"),
  createCourse
);
router.patch("/:id", authenticate, authorize("admin", "instructor"), courseMediaUpload, updateCourse);
router.delete("/:id", authenticate, authorize("admin", "instructor"), deleteCourse);

export default router;
