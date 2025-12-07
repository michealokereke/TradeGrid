import { z } from "zod";

export const generateSlug = (companyName: string): string => {
  return companyName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
};

/////////////////////////////
/////////////////////////////
/////////////////////////////

export const registerTenantSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  slug: z
    .string()
    .min(3, "URL slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  adminName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character (!@#$%^&*)"
    ),
});

/////////////////////////////
/////////////////////////////
/////////////////////////////

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

/////////////////////////////
/////////////////////////////
/////////////////////////////

export const acceptInviteSchema = z
  .object({
    token: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(
        /[!@#$%^&*]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/////////////////////////////
/////////////////////////////
/////////////////////////////

export type RegisterTenantInput = z.infer<typeof registerTenantSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
