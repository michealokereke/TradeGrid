import type { Request, Response, NextFunction } from "express";
import { UserRole } from "../../generated/enums.js";
import type { RefreshTknPayload, UserPayload } from "../api/auth/types.js";
import { jwtUtil } from "../utils/jwt.util.js";
import { ENV } from "../config/env.js";

export interface AuthReq extends Request {
  user?: UserPayload;
  refresh_token_payload?: RefreshTknPayload;
}

export const deserializeUser = (
  req: AuthReq,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies[ENV.ACCESS_COOKIE_NAME];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwtUtil.verifyToken(token) as UserPayload;
    req.user = decoded;
  } catch (error) {}

  next();
};

export const requireUser = (
  req: AuthReq,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

export const requireAdmin = (
  req: AuthReq,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user || user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

export const requireRefreshToken = (
  req: AuthReq,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies[ENV.REFRESH_COOKIE_NAME];

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    const decoded = jwtUtil.verifyToken(refreshToken) as RefreshTknPayload;
    req.refresh_token_payload = decoded;
  } catch (error) {}

  next();
};
