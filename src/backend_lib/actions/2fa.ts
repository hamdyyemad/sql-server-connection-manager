"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverAuthApi } from "@/frontend_lib/services/auth/serverAuthApi";
import { AuthSchemas } from "@/backend_lib/validations/auth-schemas";

export interface TwoFactorSetupFormState {
  success: boolean;
  qrCode?: string;
  secret?: string;
  errors?: {
    verificationCode?: string[];
    _form?: string[];
  };
}

export interface TwoFactorVerifyFormState {
  success: boolean;
  errors?: {
    verificationCode?: string[];
    _form?: string[];
  };
}

export async function setup2FAAction(
  prevState: TwoFactorSetupFormState,
  formData: FormData
): Promise<TwoFactorSetupFormState> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        errors: {
          _form: ["Not authenticated"],
        },
      };
    }

    // Extract userId from JWT token or use legacy token
    let userId: string;
    if (token.startsWith("eyJ")) {
      const { JWTUtils } = await import("@/backend_lib/utils/jwt");
      const decoded = JWTUtils.verifyToken(token);
      if (!decoded) {
        return {
          success: false,
          errors: {
            _form: ["Invalid authentication token"],
          },
        };
      }
      userId = decoded.userId;
    } else {
      // Legacy token handling
      userId = token;
    }

    // Generate QR code for 2FA setup
    const result = await serverAuthApi.setup2FA(userId);

    if (!result.success) {
      return {
        success: false,
        errors: {
          _form: [result.error || "Failed to setup 2FA"],
        },
      };
    }

    // The API response structure is now consistent with login: ApiResponse<TwoFactorSetupResponse>
    // where result.data contains the actual QR code data (same as login API)
    const setupData = result?.data as { qrCode?: string; secret?: string };

    // This is initial setup - should return QR code
    // The API returns qrCode and secret in the data property
    if (!setupData || !setupData?.qrCode) {
      return {
        success: false,
        errors: {
          _form: ["Invalid 2FA setup response data"],
        },
      };
    }

    return {
      success: true,
      qrCode: setupData.qrCode,
      secret: setupData.secret,
    };
  } catch (error) {
    // Check if this is a Next.js redirect error (expected behavior)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      // Re-throw the redirect error to let Next.js handle it
      throw error;
    }

    console.error("2FA setup error:", error);
    return {
      success: false,
      errors: {
        _form: [
          error instanceof Error
            ? error.message
            : "An error occurred during 2FA setup",
        ],
      },
    };
  }
}

export async function verify2FAAction(
  prevState: TwoFactorVerifyFormState,
  formData: FormData
): Promise<TwoFactorVerifyFormState> {
  let shouldRedirect = false;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        errors: {
          _form: ["Not authenticated"],
        },
      };
    }

    // Extract userId from JWT token or use legacy token
    let userId: string;
    if (token.startsWith("eyJ")) {
      const { JWTUtils } = await import("@/backend_lib/utils/jwt");
      const decoded = JWTUtils.verifyToken(token);
      if (!decoded) {
        return {
          success: false,
          errors: {
            _form: ["Invalid authentication token"],
          },
        };
      }
      userId = decoded.userId;
    } else {
      // Legacy token handling
      userId = token;
    }

    // Validate form data with Zod
    const validatedFields = AuthSchemas.verify2FA.safeParse({
      userId: userId,
      verificationCode: formData.get("verificationCode"),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { verificationCode } = validatedFields.data;

    // Use the server auth API service to ensure all security layers are applied
    const result = await serverAuthApi.verify2FA(userId, verificationCode);

    if (result.success) {
      // Get updated user status for new JWT token
      const userStatus = await check2FAStatusAction();

      if (userStatus.success && "is2FAEnabled" in userStatus) {
        // Generate new JWT token with updated user status
        const { JWTUtils } = await import("@/backend_lib/utils/jwt");
        const jwtPayload = {
          userId: userId,
          username: "admin", // Default username, can be enhanced later
          is2FAEnabled: userStatus.is2FAEnabled || false,
          hasSetup2FA: userStatus.hasSetup2FA || false,
          is2FAVerified: userStatus.is2FAVerified || false,
          needsVerification: userStatus.needsVerification || false, // 2FA is now verified
          secret2FAHasValue: userStatus.secret2FAHasValue || false,
          tempSecret2FAHasValue: userStatus.tempSecret2FAHasValue || false,
        };

        const newJwtToken = JWTUtils.generateToken(jwtPayload);

        // Update the auth-token cookie with new JWT token
        cookieStore.set("auth-token", newJwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60, // 24 hours
          path: "/",
        });
      }

      // Remove legacy 2FA requirement cookies
      cookieStore.set("requires-2fa", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0, // Expire immediately
        expires: new Date(0), // Set to past date
      });

      cookieStore.delete("2fa-verified");

      revalidatePath("/");

      // Mark that we should redirect after successful 2FA verification
      shouldRedirect = true;
    }

    return {
      success: result.success,
      errors: result.error ? { _form: [result.error] } : undefined,
    };
  } catch (error) {
    console.error("2FA verification error:", error);
    return {
      success: false,
      errors: {
        _form: [
          error instanceof Error
            ? error.message
            : "An error occurred during 2FA verification",
        ],
      },
    };
  } finally {
    if (shouldRedirect) {
      redirect("/");
    }
  }
}

