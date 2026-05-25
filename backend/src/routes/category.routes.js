import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory
} from "../controllers/category.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { requireFields } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", authenticate, authorize("admin"), upload.single("image"), requireFields("name"), createCategory);
router.patch("/:id", authenticate, authorize("admin"), upload.single("image"), updateCategory);
router.delete("/:id", authenticate, authorize("admin"), deleteCategory);

export default router;
