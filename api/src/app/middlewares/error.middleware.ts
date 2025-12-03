import type { Request, Response, NextFunction } from "express";
import { AppError } from "../core/appError.js";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  const status = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
