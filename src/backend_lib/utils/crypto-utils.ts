import crypto from "crypto";
import bcrypt from "bcrypt";

/**
 * Generate a random salt for password hashing (legacy - not used with bcrypt)
 * @deprecated Use bcrypt.hash() instead - salt is included in hash
 * @returns A random 32-character hexadecimal salt
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Hash password using bcrypt (recommended for passwords)
 * @param password - The plain text password
 * @returns The bcrypt hash (includes salt)
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Cost factor - higher = more secure but slower
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Hash password with salt using SHA-256 (legacy - not recommended for passwords)
 * @deprecated Use hashPassword() with bcrypt instead
 * @param password - The plain text password
 * @param salt - The salt to use for hashing
 * @returns The hashed password as a hexadecimal string
 */
export function hashPasswordWithSalt(password: string, salt: string): string {
  return crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex");
}

/**
 * Generate a UUID for user ID
 * @returns A random UUID string
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Verify a password against a stored bcrypt hash
 * @param password - The plain text password to verify
 * @param storedHash - The stored bcrypt password hash
 * @returns True if the password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  return await bcrypt.compare(password, storedHash);
}

/**
 * Verify a password against a stored hash and salt (legacy SHA-256)
 * @deprecated Use verifyPassword() with bcrypt instead
 * @param password - The plain text password to verify
 * @param storedHash - The stored password hash
 * @param salt - The salt used for the stored hash
 * @returns True if the password matches, false otherwise
 */
export function verifyPasswordWithSalt(
  password: string,
  storedHash: string,
  salt: string
): boolean {
  const computedHash = hashPasswordWithSalt(password, salt);
  return computedHash === storedHash;
}

/**
 * Generate a secure random string of specified length
 * @param length - The length of the random string
 * @returns A random string of the specified length
 */
export function generateRandomString(length: number): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Generate a secure token for session management
 * @returns A secure random token
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
