import { NextRequest } from "next/server";
import { z } from "zod";

// SQL Injection Prevention Middleware
export interface SQLInjectionPreventionConfig {
  maxQueryLength?: number;
  allowedCharacters?: RegExp;
  blockKeywords?: string[];
}

export class SQLInjectionPrevention {
  private config: Required<SQLInjectionPreventionConfig>;

  constructor(config: SQLInjectionPreventionConfig = {}) {
    this.config = {
      maxQueryLength: config.maxQueryLength || 10000,
      allowedCharacters:
        config.allowedCharacters ||
        /^[a-zA-Z0-9\s\-_\.\[\]\(\)\{\}\+\-\*\/\=\<\>\&\|\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\|\\\:\;\"\'\,\.\<\>\?\/\s]+$/,
      blockKeywords: config.blockKeywords || [
        "DROP",
        "DELETE",
        "TRUNCATE",
        "ALTER",
        "CREATE",
        "EXEC",
        "EXECUTE",
        "INSERT",
        "UPDATE",
        "MERGE",
        "BULK",
        "OPENROWSET",
        "OPENDATASOURCE",
        "sp_",
        "xp_",
        "--",
        "/*",
        "*/",
        "WAITFOR",
        "DELAY",
        "BENCHMARK",
        "UNION",
        "SELECT INTO",
        "OUTFILE",
        "DUMPFILE",
        "LOAD_FILE",
      ],
    };
  }

  // Validate and sanitize input
  validateInput(
    input: string,
    fieldName: string
  ): { isValid: boolean; sanitized?: string; error?: string } {
    if (!input || typeof input !== "string") {
      return {
        isValid: false,
        error: `${fieldName} must be a non-empty string`,
      };
    }

    // Check length
    if (input.length > this.config.maxQueryLength) {
      return {
        isValid: false,
        error: `${fieldName} is too long (max ${this.config.maxQueryLength} characters)`,
      };
    }

    // Check for SQL injection keywords
    const upperInput = input.toUpperCase();
    for (const keyword of this.config.blockKeywords) {
      if (upperInput.includes(keyword)) {
        return {
          isValid: false,
          error: `${fieldName} contains forbidden SQL keyword: ${keyword}`,
        };
      }
    }

    // Check for allowed characters
    if (!this.config.allowedCharacters.test(input)) {
      return {
        isValid: false,
        error: `${fieldName} contains invalid characters`,
      };
    }

    // Additional SQL injection patterns
    const sqlInjectionPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|declare|cast|convert)\b)/i,
      /(--|\/\*|\*\/|xp_|sp_)/i,
      /(waitfor|delay|benchmark)/i,
      /(outfile|dumpfile|load_file)/i,
      /(union\s+select|select\s+into)/i,
    ];

    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(input)) {
        return {
          isValid: false,
          error: `${fieldName} contains suspicious SQL patterns`,
        };
      }
    }

    return { isValid: true, sanitized: input.trim() };
  }

  // Validate database and table names specifically
  validateIdentifier(
    identifier: string,
    type: "database" | "table" | "column"
  ): { isValid: boolean; sanitized?: string; error?: string } {
    if (!identifier || typeof identifier !== "string") {
      return {
        isValid: false,
        error: `${type} name must be a non-empty string`,
      };
    }

    // Database/table names should only contain letters, numbers, underscores, and dots
    const identifierPattern = /^[a-zA-Z_][a-zA-Z0-9_\.]*$/;
    if (!identifierPattern.test(identifier)) {
      return {
        isValid: false,
        error: `${type} name contains invalid characters`,
      };
    }

    // Check for SQL keywords
    const sqlKeywords = [
      "SELECT",
      "FROM",
      "WHERE",
      "INSERT",
      "UPDATE",
      "DELETE",
      "DROP",
      "CREATE",
      "ALTER",
      "TABLE",
      "DATABASE",
      "INDEX",
      "VIEW",
      "PROCEDURE",
      "FUNCTION",
      "TRIGGER",
      "CONSTRAINT",
      "PRIMARY",
      "FOREIGN",
      "KEY",
      "UNIQUE",
      "CHECK",
      "DEFAULT",
      "NULL",
      "NOT",
      "AND",
      "OR",
      "IN",
      "EXISTS",
      "BETWEEN",
      "LIKE",
      "ORDER",
      "GROUP",
      "BY",
      "HAVING",
      "UNION",
      "JOIN",
      "LEFT",
      "RIGHT",
      "INNER",
      "OUTER",
      "CROSS",
      "FULL",
      "ON",
      "AS",
      "DISTINCT",
      "TOP",
      "OFFSET",
      "FETCH",
    ];

    const upperIdentifier = identifier.toUpperCase();
    for (const keyword of sqlKeywords) {
      if (upperIdentifier === keyword) {
        return {
          isValid: false,
          error: `${type} name cannot be a SQL keyword: ${keyword}`,
        };
      }
    }

    return { isValid: true, sanitized: identifier.trim() };
  }

  // Validate pagination parameters
  validatePagination(
    page: unknown,
    limit: unknown
  ): {
    isValid: boolean;
    sanitized?: { page: number; limit: number };
    error?: string;
  } {
    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);

    if (isNaN(pageNum) || pageNum < 1) {
      return { isValid: false, error: "Page must be a positive integer" };
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 1000) {
      return { isValid: false, error: "Limit must be between 1 and 1000" };
    }

    return { isValid: true, sanitized: { page: pageNum, limit: limitNum } };
  }

  // Validate sort parameters
  validateSort(
    sortColumn: string,
    sortDirection: string,
    allowedColumns: string[]
  ): {
    isValid: boolean;
    sanitized?: { column: string; direction: string };
    error?: string;
  } {
    if (!sortColumn || typeof sortColumn !== "string") {
      return {
        isValid: false,
        error: "Sort column must be a non-empty string",
      };
    }

    if (!allowedColumns.includes(sortColumn)) {
      return { isValid: false, error: `Invalid sort column: ${sortColumn}` };
    }

    const direction = sortDirection.toUpperCase();
    if (direction !== "ASC" && direction !== "DESC") {
      return { isValid: false, error: "Sort direction must be ASC or DESC" };
    }

    return { isValid: true, sanitized: { column: sortColumn, direction } };
  }
}

