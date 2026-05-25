import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 80
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    image: {
      url: String,
      publicId: String,
      resourceType: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
