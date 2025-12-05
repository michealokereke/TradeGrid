import { Router } from "express";
import * as authController from "./auth.controller.js";
import {
  requireUser,
  requireAdmin,
} from "../../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";

const router = Router();

// Public Routes
router.post(
  "/register-tenant",
  asyncHandler(authController.registerTenantHandler)
);
router.post("/login", asyncHandler(authController.loginHandler));
router.post("/logout", asyncHandler(authController.logoutHandler));
router.get(
  "/verify-invite/:token",
  asyncHandler(authController.verifyInviteHandler)
);
router.post("/accept-invite", asyncHandler(authController.acceptInviteHandler));

// Protected Routes
router.get("/me", requireUser, asyncHandler(authController.getMeHandler));
router.post(
  "/invite",
  requireUser,
  requireAdmin,
  asyncHandler(authController.inviteUserHandler)
);

export default router;
