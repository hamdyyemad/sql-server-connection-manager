import { z } from "zod";

/**
 * Authentication validation schemas
 */
export const AuthSchemas = {
  login: z.object({
    username: z
      .string()
      .min(5, "Username is at least 5 characters")
      .max(50, "Username too long"),
    password: z
      .string()
      .min(5, "Password is at least 5 characters")
      .max(128, "Password too long"),
  }),

  setup2FA: z.object({
    userId: z.string().uuid("Invalid user ID format"),
  }),

  verify2FA: z.object({
    userId: z.string().uuid("Invalid user ID format"),
    verificationCode: z
      .string()
      .regex(/^\d{6}$/, "Verification code must be 6 digits"),
  }),

  check2FAStatus: z.object({
    userId: z.string().uuid("Invalid user ID format"),
  }),
} as const;

/**
 * Type definitions for auth schemas
 */
export type AuthSchemaKeys = keyof typeof AuthSchemas;

/**
 * Type definitions for validated auth data
 */
export type LoginData = z.infer<typeof AuthSchemas.login>;
export type Setup2FAData = z.infer<typeof AuthSchemas.setup2FA>;
export type Verify2FAData = z.infer<typeof AuthSchemas.verify2FA>;
export type Check2FAStatusData = z.infer<typeof AuthSchemas.check2FAStatus>;
