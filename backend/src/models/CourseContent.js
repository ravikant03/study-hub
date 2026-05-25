import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
    resourceType: {
      type: String,
      enum: ["image", "video", "raw", "auto"]
    },
    format: String,
    bytes: Number
  },
  { _id: false }
);

const courseContentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    description: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ["video", "pdf", "image", "text", "quiz", "assignment"],
      required: true
    },
    order: {
      type: Number,
      default: 0
    },
    body: String,
    media: mediaSchema,
    isPreview: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

courseContentSchema.index({ course: 1, order: 1 });

export const CourseContent = mongoose.model("CourseContent", courseContentSchema);
