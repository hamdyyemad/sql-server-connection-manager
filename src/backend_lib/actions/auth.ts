"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverAuthApi } from "@/frontend_lib/services/auth/serverAuthApi";
import { AuthSchemas } from "@/backend_lib/validations/auth-schemas";
import { LoginResponse } from "../types/auth";
import { validateWithZod } from "@/backend_lib/utils/zod-validator";
import { CookieUtils } from "@/backend_lib/utils/cookie";

export interface LoginFormState {
  success: boolean;
  nextStep?: "setup-2fa" | "verify-2fa" | "complete";
  user?: {
    userId: string;
    username: string;
  };
  errors?: {
    username?: string[];
    password?: string[];
    _form?: string[];
  };
}

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  let redirectPath: string | null = null;

  try {
    // Validate form data with Zod
    const validation = validateWithZod(AuthSchemas.login, {
      username: formData.get("username"),
      password: formData.get("password"),
    });

    if (!validation.success) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    const { username, password } = validation.data!;

    // Use the server auth API service to ensure all security layers are applied
    const result = await serverAuthApi.login({ username, password });

    if (!result.success) {
      return {
        success: false,
        errors: {
          _form: [result.error || "Login failed"],
        },
      };
    }

    // Login successful - the API response structure is: ApiResponse<LoginResponse>
    // where LoginResponse.data contains the actual user data
    const loginData = result?.data as LoginResponse;

    if (!loginData || !loginData.nextStep || !loginData.user) {
      return {
        success: false,
        errors: {
          _form: ["Invalid login response data"],
        },
      };
    }

    // The API response structure is: ApiResponse<{nextStep, user}>
    // where user contains userId and username
    const nextStep = loginData.nextStep;
    const user = loginData.user;

    // Type guard to ensure we have login result data
    if (!("userId" in user) || !("username" in user)) {
      return {
        success: false,
        errors: {
          _form: ["Invalid login response data"],
        },
      };
    }

    // First, we need to set a temporary token so the API can authenticate
    const tempJwtPayload = {
      userId: user.userId,
      username: user.username,
      is2FAEnabled: true, // Temporary value
      hasSetup2FA: false, // Temporary value
      is2FAVerified: false, // Temporary value
      needsVerification: false, // Temporary value
      secret2FAHasValue: false, // Temporary value
      tempSecret2FAHasValue: false, // Temporary value
    };

    const { JWTUtils } = await import("@/backend_lib/utils/jwt");
    const tempJwtToken = JWTUtils.generateToken(tempJwtPayload);

    // Set temporary token for API call
    await CookieUtils.setForAction(cookies(), "auth-token", tempJwtToken);

    // Now call the API to get actual user status
    const statusResult = await serverAuthApi.check2FAStatus(user.userId);

    console.log(
      "**********************API STATUS RESULT************************"
    );
    console.log(statusResult);
    console.log(
      "**********************API STATUS RESULT************************"
    );

    if (statusResult.success && statusResult.data) {
      // Type assertion to access the actual data structure returned by the API
      const statusData = statusResult.data as unknown as {
        hasSetup2FA: boolean;
        is2FAEnabled: boolean;
        is2FAVerified: boolean;
        secret2FAHasValue: boolean;
        tempSecret2FAHasValue: boolean;
        needsVerification: boolean;
      };

      // Generate JWT token with actual user status from API
      const jwtPayload = {
        userId: user.userId,
        username: user.username,
        is2FAEnabled: statusData.is2FAEnabled || false,
        hasSetup2FA: statusData.hasSetup2FA || false,
        is2FAVerified: statusData.is2FAVerified || false,
        needsVerification: statusData.needsVerification || false,
        secret2FAHasValue: statusData.secret2FAHasValue || false,
        tempSecret2FAHasValue: statusData.tempSecret2FAHasValue || false,
      };

      console.log("**********************JWT PAYLOAD************************");
      console.log(jwtPayload);
      console.log("**********************JWT PAYLOAD************************");

      const jwtToken = JWTUtils.generateToken(jwtPayload);

      // Set JWT token as auth-token cookie
      await CookieUtils.setForAction(cookies(), "auth-token", jwtToken);

      // Set username cookie
      await CookieUtils.setForAction(cookies(), "auth-username", user.username);
    } else {
      // Fallback if API call fails
      console.log(
        "**********************API CALL FAILED, USING FALLBACK************************"
      );

      const jwtPayload = {
        userId: user.userId,
        username: user.username,
        is2FAEnabled: true, // Default to true for security
        hasSetup2FA: false,
        is2FAVerified: false,
        needsVerification: nextStep === "verify-2fa",
        secret2FAHasValue: false,
        tempSecret2FAHasValue: false,
      };

      const jwtToken = JWTUtils.generateToken(jwtPayload);

      // Set JWT token as auth-token cookie
      await CookieUtils.setForAction(cookies(), "auth-token", jwtToken);

      // Set username cookie
      await CookieUtils.setForAction(cookies(), "auth-username", user.username);
    }

    // Determine redirect path based on nextStep
    switch (nextStep) {
      case "setup-2fa":
        redirectPath = "/auth/2fa-setup";
        break;
      case "verify-2fa":
        redirectPath = "/auth/2fa-verify";
        break;
      case "complete":
        redirectPath = "/";
        break;
      default:
        return {
          success: false,
          errors: {
            _form: ["Invalid login response data"],
          },
        };
    }

    // Return success - let middleware handle the redirect based on nextStep cookie
    return {
      success: true,
      nextStep: nextStep as "setup-2fa" | "verify-2fa" | "complete",
      user,
    };
  } catch (error) {
    console.error("Login action error:", error);
    return {
      success: false,
      errors: {
        _form: [
          error instanceof Error
            ? error.message
            : "An error occurred during login",
        ],
      },
    };
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}

export async function logoutAction() {
  let redirectPath: string | null = null;
  try {
    await CookieUtils.clearAuthCookiesForAction(cookies());
    redirectPath = "/auth/login";
  } catch (error) {
    console.error("Logout action error:", error);
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}

export async function complete2FAAction() {
  let redirectPath: string | null = null;
  try {
    await CookieUtils.deleteForAction(cookies(), "requires-2fa");
    redirectPath = "/";
  } catch (error) {
    console.error("Complete 2FA action error:", error);
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}

export async function getAuthStatus() {
  const token = await CookieUtils.get(cookies(), "auth-token");
  const username = await CookieUtils.get(cookies(), "auth-username");
  const requires2FA = await CookieUtils.get(cookies(), "requires-2fa");

  return {
    isAuthenticated: !!token,
    user: token && username ? { userId: token, username } : undefined,
    requires2FA: requires2FA === "true",
  };
}

/**
 * Force logout action - clears all authentication cookies and redirects to login
 * This is useful for security purposes or when you need to force a user to re-authenticate
 */
export async function forceLogoutAction() {
  let redirectPath: string | null = null;
  try {
    await CookieUtils.clearAuthCookiesForAction(cookies());
    redirectPath = "/auth/login";
  } catch (error) {
    console.error("Force logout action error:", error);
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}
