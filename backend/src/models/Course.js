import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
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
      required: true,
      trim: true
    },
    syllabus: [{ title: String, description: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },
    language: {
      type: String,
      default: "English"
    },
    thumbnail: {
      url: String,
      publicId: String,
      resourceType: String
    },
    previewVideo: {
      url: String,
      publicId: String,
      resourceType: String
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },
    durationMinutes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", description: "text" });

export const Course = mongoose.model("Course", courseSchema);
