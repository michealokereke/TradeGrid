import { hashUtil } from "../../utils/hash.util.js";
import { luxonUtils } from "../../utils/luxon.util.js";

export const buildRefreshTokenDetails = () => {
  const tkn = hashUtil.generateToken();
  const hashedTkn = hashUtil.hashToken(tkn);
  const expiresAt = luxonUtils.addDaysToNow(7);

  return { tkn, hashedTkn, expiresAt };
};
