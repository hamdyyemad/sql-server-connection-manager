// Debug functions are now automatically handled by console override
import { createErrorObject, createSuccessObject } from "../utils/responseUtils";

export interface ConnectionParams {
  server: string;
  user?: string;
  password?: string;
  authenticationType: "windows" | "sql";
}

// Common SQL injection patterns to detect
const SQL_INJECTION_PATTERNS = [
  /['";]/,                           // Quote characters
  /--/,                              // SQL comments
  /\/\*/,                            // Multi-line comment start
  /\*\//,                            // Multi-line comment end
  /\bUNION\b/i,                      // UNION keyword
  /\bSELECT\b/i,                     // SELECT keyword
  /\bINSERT\b/i,                     // INSERT keyword
  /\bUPDATE\b/i,                     // UPDATE keyword
  /\bDELETE\b/i,                     // DELETE keyword
  /\bDROP\b/i,                       // DROP keyword
  /\bALTER\b/i,                      // ALTER keyword
  /\bCREATE\b/i,                     // CREATE keyword
  /\bEXEC\b/i,                       // EXEC keyword
  /\bEXECUTE\b/i,                    // EXECUTE keyword
  /\bsp_\w+/i,                       // Stored procedures
  /\bxp_\w+/i,                       // Extended stored procedures
  /\bOR\s+1\s*=\s*1/i,              // Classic OR 1=1
  /\bAND\s+1\s*=\s*1/i,             // Classic AND 1=1
  /\b1\s*=\s*1/,                     // 1=1 condition
  /\b0\s*=\s*0/,                     // 0=0 condition
  /\bCONCAT\s*\(/i,                  // CONCAT function
  /\bCAST\s*\(/i,                    // CAST function
  /\bCONVERT\s*\(/i,                 // CONVERT function
  /\bCHAR\s*\(/i,                    // CHAR function
  /\bASCII\s*\(/i,                   // ASCII function
  /\bSUBSTRING\s*\(/i,               // SUBSTRING function
  /\bLEN\s*\(/i,                     // LEN function
  /\bLENGTH\s*\(/i,                  // LENGTH function
  /;\s*$|;\s*\w/,                    // Semicolon (command separator)
  /\|\|/,                            // String concatenation
];

// Characters that should not be present in server names or usernames
const SUSPICIOUS_CHARACTERS = [
  '<', '>', '&', '%', '$', '@', '!', '#', '^', '(', ')', '[', ']', '{', '}',
  '+', '=', '|', '\\', '/', '?', '*', '~', '`'
];

/**
 * Validates a string against SQL injection patterns
 */
function containsSQLInjection(value: string): boolean {
  if (!value) return false;
  
  // Check for SQL injection patterns
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(value)) {
      console.error(`SQL injection pattern detected: ${pattern.source} in value: ${value}`);
      return true;
    }
  }
  
  return false;
}

/**
 * Validates a string for suspicious characters (mainly for server names and usernames)
 */
function containsSuspiciousCharacters(value: string, fieldName: string): boolean {
  if (!value) return false;
  
  for (const char of SUSPICIOUS_CHARACTERS) {
    if (value.includes(char)) {
      console.error(`Suspicious character '${char}' found in ${fieldName}: ${value}`);
      return true;
    }
  }
  
  return false;
}

/**
 * Validates server name specifically
 */
function validateServerName(server: string): { success: boolean; error: string } {
  if (!server || server.trim() === '') {
    return createErrorObject("Server name cannot be empty");
  }

  // Trim and basic length check
  const trimmedServer = server.trim();
  if (trimmedServer.length > 255) {
    return createErrorObject("Server name is too long (max 255 characters)");
  }

  // Check for SQL injection patterns
  if (containsSQLInjection(trimmedServer)) {
    return createErrorObject("Server name contains potentially malicious content");
  }

  // Check for suspicious characters
  if (containsSuspiciousCharacters(trimmedServer, "server name")) {
    return createErrorObject("Server name contains invalid characters");
  }

  // Validate server name format (allow alphanumeric, dots, hyphens, underscores, backslashes for instances)
  const serverNamePattern = /^[a-zA-Z0-9._\-\\]+$/;
  if (!serverNamePattern.test(trimmedServer)) {
    return createErrorObject("Server name contains invalid characters. Only alphanumeric characters, dots, hyphens, underscores, and backslashes are allowed");
  }

  return createSuccessObject();
}

/**
 * Validates username
 */
function validateUsername(user: string | undefined): { success: boolean; error: string } {
  // Username is optional for Windows authentication
  if (!user || user.trim() === '') {
    return createSuccessObject();
  }

  const trimmedUser = user.trim();
  if (trimmedUser.length > 128) {
    return createErrorObject("Username is too long (max 128 characters)");
  }

  // Check for SQL injection patterns
  if (containsSQLInjection(trimmedUser)) {
    return createErrorObject("Username contains potentially malicious content");
  }

  // For usernames, we're more restrictive with special characters
  // Allow alphanumeric, dots, hyphens, underscores, and backslashes (for domain\user format)
  const usernamePattern = /^[a-zA-Z0-9._\-\\@]+$/;
  if (!usernamePattern.test(trimmedUser)) {
    return createErrorObject("Username contains invalid characters. Only alphanumeric characters, dots, hyphens, underscores, @ symbols, and backslashes are allowed");
  }

  return createSuccessObject();
}

/**
 * Validates password
 */
function validatePassword(password: string | undefined): { success: boolean; error: string } {
  // Password is optional for Windows authentication
  if (!password) {
    return createSuccessObject();
  }

  if (password.length > 128) {
    return createErrorObject("Password is too long (max 128 characters)");
  }

  // For passwords, we only check for obvious SQL injection attempts
  // We don't restrict special characters as they're legitimate in passwords
  const obviousSQLPatterns = [
    /['"];?\s*(DROP|DELETE|UPDATE|INSERT|ALTER|CREATE)\s+/i,
    /UNION\s+SELECT/i,
    /OR\s+1\s*=\s*1/i,
    /AND\s+1\s*=\s*1/i,
    /--\s*$/,
  ];

  for (const pattern of obviousSQLPatterns) {
    if (pattern.test(password)) {
      return createErrorObject("Password contains potentially malicious content");
    }
  }

  return createSuccessObject();
}

/**
 * Validates authentication type
 */
function validateAuthType(authenticationType: string): { success: boolean; error: string } {
  if (!authenticationType) {
    return createErrorObject("Authentication type is required");
  }

  const validAuthTypes = ['windows', 'sql'];
  if (!validAuthTypes.includes(authenticationType.toLowerCase())) {
    return createErrorObject("Invalid authentication type. Must be 'windows' or 'sql'");
  }

  return createSuccessObject();
}

/**
 * Main validation function that prevents SQL injection in connection parameters
 */
export function validateConnectionParamsWithSQLInjectionPrevention(
  params: ConnectionParams
): { success: boolean; error: string } {
  console.log("Starting SQL injection validation for connection parameters");
  
  const { server, user, password, authenticationType } = params;

  // Validate server name
  const serverValidation = validateServerName(server);
  if (!serverValidation.success) {
    console.error("Server validation failed:", serverValidation.error);
    return serverValidation;
  }

  // Validate authentication type
  const authValidation = validateAuthType(authenticationType);
  if (!authValidation.success) {
    console.error("Authentication type validation failed:", authValidation.error);
    return authValidation;
  }

  // For SQL authentication, username and password are required
  if (authenticationType.toLowerCase() === 'sql') {
    if (!user || user.trim() === '') {
      console.error("Username is required for SQL authentication");
      return createErrorObject("Username is required for SQL authentication");
    }
    if (!password || password.trim() === '') {
      console.error("Password is required for SQL authentication");
      return createErrorObject("Password is required for SQL authentication");
    }
  }

  // Validate username
  const userValidation = validateUsername(user);
  if (!userValidation.success) {
    console.error("Username validation failed:", userValidation.error);
    return userValidation;
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.success) {
    console.error("Password validation failed:", passwordValidation.error);
    return passwordValidation;
  }

  console.log("SQL injection validation passed for all connection parameters");
  return createSuccessObject();
}

/**
 * Additional utility function to sanitize input strings
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/['"]/g, '') // Remove quotes
    .replace(/--/g, '')   // Remove SQL comments
    .replace(/\/\*|\*\//g, ''); // Remove multi-line comments
}

/**
 * Utility function to check if a string is safe for database operations
 */
export function isSafeForDatabase(input: string): boolean {
  if (!input) return true;
  
  return !containsSQLInjection(input) && 
         input.length <= 255 && 
         !/[<>"']/.test(input);
} 