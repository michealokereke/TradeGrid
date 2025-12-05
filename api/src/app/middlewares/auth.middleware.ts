import type { Request, Response, NextFunction } from "express";
import { jwtUtil } from "../utils/jwt.util.js";
import { AppError } from "../config/appError.js";

export interface AuthUser extends Request {
  user?: {
    sub: string;
    email: string;
    role?: string;
  };
}

export function requireAut(req: AuthUser, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.tradeGrid_access_token;
    if (!token) {
      throw new AppError(401, "Not authenticated");
    }

    const payload = jwtUtil.verifyToken(token) as {
      sub: string;
      email: string;
      role?: string;
    };

    req.user = payload;
    next();
  } catch (err) {
    next(new AppError(401, "Invalid or expired session"));
  }
}
