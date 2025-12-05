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
import type { AuthReq } from "../../../middleware/auth.middleware.js";

export const registerTenantHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const input = registerTenantSchema.parse(req.body);
  const { user, access_token, refresh_token } =
    await authService.registerTenant(input);

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
  const input = loginSchema.parse(req.body);
  const { user, access_token, refresh_token } = await authService.login(input);

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

export const getMeHandler = (req: Request, res: Response) => {
  // req.user is attached by middleware
  const user = (req as any).user;
  res.status(200).json({ user });
};

export const inviteUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const input = inviteUserSchema.parse(req.body);
  const result = await authService.inviteUser(input, user.tenantId);
  res.status(201).json(result);
};

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
