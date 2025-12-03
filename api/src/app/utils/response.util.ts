import type { Response } from "express";

export function success(
  res: Response,
  data: unknown = null,
  message = "OK",
  status = 200
) {
  return res.status(status).json({ success: true, message, data });
}
