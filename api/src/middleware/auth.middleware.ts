import type { Request, Response, NextFunction } from "express";
import { UserRole } from "../generated/enums.js";
import type { RefreshTknPayload, UserPayload } from "../app/api/auth/types.js";
import { jwtUtil } from "../app/utils/jwt.util.js";

export interface AuthReq extends Request {
  user?: UserPayload;
  refresh_token_payload?: RefreshTknPayload;
}

export const deserializeUser = (
  req: AuthReq,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

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
