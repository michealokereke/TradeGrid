import type { SignOptions, JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

const sign = (payload: object, expiresIn: string | number): string => {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, ENV.JWT_SECRET as jwt.Secret, options);
};

const verify = (token: string): string | JwtPayload => {
  return jwt.verify(token, ENV.JWT_SECRET as jwt.Secret);
};

export const jwtUtil = {
  signAccessToken(payload: object) {
    return sign(payload, `${ENV.ACCESS_TOKEN_EXPIRES_IN || 15}d`);
  },

  signRefreshToken(payload: object) {
    return sign(payload, `${ENV.REFRESH_TOKEN_EXPIRES_DAYS || 7}d`);
  },

  verifyToken(token: string) {
    return verify(token);
  },
};
