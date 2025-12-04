import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import appRouter from "../api/router.js";
import { errorHandler } from "../middlewares/error.middleware.js";

// import authRoutes from "./routes/auth.routes";
// import userRoutes from "./routes/user.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
