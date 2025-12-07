import { Router } from "express";
import * as authController from "./auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";
import {
  requireAdmin,
  requireRefreshToken,
  requireUser,
} from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  registerTenantSchema,
  loginSchema,
  inviteUserSchema,
  acceptInviteSchema,
} from "./auth.schema.js";

const router = Router();

// Public Routes
router.post(
  "/register-tenant",
  validate(registerTenantSchema),
  asyncHandler(authController.registerTenantHandler)
);
router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(authController.loginHandler)
);
router.post(
  "/logout",
  requireRefreshToken,
  asyncHandler(authController.logoutHandler)
);

router.post(
  "/refresh",
  requireRefreshToken,
  asyncHandler(authController.refreshHandler)
);

router.get(
  "/verify-invite/:token",
  asyncHandler(authController.verifyInviteHandler)
);
router.post(
  "/accept-invite",
  validate(acceptInviteSchema),
  asyncHandler(authController.acceptInviteHandler)
);

// Protected Routes
router.get("/me", requireUser, asyncHandler(authController.getMeHandler));
router.post(
  "/invite",
  requireUser,
  requireAdmin,
  validate(inviteUserSchema),
  asyncHandler(authController.inviteUserHandler)
);

export default router;
