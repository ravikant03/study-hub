import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    bio: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000
    },
    expertise: [{ type: String, trim: true }],
    qualifications: [{ type: String, trim: true }],
    socialLinks: {
      website: String,
      linkedin: String,
      twitter: String,
      youtube: String
    },
    isApproved: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Instructor = mongoose.model("Instructor", instructorSchema);
