import { AppError } from "../utils/AppError.js";

export const requireFields =
  (...fields) =>
  (req, res, next) => {
    const missing = fields.filter((field) => req.body[field] === undefined || req.body[field] === "");
    if (missing.length > 0) {
      throw new AppError(`Missing required fields: ${missing.join(", ")}`, 400);
    }
    next();
  };
