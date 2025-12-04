import type { CookieOptions, Response } from "express";
import { ENV } from "../config/env.js";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

export function buildAccessCookieDetails(value: string) {
  return {
    name: "access_token",
    value,
    options: {
      ...baseCookieOptions,
      maxAge: ENV.ACCESS_TOKEN_EXPIRES_IN * 60 * 1000, // 15 mins
    } as CookieOptions,
  };
}

export function buildRefreshCookieDetails(value: string) {
  return {
    name: "refresh_token",
    value,
    options: {
      ...baseCookieOptions,
      maxAge: ENV.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    } as CookieOptions,
  };
}

const setCookie = (
  res: Response,
  {
    name,
    value,
    options,
  }: { name: string; value: string; options: CookieOptions }
) => {
  res.cookie(name, value, options);
};

export const setAuthCookies = (
  res: Response,
  {
    access_token,
    refresh_token,
  }: { access_token: string; refresh_token: string }
) => {
  const accessCookieDetails = buildAccessCookieDetails(access_token);
  const refreshCookieDetails = buildRefreshCookieDetails(refresh_token);

  setCookie(res, accessCookieDetails);
  setCookie(res, refreshCookieDetails);
};

export function clearAuthCookies(res: Response) {
  [
    {
      name: "access_token",
      options: { ...baseCookieOptions, expires: new Date(0) },
    },
    {
      name: "refresh_token",
      options: { ...baseCookieOptions, expires: new Date(0) },
    },
  ].forEach((detail) => {
    res.clearCookie(detail.name, detail.options);
  });
}