export async function check2FAStatus() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    // Extract userId from JWT token or use legacy token
    let userId: string;
    if (token.startsWith("eyJ")) {
      const { JWTUtils } = await import("@/backend_lib/utils/jwt");
      const decoded = JWTUtils.verifyToken(token);
      if (!decoded) {
        return {
          success: false,
          error: "Invalid authentication token",
        };
      }
      userId = decoded.userId;
    } else {
      // Legacy token handling
      userId = token;
    }

    // Use the server auth API service to ensure all security layers are applied
    const result = await serverAuthApi.check2FAStatus(userId);

    // The API response structure is: ApiResponse<TwoFactorStatusResponse>
    // where TwoFactorStatusResponse.data contains the actual status data
    const statusData = result?.data as { hasSetup2FA?: boolean };

    return {
      success: result.success,
      hasSetup2FA: statusData?.hasSetup2FA || false,
      error: result.error,
    };
  } catch (error) {
    console.error("2FA status check error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred checking 2FA status",
    };
  }
}

export async function check2FAStatusAction() {
  try {
    console.log("[check2FAStatusAction] Starting function");
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      console.log("[check2FAStatusAction] No token found");
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    console.log("[check2FAStatusAction] Token found, length:", token.length);
    console.log(
      "[check2FAStatusAction] Token starts with eyJ:",
      token.startsWith("eyJ")
    );

    // Extract userId from JWT token or use legacy token
    let userId: string;
    if (token.startsWith("eyJ")) {
      const { JWTUtils } = await import("@/backend_lib/utils/jwt");
      const decoded = JWTUtils.verifyToken(token);
      if (!decoded) {
        console.log("[check2FAStatusAction] Failed to decode JWT token");
        return {
          success: false,
          error: "Invalid authentication token",
        };
      }
      userId = decoded.userId;
      console.log("[check2FAStatusAction] Extracted userId from JWT:", userId);
    } else {
      // Legacy token handling
      userId = token;
      console.log(
        "[check2FAStatusAction] Using legacy token as userId:",
        userId
      );
    }

    console.log(
      "[check2FAStatusAction] Calling serverAuthApi.check2FAStatus with userId:",
      userId
    );
    // Use the server auth API service to ensure all security layers are applied
    const result = await serverAuthApi.check2FAStatus(userId);
    console.log("[check2FAStatusAction] API result:", result);

    // The API response structure is: ApiResponse<TwoFactorStatusResponse>
    // where TwoFactorStatusResponse.data contains the actual status data
    const statusData = result?.data as {
      hasSetup2FA?: boolean;
      is2FAEnabled?: boolean;
      is2FAVerified?: boolean;
      isActive?: boolean;
      needsVerification?: boolean;
      secret2FAHasValue?: boolean;
      tempSecret2FAHasValue?: boolean;
    };

    // Debug logging to see what's actually being returned
    console.log("[check2FAStatusAction] Raw statusData:", statusData);
    console.log(
      "[check2FAStatusAction] is2FAEnabled from statusData:",
      statusData?.is2FAEnabled
    );
    console.log(
      "[check2FAStatusAction] typeof is2FAEnabled:",
      typeof statusData?.is2FAEnabled
    );

    const returnValue = {
      success: result.success,
      hasSetup2FA: statusData?.hasSetup2FA || false,
      is2FAEnabled: Boolean(statusData?.is2FAEnabled), // Explicitly convert to boolean
      is2FAVerified: statusData?.is2FAVerified || false,
      isActive: statusData?.isActive !== false, // Default to true if not specified
      needsVerification: statusData?.needsVerification || false,
      secret2FAHasValue: statusData?.secret2FAHasValue || false,
      tempSecret2FAHasValue: statusData?.tempSecret2FAHasValue || false,
      error: result.error,
    };

    console.log("[check2FAStatusAction] Returning:", returnValue);
    return returnValue;
  } catch (error) {
    console.error("2FA status check error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred checking 2FA status",
    };
  }
}
