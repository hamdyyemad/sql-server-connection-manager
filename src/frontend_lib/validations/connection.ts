import { z } from 'zod';

// Connection form validation schema
export const ConnectionFormSchema = z.object({
  server: z.string().min(1, "Server name is required").refine(val => val.trim().length > 0, {
    message: "Server name cannot be empty or just whitespace"
  }),
  user: z.string().optional(),
  password: z.string().optional(),
  authenticationType: z.enum(["windows", "sql"]),
  connectionType: z.enum(["local", "remote"]),
});

// Local instance validation schema
export const LocalInstanceSchema = z.object({
  connectionString: z.string(),
  serverName: z.string(),
  instanceName: z.string().optional(),
  edition: z.string().optional(),
  version: z.string().optional(),
});

// User management validation schemas
export const UserRoleUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  roleId: z.string().min(1, "Role ID is required"),
  action: z.enum(["add", "remove"]),
});

export const MultipleUserRoleUpdateSchema = z.object({
  updates: z.array(UserRoleUpdateSchema).min(1, "At least one update is required"),
});

export const PasswordUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

// Database query validation schemas
export const DatabaseQuerySchema = z.object({
  database: z.string().min(1, "Database name is required"),
  table: z.string().optional(),
  limit: z.number().min(1).max(1000).optional(),
  offset: z.number().min(0).optional(),
});

// Export types
export type ConnectionFormData = z.infer<typeof ConnectionFormSchema>;
export type LocalInstanceInfo = z.infer<typeof LocalInstanceSchema>;
export type UserRoleUpdate = z.infer<typeof UserRoleUpdateSchema>;
export type MultipleUserRoleUpdate = z.infer<typeof MultipleUserRoleUpdateSchema>;
export type PasswordUpdate = z.infer<typeof PasswordUpdateSchema>;
export type DatabaseQuery = z.infer<typeof DatabaseQuerySchema>; 