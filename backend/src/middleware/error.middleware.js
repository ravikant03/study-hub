import { AppError } from "../utils/AppError.js";

export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : "Internal server error";
  let details = err.details || undefined;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(err.errors).map((item) => item.message);
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate resource";
    details = Object.keys(err.keyValue || {});
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired authentication token";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};
