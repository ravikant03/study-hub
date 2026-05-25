import express from "express";
import {
  enrollInCourse,
  deleteEnrollment,
  getCourseEnrollments,
  getAllEnrollments,
  getUserEnrollments,
  updateEnrollmentStatus
} from "../controllers/enrollment.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { requireFields } from "../middleware/validate.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorize("admin"), getAllEnrollments);
router.post("/", authorize("student", "admin"), requireFields("courseId"), enrollInCourse);
router.get("/me", getUserEnrollments);
router.get("/user/:userId", getUserEnrollments);
router.get("/course/:courseId", authorize("admin", "instructor"), getCourseEnrollments);
router.patch("/:id", authorize("admin", "instructor"), updateEnrollmentStatus);
router.patch("/:id/status", authorize("admin", "instructor"), updateEnrollmentStatus);
router.delete("/:id", authorize("admin", "instructor"), deleteEnrollment);

export default router;
