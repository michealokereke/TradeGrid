import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import appRouter from "../api/router.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { deserializeUser } from "../middlewares/auth.middleware.js";
import { ENV } from "./env.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ENV.FRONTEND_URL, // Frontend URL
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(deserializeUser);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api", appRouter);
app.use(errorHandler);

export default app;
