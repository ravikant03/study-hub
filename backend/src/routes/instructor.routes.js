import express from "express";
import {
  createInstructor,
  deleteInstructor,
  getInstructorById,
  getInstructors,
  updateInstructor
} from "../controllers/instructor.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { requireFields } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", getInstructors);
router.get("/:id", getInstructorById);
router.post("/", authenticate, authorize("admin"), requireFields("user", "bio"), createInstructor);
router.patch("/:id", authenticate, authorize("admin"), updateInstructor);
router.delete("/:id", authenticate, authorize("admin"), deleteInstructor);

export default router;
