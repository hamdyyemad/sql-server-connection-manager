import speakeasy from "speakeasy";
import QRCode from "qrcode";
import crypto from "crypto";

// ============================================================================
// 2FA SECRET MANAGEMENT
// ============================================================================

export function generate2FASecret(): { base32: string; otpauth_url: string } {
  const secretObj = speakeasy.generateSecret({
    name: process.env.NEXT_PUBLIC_APP_NAME || "Admin Panel",
    issuer: process.env.NEXT_PUBLIC_APP_ISSUER || "Admin Panel",
    length: 32,
  });

  console.log("🔍 generate2FASecret - Full secret object:", secretObj);
  console.log("🔍 generate2FASecret - Returning base32:", secretObj.base32);
  console.log(
    "🔍 generate2FASecret - Returning otpauth_url:",
    secretObj.otpauth_url
  );

  return {
    base32: secretObj.base32,
    otpauth_url: secretObj.otpauth_url || "",
  };
}

// ============================================================================
// QR CODE GENERATION
// ============================================================================

export async function generateQRCode(
  username: string,
  secret: string,
  otpauthUrl?: string
): Promise<string> {
  console.log("🔍 generateQRCode - Inputs:");
  console.log("🔍 - Username:", username);
  console.log("🔍 - Secret:", secret);
  console.log("🔍 - Secret length:", secret.length);

  let otpauth: string;

  if (otpauthUrl) {
    // Use the provided otpauth URL (from generate2FASecret)
    otpauth = otpauthUrl;
    console.log("🔍 generateQRCode - Using provided otpauth URL:", otpauth);
  } else {
    // Fallback to generating otpauth URL (for backward compatibility)
    otpauth = speakeasy.otpauthURL({
      secret: secret,
      label: username,
      issuer: process.env.NEXT_PUBLIC_APP_ISSUER || "Admin Panel",
      algorithm: "sha1",
    });
    console.log("🔍 generateQRCode - Generated otpauth URL:", otpauth);
  }

  // Extract secret from otpauth URL to verify
  const urlParams = new URL(otpauth);
  const secretParam = urlParams.searchParams.get("secret");
  console.log("🔍 generateQRCode - Secret in URL:", secretParam);
  console.log("🔍 generateQRCode - Secret in URL length:", secretParam?.length);

  const qrCodeUrl = await QRCode.toDataURL(otpauth);
  console.log("🔍 generateQRCode - QR code generated successfully");

  return qrCodeUrl;
}

// ============================================================================
// 2FA VERIFICATION
// ============================================================================

export function verify2FACode(code: string, secret: string): boolean {
  console.log("🔍 verify2FACode - Inputs:");
  console.log("🔍 - Code:", code);
  console.log("🔍 - Secret:", secret);
  console.log("🔍 - Secret length:", secret.length);

  const result = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: code,
    window: 2, // Allow 2 time steps before and after
  });

  console.log("🔍 verify2FACode - Result:", result);

  // Also try to generate a current token for comparison
  const currentToken = speakeasy.totp({
    secret: secret,
    encoding: "base32",
  });
  console.log("🔍 verify2FACode - Current token:", currentToken);

  return result;
}

// ============================================================================
// PASSWORD VERIFICATION (for admin credentials)
// ============================================================================

export interface AuthCredentials {
  username: string;
  password: string;
}

// Helper function to hash password with SHA-256
function hashPassword(password: string, salt: string): string {
  return crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex");
}

export async function verifyCredentials(
  credentials: AuthCredentials
): Promise<{ success: boolean; error?: string }> {
  const { username, password } = credentials;

  console.log("🔍 Verifying credentials for username:", username);

  // Get credentials from environment variables
  const envUsername = process.env.ADMIN_USERNAME;
  const envPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const envPasswordSalt = process.env.ADMIN_PASSWORD_SALT;

  console.log("🔍 Environment variables:");
  console.log("  - ADMIN_USERNAME:", envUsername);
  console.log(
    "  - ADMIN_PASSWORD_HASH:",
    envPasswordHash ? `${envPasswordHash.substring(0, 20)}...` : "NOT SET"
  );
  console.log(
    "  - ADMIN_PASSWORD_SALT:",
    envPasswordSalt ? `${envPasswordSalt.substring(0, 10)}...` : "NOT SET"
  );

  // Check if environment variables are set
  if (!envUsername || !envPasswordHash || !envPasswordSalt) {
    console.error("❌ Missing environment variables");
    return {
      success: false,
      error: "Admin credentials not configured in environment variables",
    };
  }

  // Verify username
  if (username !== envUsername) {
    console.error("❌ Username mismatch:", {
      provided: username,
      expected: envUsername,
    });
    return {
      success: false,
      error: "Invalid username",
    };
  }

  console.log("✅ Username verified successfully");

  // Verify password using SHA-256
  try {
    console.log("🔍 Comparing password with hash...");
    const hashedPassword = hashPassword(password, envPasswordSalt);
    const isPasswordValid = hashedPassword === envPasswordHash;

    console.log("🔍 Password verification result:", isPasswordValid);
    console.log("🔍 Expected hash:", envPasswordHash);
    console.log("🔍 Generated hash:", hashedPassword);

    if (!isPasswordValid) {
      console.error("❌ Password verification failed");
      return {
        success: false,
        error: "Invalid password",
      };
    }

    console.log("✅ Password verified successfully");
    return { success: true };
  } catch (hashError) {
    console.error("❌ Hash error:", hashError);
    return {
      success: false,
      error: "Password verification failed",
    };
  }
}

// ============================================================================
// 2FA STATUS MANAGEMENT
// ============================================================================

// Helper function to check if 2FA is enabled for a user
export function is2FAEnabledForUser(username: string): boolean {
  const enabledUsers = process.env.ENABLED_2FA_USERS;

  if (!enabledUsers) {
    return false; // No users have 2FA enabled yet
  }

  const enabledUsersList = enabledUsers.split(",").map((user) => user.trim());
  return enabledUsersList.includes(username);
}

// Helper function to check if this is the first 2FA setup ever
export function isFirst2FASetup(): boolean {
  const enabledUsers = process.env.ENABLED_2FA_USERS;
  return !enabledUsers || enabledUsers.trim() === "";
}

// ============================================================================
// ENVIRONMENT-BASED 2FA SECRET MANAGEMENT (for development)
// ============================================================================

// Helper function to set 2FA secret in environment (for development only)
export function set2FASecretInEnv(username: string, secret: string): void {
  const envKey = `${username.toUpperCase()}_2FA_SECRET`;
  process.env[envKey] = secret;

  // Also add to enabled users list
  const enabledUsers = process.env.ENABLED_2FA_USERS || "";
  if (
    !enabledUsers
      .split(",")
      .map((u) => u.trim())
      .includes(username)
  ) {
    process.env.ENABLED_2FA_USERS = enabledUsers
      ? `${enabledUsers},${username}`
      : username;
  }
}

// Helper function to get 2FA secret from environment
export function get2FASecretFromEnv(username: string): string | null {
  const envKey = `${username.toUpperCase()}_2FA_SECRET`;
  return process.env[envKey] || null;
}
