import { AuthenticationManager } from "./strategies/authentication-manager";
import { AuthStep } from "@/backend_lib/types/auth";
import { type LoginData } from "@/backend_lib/validations/auth-schemas";

// Initialize authentication manager
const authManager = new AuthenticationManager();

export interface LoginResult {
  success: boolean;
  nextStep?: AuthStep;
  data?: any;
  error?: string;
}

export interface TwoFactorSetupResult {
  success: boolean;
  qrCode?: string;
  secret?: string;
  error?: string;
}

export interface TwoFactorVerifyResult {
  success: boolean;
  error?: string;
}

export class AuthService {
  /**
   * Handle user login
   */
  static async login(credentials: LoginData): Promise<LoginResult> {
    try {
      const result = await authManager.executeStep(AuthStep.LOGIN, {
        username: credentials.username,
        password: credentials.password,
      });

      return {
        success: result.success,
        nextStep: result.nextStep,
        data: result.data,
        error: result.error,
      };
    } catch (error) {
      console.error("AuthService login error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  }

  /**
   * Handle 2FA setup
   */
  static async setup2FA(userId: string): Promise<TwoFactorSetupResult> {
    try {
      const result = await authManager.executeStep(AuthStep.SETUP_2FA, {
        userId,
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error || "Failed to setup 2FA",
        };
      }

      // Type guard to ensure we have setup 2FA result data
      if (!result.data || !("qrCode" in result.data)) {
        return {
          success: false,
          error: "Invalid 2FA setup response data",
        };
      }

      const setupData = result.data as { qrCode?: string; secret?: string };

      return {
        success: true,
        qrCode: setupData.qrCode,
        secret: setupData.secret,
      };
    } catch (error) {
      console.error("AuthService setup2FA error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "2FA setup failed",
      };
    }
  }

  /**
   * Handle 2FA verification
   */
  static async verify2FA(
    userId: string,
    verificationCode: string
  ): Promise<TwoFactorVerifyResult> {
    try {
      const result = await authManager.executeStep(AuthStep.VERIFY_2FA, {
        userId,
        verificationCode,
      });

      return {
        success: result.success,
        error: result.error,
      };
    } catch (error) {
      console.error("AuthService verify2FA error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "2FA verification failed",
      };
    }
  }

  /**
   * Check 2FA status for a user
   */
  static async check2FAStatus(
    userId: string
  ): Promise<{ success: boolean; hasSetup2FA: boolean; error?: string }> {
    try {
      const initialStep = await authManager.determineInitialStep(userId);

      return {
        success: true,
        hasSetup2FA: initialStep === AuthStep.VERIFY_2FA,
      };
    } catch (error) {
      console.error("AuthService check2FAStatus error:", error);
      return {
        success: false,
        hasSetup2FA: false,
        error:
          error instanceof Error ? error.message : "Failed to check 2FA status",
      };
    }
  }
}

