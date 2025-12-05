import { Router } from "express";
import authRoutes from "./auth/auth.route.js";

const appRouter = Router();

appRouter.use("/auth", authRoutes);

export default appRouter;
