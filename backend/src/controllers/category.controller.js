import { Category } from "../models/Category.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { slugify } from "../utils/slugify.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

export const createCategory = asyncHandler(async (req, res) => {
  const image = await uploadToCloudinary(req.file, "studyhub/categories");
  const category = await Category.create({
    ...req.body,
    slug: req.body.slug || slugify(req.body.name),
    image
  });

  res.status(201).json({ success: true, data: category });
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort("name");
  res.json({ success: true, count: categories.length, data: categories });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError("Category not found", 404);
  res.json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (req.body.name && !req.body.slug) updates.slug = slugify(req.body.name);
  if (req.file) updates.image = await uploadToCloudinary(req.file, "studyhub/categories");

  const category = await Category.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  if (!category) throw new AppError("Category not found", 404);
  res.json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new AppError("Category not found", 404);
  res.json({ success: true, message: "Category deleted" });
});
