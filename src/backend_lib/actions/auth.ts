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

    // Set authentication cookies using CookieUtils
    await CookieUtils.setAuthCookiesForAction(
      cookies(),
      user.userId,
      user.username,
      {
        requires2FA: nextStep === "verify-2fa",
      }
    );

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
