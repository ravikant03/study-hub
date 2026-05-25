import multer from "multer";
import { AppError } from "../utils/AppError.js";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "video/mp4",
  "video/webm",
  "video/quicktime"
];

export const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new AppError("Only images, PDFs, and videos are allowed", 400));
    }
    cb(null, true);
  }
});
