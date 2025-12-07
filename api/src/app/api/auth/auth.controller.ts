import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.js";
import {
  registerTenantSchema,
  loginSchema,
  inviteUserSchema,
  acceptInviteSchema,
} from "./auth.schema.js";
import { clearAuthCookies, setAuthCookies } from "../../utils/cookie.util.js";
import { success } from "../../utils/response.util.js";
import type { AuthReq } from "../../middlewares/auth.middleware.js";
import { AppError } from "../../config/appError.js";

export const registerTenantHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const input = req.body;
  const { user, access_token, refresh_token } =
    await authService.registerTenant(input);

  if (!access_token || !refresh_token)
    throw new AppError(500, "access and refresh token is missing");
  setAuthCookies(res, { access_token, refresh_token });
  return success(res, user, "success", 201);
};

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const input = req.body;
  const { user, access_token, refresh_token } = await authService.login(input);

  if (!access_token || !refresh_token)
    throw new AppError(500, "access and refresh token is missing");
  setAuthCookies(res, { access_token, refresh_token });
  return success(res, user, "success", 200);
};

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

export const logoutHandler = async (req: AuthReq, res: Response) => {
  const refresh_token = req.refresh_token_payload;

  if (refresh_token) {
    try {
      await authService.logout(refresh_token);
    } catch (error) {}
  }

  clearAuthCookies(res);

  return success(res, null, "Logged out successfully", 200);
};

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

export const refreshHandler = async (req: AuthReq, res: Response) => {
  const refresh_token_payload = req.refresh_token_payload;

  if (!refresh_token_payload) {
    res.status(401).json({ message: "Refresh token missing" });
    return;
  }

  const { user, access_token, refresh_token } =
    await authService.refreshAccessToken(refresh_token_payload);

  if (!access_token || !refresh_token)
    throw new AppError(500, "access and refresh token is missing");
  setAuthCookies(res, { access_token, refresh_token });
  return success(res, user, "Token refreshed successfully", 200);
};

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

export const getMeHandler = async (req: AuthReq, res: Response) => {
  const { user } = req;

  const result = await authService.getMe(user);

  return success(res, result.user, "User gotten successfully");
};

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

export const inviteUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const input = req.body;
  const result = await authService.inviteUser(input, user.tenantId);
  res.status(201).json(result);
};

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

export const verifyInviteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;
  if (!token) {
    res.status(400).json({ message: "Token is required" });
    return;
  }
  const result = await authService.verifyInvite(token);
  res.status(200).json(result);
};

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

export const acceptInviteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const input = acceptInviteSchema.parse(req.body);
  //   const { user, token } = await authService.acceptInvite(input);

  //   res.cookie(COOKIE_NAME, token, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "lax",
  //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  //   });

  res.status(200).json({ user: "" });
};
