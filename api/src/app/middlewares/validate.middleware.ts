import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors || err,
      });
    }
  };
