// Crypto utilities
export {
  generateSalt,
  hashPassword,
  generateUUID,
  verifyPassword,
  generateRandomString,
  generateSecureToken,
} from "./crypto-utils";

// 2FA utilities (explicit exports to avoid conflicts)
export {
  generate2FASecret,
  verify2FACode,
  generateQRCode as generate2FAQRCode,
  verifyCredentials,
  is2FAEnabledForUser,
  isFirst2FASetup,
  set2FASecretInEnv,
  get2FASecretFromEnv,
  type AuthCredentials,
} from "./2fa";

// Re-export other utilities
export * from "./crypto";
export * from "./database-utils";
export * from "./debug";
export * from "./responseUtils";

// Security utilities
export * from "./security-utils";
