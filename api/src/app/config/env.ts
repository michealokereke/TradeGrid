export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET!,
  ACCESS_COOKIE_NAME:
    process.env.ACCESS_COOKIE_NAME || "tradegrid_access_token",
  REFRESH_COOKIE_NAME:
    process.env.REFRESH_COOKIE_NAME || "tradegrid_refresh_token",
  ACCESS_TOKEN_EXPIRES_IN: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) || 15,
  REFRESH_TOKEN_EXPIRES_DAYS: Number(
    process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7
  ),
};
