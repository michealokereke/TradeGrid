import bcrypt from "bcryptjs";
import crypto from "crypto";

export const hashUtil = {
  async hashPassword(password: string, saltRounds?: number) {
    const salt = await bcrypt.genSalt(saltRounds || 12);
    return bcrypt.hash(password, salt);
  },
  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },
  hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  },
  generateToken() {
    return crypto.randomBytes(32).toString("hex");
  },
};
