import { z } from "zod";

/**
 * Standardized validation result interface
 * @template T - The type of the validated data
 */
export interface ValidationResult<T> {
  /** Whether the validation was successful */
  success: boolean;
  /** The validated data (only present if success is true) */
  data?: T;
  /** Validation errors (only present if success is false) */
  errors?: Record<string, string[]>;
}

/**
 * Generic Zod validator that returns a standardized response object
 *
 * @template T - The Zod schema shape type
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns A ValidationResult object with success status, data, or errors
 *
 * @example
 * ```typescript
 * const validation = validateWithZod(AuthSchemas.login, {
 *   username: formData.get("username"),
 *   password: formData.get("password"),
 * });
 *
 * if (!validation.success) {
 *   return { success: false, errors: validation.errors };
 * }
 *
 * const { username, password } = validation.data!;
 * ```
 */
export function validateWithZod<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  data: unknown
): ValidationResult<z.infer<typeof schema>> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  // errors: {
  //   username: validatedFields.error.issues
  //     .filter((issue) => issue.path.includes("username"))
  //     .map((issue) => issue.message),
  //   password: validatedFields.error.issues
  //     .filter((issue) => issue.path.includes("password"))
  //     .map((issue) => issue.message),
  // },

  return {
    success: false,
    errors: Object.fromEntries(
      Object.keys(result.error.format()).map((key) => [
        key,
        result.error.issues
          .filter((issue) => issue.path.includes(key))
          .map((issue) => issue.message),
      ])
    ),
  };
}
