export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET!,
  ACCESS_TOKEN_EXPIRES_IN: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) || 15,
  REFRESH_TOKEN_EXPIRES_DAYS: Number(
    process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7
  ),
};
