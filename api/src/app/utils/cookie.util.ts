import type { CookieOptions } from "express";
import { ENV } from "../core/env.js";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

export function buildAccessCookie(value: string) {
  return {
    name: "access_token",
    value,
    options: {
      ...baseCookieOptions,
      maxAge: 15 * 60 * 1000, // 15 mins
    } as CookieOptions,
  };
}

export function buildRefreshCookie(value: string) {
  return {
    name: "refresh_token",
    value,
    options: {
      ...baseCookieOptions,
      maxAge: ENV.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    } as CookieOptions,
  };
}

export function clearAuthCookies() {
  return [
    {
      name: "access_token",
      options: { ...baseCookieOptions, expires: new Date(0) },
    },
    {
      name: "refresh_token",
      options: { ...baseCookieOptions, expires: new Date(0) },
    },
  ];
}
