import bcrypt from "bcryptjs";
import crypto from "crypto";

export const hashUtil = {
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  },
  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },
  hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  },
};
