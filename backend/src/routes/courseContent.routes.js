import express from "express";
import {
  createCourseContent,
  deleteCourseContent,
  getCourseContentById,
  getCourseContents,
  updateCourseContent
} from "../controllers/courseContent.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { requireFields } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", authenticate, getCourseContents);
router.get("/:id", authenticate, getCourseContentById);
router.post(
  "/",
  authenticate,
  authorize("admin", "instructor"),
  upload.single("media"),
  requireFields("course", "title", "type"),
  createCourseContent
);
router.patch("/:id", authenticate, authorize("admin", "instructor"), upload.single("media"), updateCourseContent);
router.delete("/:id", authenticate, authorize("admin", "instructor"), deleteCourseContent);

export default router;
