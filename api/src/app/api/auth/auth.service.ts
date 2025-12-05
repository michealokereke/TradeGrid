import prisma from "../../config/pridmaDB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import type {
  RegisterTenantInput,
  LoginInput,
  InviteUserInput,
  AcceptInviteInput,
} from "./auth.schema.js";
import { UserRole } from "../../../generated/enums.js";
import type { AuthResponse, RefreshTknPayload, UserPayload } from "./types.js";
import type { Prisma } from "../../../generated/client.js";
import { jwtUtil } from "../../utils/jwt.util.js";
import { buildRefreshTokenDetails } from "./utils.js";
import { hashUtil } from "../../utils/hash.util.js";
import { AppError } from "../../config/appError.js";
import { luxonUtils } from "../../utils/luxon.util.js";

export const registerTenant = async (
  input: RegisterTenantInput
): Promise<AuthResponse> => {
  const { companyName, slug, adminName, email, password } = input;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new AppError(409, "already in use");

  const existingTenant = await prisma.tenant.findUnique({ where: { slug } });
  if (existingTenant) throw new AppError(400, "Slug already taken");

  const hashedPassword = await bcrypt.hash(password, 10);
  const { tkn, hashedTkn, expiresAt } = buildRefreshTokenDetails();

  const result = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: companyName,
        slug,
      },
    });

    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        name: adminName,
        role: UserRole.ADMIN,
        tenantId: tenant.id,
      },
    });

    const refresh_token = await tx.refreshToken.create({
      data: {
        hashedTkn,
        expiresAt: expiresAt.toJSDate(),
        userId: user.id,
      },
    });

    return { tenant, user };
  });

  const access_token = jwtUtil.signAccessToken({
    userId: result.user.id,
    tenantId: result.tenant.id,
    role: result.user.role,
  });

  const refresh_token = jwtUtil.signRefreshToken({
    tkn,
    userId: result.user.id,
  });

  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      tenantId: result.user.tenantId,
    },
    access_token,
    refresh_token,
  };
};

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const { email, password } = input;

  const { tkn, hashedTkn, expiresAt } = buildRefreshTokenDetails();

  const { user } = await prisma.$transaction(async (tx) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError(400, "Invalid credentials");

    const isMatch = await hashUtil.comparePassword(password, user.password);
    if (!isMatch) throw new AppError(400, "Invalid credentials");

    const refresh_token = await tx.refreshToken.create({
      data: {
        hashedTkn,
        expiresAt: expiresAt.toJSDate(),
        userId: user.id,
      },
    });

    return { user };
  });

  const access_token = jwtUtil.signAccessToken({
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
  });

  const refresh_token = jwtUtil.signRefreshToken({
    tkn,
    userId: user.id,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
    },
    access_token,
    refresh_token,
  };
};

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
export const logout = async (refresh_token_payload: RefreshTknPayload) => {
  const hashedTkn = hashUtil.hashToken(refresh_token_payload.tkn);

  const refresh_token = await prisma.refreshToken.update({
    where: {
      hashedTkn,
      userId: refresh_token_payload.userId,
    },
    data: {
      expiresAt: luxonUtils.now().toJSDate(),
      revoked: true,
    },
  });
};

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

export const inviteUser = async (input: InviteUserInput, tenantId: string) => {
  const { email, role } = input;

  // Check if user already exists (globally for now, or per tenant?)
  // Requirement: "Check if user already exists in system"
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

  const invitation = await prisma.invitation.create({
    data: {
      email,
      role,
      token,
      expiresAt,
      tenantId,
    },
  });

  // Mock Email - return link
  const link = `http://localhost:3000/join?token=${token}`;
  return { link, invitation };
};

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

export const verifyInvite = async (token: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { tenant: true },
  });

  if (!invitation) throw new Error("Invalid token");
  if (invitation.expiresAt < new Date()) throw new Error("Token expired");

  return {
    email: invitation.email,
    tenantName: invitation.tenant.name,
    role: invitation.role,
  };
};

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

// export const acceptInvite = async (
//   input: AcceptInviteInput
// ): Promise<AuthResponse> => {
//   const { token, name, password } = input;

//   const invitation = await prisma.invitation.findUnique({
//     where: { token },
//   });

//   if (!invitation) throw new Error("Invalid token");
//   if (invitation.expiresAt < new Date()) throw new Error("Token expired");

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const result = await prisma.$transaction(
//     async (tx: Prisma.TransactionClient) => {
//       const user = await tx.user.create({
//         data: {
//           email: invitation.email,
//           password: hashedPassword,
//           name,
//           role: invitation.role,
//           tenantId: invitation.tenantId,
//         },
//       });

//       await tx.invitation.delete({ where: { id: invitation.id } });

//       return user;
//     }
//   );

//   const jwtToken = jwt.sign(
//     { userId: result.id, tenantId: result.tenantId, role: result.role },
//     JWT_SECRET,
//     { expiresIn: JWT_EXPIRES_IN }
//   );

//   return {
//     user: {
//       id: result.id,
//       email: result.email,
//       name: result.name,
//       role: result.role,
//       tenantId: result.tenantId,
//     },
//     token: jwtToken,
//   };
// };
