import jwt from "jsonwebtoken";
import { tr } from "zod/v4/locales";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export interface JWTPayload {
  userId: string;
  username: string;
  is2FAEnabled: boolean;
  hasSetup2FA: boolean;
  is2FAVerified: boolean;
  needsVerification: boolean;
  secret2FAHasValue: boolean;
  tempSecret2FAHasValue: boolean;
  iat?: number;
  exp?: number;
}

export class JWTUtils {
  /**
   * Generate a JWT token with user authentication data
   */
  static generateToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "24h", // 24 hours
    });
  }

  /**
   * Verify and decode a JWT token (Node.js environment)
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error("[JWTUtils] Token verification failed:", error);
      return null;
    }
  }

  /**
   * Decode a JWT token without verification (for debugging)
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error("[JWTUtils] Token decode failed:", error);
      return null;
    }
  }

  /**
   * Check if a token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      if (!decoded || !decoded.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("[JWTUtils] Token expiration check failed:", error);
      return true;
    }
  }

  /**
   * Get user flags from JWT token (Edge Runtime compatible)
   */
  static getUserFlagsFromToken(token: string): {
    isAuthenticated: boolean;
    hasSetup2FA: boolean;
    is2FAVerified: boolean;
    is2FAEnabled: boolean;
    secret2FAHasValue: boolean;
    tempSecret2FAHasValue: boolean;
    needsVerification: boolean;
  } {
    // For Edge Runtime, we'll decode without verification for now
    // This is a temporary solution - in production, you'd want proper verification
    const decoded = this.decodeToken(token);

    if (!decoded) {
      return {
        isAuthenticated: false,
        hasSetup2FA: false,
        is2FAVerified: false,
        is2FAEnabled: true,
        secret2FAHasValue: false,
        tempSecret2FAHasValue: false,
        needsVerification: true,
      };
    }

    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return {
        isAuthenticated: false,
        hasSetup2FA: false,
        is2FAVerified: false,
        is2FAEnabled: true,
        secret2FAHasValue: false,
        tempSecret2FAHasValue: false,
        needsVerification: true,
      };
    }

    return {
      isAuthenticated: true,
      hasSetup2FA: decoded.hasSetup2FA || false,
      is2FAVerified: decoded.is2FAVerified || false,
      is2FAEnabled: decoded.is2FAEnabled !== false, // Default to true if not specified
      secret2FAHasValue: decoded.secret2FAHasValue || false,
      tempSecret2FAHasValue: decoded.tempSecret2FAHasValue || false,
      needsVerification: decoded.needsVerification || false,
    };
  }
}