// Parameter binding utilities
export class ParameterBinder {
  private parameters: Map<string, { value: unknown; type?: string }> =
    new Map();
  private paramCounter = 0;

  // Add a parameter and return the parameter name
  addParameter(value: unknown, type?: string): string {
    const paramName = `@param${++this.paramCounter}`;
    this.parameters.set(paramName, { value, type });
    return paramName;
  }

  // Get all parameters for the request
  getParameters(): Record<string, unknown> {
    const params: Record<string, unknown> = {};
    for (const [name, { value, type }] of this.parameters) {
      if (type) {
        params[name] = { value, type };
      } else {
        params[name] = value;
      }
    }
    return params;
  }

  // Clear all parameters
  clear(): void {
    this.parameters.clear();
    this.paramCounter = 0;
  }

  // Build a safe query with parameters
  buildQuery(
    template: string,
    params: Record<string, unknown>
  ): { query: string; parameters: Record<string, unknown> } {
    let query = template;
    const queryParams: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(params)) {
      const paramName = this.addParameter(value);
      query = query.replace(new RegExp(`\\$\\{${key}\\}`, "g"), paramName);
      queryParams[paramName] = value;
    }

    return { query, parameters: queryParams };
  }
}

// Validation schemas for common request bodies
export const DatabaseRequestSchema = z.object({
  database: z.string().min(1, "Database name is required"),
  table: z.string().optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(1000).optional().default(10),
  search: z.string().optional().default(""),
  sortColumn: z.string().optional().default("Id"),
  sortDirection: z.enum(["ASC", "DESC"]).optional().default("ASC"),
});

export const UserRoleRequestSchema = z.object({
  database: z.string().min(1, "Database name is required"),
  userId: z.string().min(1, "User ID is required"),
  newRoleId: z.string().min(1, "New role ID is required"),
});

export const MultipleUserRolesRequestSchema = z.object({
  database: z.string().min(1, "Database name is required"),
  updates: z
    .array(
      z.object({
        userId: z.string().min(1, "User ID is required"),
        newRoleId: z.string().min(1, "New role ID is required"),
      })
    )
    .min(1, "At least one update is required"),
});

