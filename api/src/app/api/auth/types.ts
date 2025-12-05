import { UserRole } from "../../../generated/enums.js";

export interface UserPayload {
  userId: string;
  tenantId: string;
  role: UserRole;
}

export interface RefreshTknPayload {
  tkn: string;
  userId: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    tenantId: string;
  };
  access_token: string;
  refresh_token: string; // Optional because we might use cookies
}
