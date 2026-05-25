import express from "express";
import {
  createUser,
  getUserById,
  getUsers,
  updateMe,
  updateUser,
  updateUserRole
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { requireFields } from "../middleware/validate.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/me", (req, res) => {
  res.json({ success: true, data: req.user });
});
router.patch("/me", upload.single("avatar"), updateMe);

router.post("/", authorize("admin"), upload.single("avatar"), requireFields("name", "email", "password", "role"), createUser);
router.get("/", authorize("admin"), getUsers);
router.get("/:id", authorize("admin"), getUserById);
router.patch("/:id", authorize("admin"), upload.single("avatar"), updateUser);
router.patch("/:id/role", authorize("admin"), requireFields("role"), updateUserRole);

export default router;
