import {
  hashPassword as newHashPassword,
  verifyPassword,
} from "./crypto-utils";

/**
 * @deprecated Use hashPassword(password, salt) from crypto-utils instead
 * This function doesn't use salt and is less secure
 */
export async function hashPassword(password: string): Promise<string> {
  console.warn(
    "Warning: hashPassword(password) is deprecated. Use hashPassword(password, salt) from crypto-utils instead."
  );
  return await newHashPassword(password);
}

/**
 * @deprecated Use verifyPassword(password, storedHash, salt) from crypto-utils instead
 * This function doesn't use salt and is less secure
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  console.warn(
    "Warning: comparePassword() is deprecated. Use verifyPassword(password, storedHash, salt) from crypto-utils instead."
  );
  return await verifyPassword(password, hash);
}

// Re-export the new secure functions for backward compatibility
export {
  hashPassword as secureHashPassword,
  verifyPassword as secureComparePassword,
} from "./crypto-utils";