export const PasswordRequestSchema = z.object({
  database: z.string().min(1, "Database name is required"),
  userId: z.string().min(1, "User ID is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

// Middleware function to validate request body
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { isValid: boolean; data?: T; error?: string } {
  try {
    const validatedData = schema.parse(body);
    return { isValid: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError;
      const errorMessage = zodError.issues
        .map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      return { isValid: false, error: errorMessage };
    }
    return { isValid: false, error: "Invalid request body" };
  }
}

// Middleware to prevent SQL injection
export function withSQLInjectionPrevention(
  request: NextRequest,
  handler: (req: NextRequest, validatedBody: unknown) => Promise<unknown>,
  schema?: z.ZodSchema
) {
  return async (req: NextRequest) => {
    const sqlPrevention = new SQLInjectionPrevention();

    try {
      // Parse request body
      const bodyText = await req.text();
      if (!bodyText || bodyText.trim() === "") {
        return {
          success: false,
          error: "Request body is empty",
        };
      }

      let body: unknown;
      try {
        body = JSON.parse(bodyText);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (parseError) {
        return {
          success: false,
          error: "Invalid JSON format",
        };
      }

      // Step 1: Pre-validation - Check for authentication bypass attempts BEFORE schema validation
      const preValidation = validateRequestStructure(body, schema);
      if (!preValidation.isValid) {
        return {
          success: false,
          error: `Security violation: ${preValidation.error}`,
        };
      }

      // Step 2: SQL injection detection on raw body
      const injectionCheck = detectSQLInjectionInBody(body);
      if (injectionCheck.isMalicious) {
        // TODO: SECURITY ENHANCEMENT - Implement IP blocking and SQL injection reporting
        console.error("🚨 SQL INJECTION DETECTED:", {
          reason: injectionCheck.reason,
          field: injectionCheck.field,
          body: JSON.stringify(body),
          ip:
            req.headers.get("x-forwarded-for") ||
            req.headers.get("x-real-ip") ||
            "unknown",
        });

        console.log("🚨 BLOCKING REQUEST - No cookies will be set");

        return {
          success: false,
          error: `Security violation detected: ${injectionCheck.reason}`,
        };
      }

      // Step 3: Schema validation (if provided)
      if (schema) {
        const validation = validateRequestBody(schema, body);
        if (!validation.isValid) {
          return {
            success: false,
            error: `Validation failed: ${validation.error}`,
          };
        }
        (body as Record<string, unknown>).validatedData = validation.data;
      }

      // Step 4: Apply SQL injection prevention to all string fields in the body
      const sanitizedBody = await applySQLInjectionPrevention(
        sqlPrevention,
        body
      );

      // Call the handler with validated and sanitized data
      return await handler(req, sanitizedBody);
    } catch (error) {
      console.error("SQL Injection Prevention Error:", error);
      return {
        success: false,
        error: "Request validation failed",
      };
    }
  };
}

// Helper function to recursively apply SQL injection prevention to all string fields
async function applySQLInjectionPrevention(
  sqlPrevention: SQLInjectionPrevention,
  data: unknown
): Promise<unknown> {
  if (typeof data === "string") {
    const validation = sqlPrevention.validateInput(data, "field");
    if (!validation.isValid) {
      throw new Error(`SQL injection prevention failed: ${validation.error}`);
    }
    return validation.sanitized;
  }

  if (Array.isArray(data)) {
    return Promise.all(
      data.map((item) => applySQLInjectionPrevention(sqlPrevention, item))
    );
  }

  if (data && typeof data === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip special fields that don't need SQL injection prevention
      if (key === "validatedData" || key === "page" || key === "limit") {
        sanitized[key] = value;
        continue;
      }

      // Apply SQL injection prevention to string values
      if (typeof value === "string") {
        const validation = sqlPrevention.validateInput(value, key);
        if (!validation.isValid) {
          throw new Error(
            `SQL injection prevention failed for ${key}: ${validation.error}`
          );
        }
        sanitized[key] = validation.sanitized;
      } else {
        // Recursively apply to nested objects/arrays
        sanitized[key] = await applySQLInjectionPrevention(
          sqlPrevention,
          value
        );
      }
    }
    return sanitized;
  }

  return data;
}

// Generic SQL injection detection for any request body
function detectSQLInjectionInBody(body: unknown): {
  isMalicious: boolean;
  reason?: string;
  field?: string;
} {
  const sqlInjectionPatterns = [
    // Common SQL injection patterns
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|declare|cast|convert)\b)/i,
    /(--|\/\*|\*\/|xp_|sp_)/i,
    /(waitfor|delay|benchmark)/i,
    /(outfile|dumpfile|load_file)/i,
    /(union\s+select|select\s+into)/i,
    // Boolean-based injection patterns - more comprehensive
    /(\'|\")\s*(or|and)\s*(\d+)\s*=\s*\3/i,
    /(\'|\")\s*(or|and)\s*(\'|\")\s*=\s*\3/i,
    /(\'|\")\s*(or|and)\s*(\d+)\s*=\s*(\d+)/i,
    /(\'|\")\s*(or|and)\s*(\w+)\s*=\s*\3/i,
    /(\'|\")\s*(or|and)\s*(\d+)\s*=\s*(\d+)\s*--/i,
    /(\'|\")\s*(or|and)\s*(\d+)\s*=\s*(\d+)\s*#/i,
    /(\'|\")\s*(or|and)\s*(\d+)\s*=\s*(\d+)\s*\/\*/i,
    // Complex boolean patterns
    /(\'|\")\s*(or|and)\s*(\d+)\s*=\s*(\d+)\s*(or|and)/i,
    /(\'|\")\s*(or|and)\s*(\w+)\s*=\s*(\w+)\s*(or|and)/i,
    // Time-based injection patterns
    /(\'|\")\s*(or|and)\s*(\d+)\s*=\s*(\d+)\s*waitfor/i,
    /(\'|\")\s*(or|and)\s*(\d+)\s*=\s*(\d+)\s*delay/i,
    // Comment-based patterns
    /(\'|\")\s*(or|and)\s*(\d+)\s*=\s*(\d+)\s*--/i,
    /(\'|\")\s*(or|and)\s*(\d+)\s*=\s*(\d+)\s*#/i,
    /(\'|\")\s*(or|and)\s*(\d+)\s*=\s*(\d+)\s*\/\*/i,
    // Additional patterns for common SQL injection attempts
    /(\'|\")\s*(\d+)\s*=\s*(\d+)/i, // '1'='1
    /(\'|\")\s*(\w+)\s*=\s*(\w+)/i, // 'admin'='admin'
    /(\'|\")\s*(\d+)\s*=\s*(\d+)\s*(\'|\")/i, // '1'='1'
    /(\'|\")\s*(\w+)\s*=\s*(\w+)\s*(\'|\")/i, // 'admin'='admin'
    // Quote-based patterns
    /(\'|\")\s*(\d+)\s*=\s*(\d+)\s*(\'|\")/i,
    /(\'|\")\s*(\w+)\s*=\s*(\w+)\s*(\'|\")/i,
    // Simple equality patterns that are suspicious
    /^\s*(\'|\")\s*(\d+)\s*=\s*(\d+)\s*(\'|\")?\s*$/i, // '1'='1 or '1'='1'
    /^\s*(\'|\")\s*(\w+)\s*=\s*(\w+)\s*(\'|\")?\s*$/i, // 'admin'='admin'
    // Command injection patterns
    /[;&|`$(){}[\]]/, // Shell command separators
    /(ls|cat|rm|cp|mv|chmod|chown|wget|curl|nc|telnet|ssh|ftp)/i, // Common commands
    /(\.\.\/|\.\.\\)/, // Path traversal
    // Additional SQL patterns
    /(\'|\")\s*or\s*(\d+)\s*=\s*(\d+)/i,
    /(\'|\")\s*and\s*(\d+)\s*=\s*(\d+)/i,
    /(\'|\")\s*or\s*(\w+)\s*=\s*(\w+)/i,
    /(\'|\")\s*and\s*(\w+)\s*=\s*(\w+)/i,
    // XSS patterns (basic)
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
    /javascript:/i,
    /on\w+\s*=/i,
  ];

  // Recursively check all string fields in the body
  function checkField(
    value: unknown,
    fieldPath: string = ""
  ): { isMalicious: boolean; reason?: string; field?: string } {
    if (typeof value === "string") {
      // Additional check for suspicious patterns that might not be caught by regex
      const suspiciousPatterns = [
        "'1'='1",
        "'1'='1'",
        "'admin'='admin'",
        "'admin'='admin'",
        "1'='1",
        "1'='1'",
        "admin'='admin",
        "admin'='admin'",
        "admin' OR '1'='1",
        "admin' UNION SELECT",
        "admin'; WAITFOR DELAY",
        "admin; ls -la",
        "<script>alert('xss')</script>",
        "javascript:alert('xss')",
        "onload=alert('xss')",
      ];

      const lowerValue = value.toLowerCase().trim();
      for (const pattern of suspiciousPatterns) {
        if (lowerValue.includes(pattern.toLowerCase())) {
          return {
            isMalicious: true,
            reason: `Detected suspicious pattern: ${pattern}`,
            field: fieldPath || "unknown",
          };
        }
      }

      // Check regex patterns
      for (const pattern of sqlInjectionPatterns) {
        if (pattern.test(value)) {
          return {
            isMalicious: true,
            reason: `Detected malicious pattern: ${pattern.source}`,
            field: fieldPath || "unknown",
          };
        }
      }
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const result = checkField(value[i], `${fieldPath}[${i}]`);
        if (result.isMalicious) return result;
      }
    } else if (value && typeof value === "object") {
      for (const [key, val] of Object.entries(value)) {
        const result = checkField(val, fieldPath ? `${fieldPath}.${key}` : key);
        if (result.isMalicious) return result;
      }
    }

    return { isMalicious: false };
  }

  return checkField(body);
}

// Comprehensive pre-validation to catch authentication bypass attempts
function validateRequestStructure(
  body: unknown,
  schema?: z.ZodSchema
): {
  isValid: boolean;
  error?: string;
} {
  // If no schema is provided, perform basic checks
  if (!schema) {
    return validateBasicAuthFields(body);
  }

  // Check if body is an object
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { isValid: false, error: "Request body must be a non-array object" };
  }

  const bodyObj = body as Record<string, unknown>;

  // Try to validate with the schema first to get detailed error information
  try {
    schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError;
      const firstError = zodError.issues[0];
      if (firstError) {
        return {
          isValid: false,
          error: `${firstError.path.join(".")}: ${firstError.message}`,
        };
      }
    }
    return { isValid: false, error: "Invalid request structure" };
  }

  // Additional security checks for string fields that might contain malicious content
  const stringFields = getStringFieldsFromSchema(schema);
  for (const field of stringFields) {
    const value = bodyObj[field];
    if (value !== undefined && typeof value === "string") {
      if (value.trim().length === 0) {
        return {
          isValid: false,
          error: `${field} cannot be empty or whitespace only`,
        };
      }
    }
  }

  return { isValid: true };
}

// Helper function to extract string fields from a Zod schema
function getStringFieldsFromSchema(schema: z.ZodSchema): string[] {
  const stringFields: string[] = [];

  // This is a simplified approach - in practice, you might want to use a more robust schema analyzer
  // For now, we'll check common authentication fields
  const commonStringFields = [
    "username",
    "password",
    "email",
    "user",
    "pass",
    "name",
    "title",
    "description",
  ];

  // Try to get the shape if it's an object schema
  try {
    if (schema instanceof z.ZodObject) {
      const shape = schema.shape;
      for (const key in shape) {
        if (shape[key] instanceof z.ZodString) {
          stringFields.push(key);
        }
      }
    }
  } catch {
    // If we can't analyze the schema, fall back to common fields
  }

  // If no string fields found in schema analysis, use common ones
  if (stringFields.length === 0) {
    return commonStringFields;
  }

  return stringFields;
}

// Basic validation for auth fields when no schema is provided
function validateBasicAuthFields(body: unknown): {
  isValid: boolean;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { isValid: false, error: "Request body must be an object" };
  }

  const bodyObj = body as Record<string, unknown>;

  // Check for common auth fields
  if (bodyObj.username !== undefined) {
    if (typeof bodyObj.username !== "string") {
      return { isValid: false, error: "Username must be a string" };
    }
    if (bodyObj.username.trim() === "") {
      return { isValid: false, error: "Username cannot be empty" };
    }
  }

  if (bodyObj.password !== undefined) {
    if (typeof bodyObj.password !== "string") {
      return { isValid: false, error: "Password must be a string" };
    }
    if (bodyObj.password.trim() === "") {
      return { isValid: false, error: "Password cannot be empty" };
    }
  }

  return { isValid: true };
}
