export interface User {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  tenantName: string;
  role: "TECH" | "DISPATCHER" | "ADMIN";
  slug: string;
}
