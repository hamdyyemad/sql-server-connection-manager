import { NextRequest, NextResponse } from "next/server";
import { AuthenticationManager } from "./strategies/authentication-manager";
import { AuthStep } from "@/backend_lib/types/auth";
import {
  createErrorObject,
  createSuccessObject,
} from "@/backend_lib/utils/responseUtils";
import { withAuthErrorHandler } from "@/backend_lib/middleware/auth-error-handler";
import { type Verify2FAData } from "@/backend_lib/validations/auth-schemas";

// Initialize authentication manager
const authManager = new AuthenticationManager();

// 2FA Verification handler
export const handle2FAVerification = withAuthErrorHandler(
  async (request: NextRequest, validatedBody?: Record<string, unknown>) => {
    /*
     * We don't need to validate the request body here because it's already validated in the auth-security.ts file
     * Specially because we are using the withSQLInjectionPrevention middleware
     * Which uses the AuthSchemas.verify2FA schema to validate the request body
     */
    if (!validatedBody) {
      return NextResponse.json(createErrorObject("Invalid request body"), {
        status: 400,
      });
    }

    const { userId, verificationCode }: Verify2FAData =
      validatedBody as Verify2FAData;

    // Execute 2FA verification strategy
    const result = await authManager.executeStep(AuthStep.VERIFY_2FA, {
      userId,
      verificationCode,
    });

    if (!result.success) {
      return NextResponse.json(
        createErrorObject(result.error || "2FA verification failed"),
        { status: 400 }
      );
    }

    // Use createSuccessObject to match the same structure as login API
    const responseData = createSuccessObject(
      result.data,
      "2FA verification successful"
    );

    const response = NextResponse.json(responseData);

    // Set authentication cookie when 2FA verification is successful
    if (result.success && result.data) {
      response.cookies.set("auth-token", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60, // 24 hours
      });

      // Also set a username cookie for reference
      if (result.data && "username" in result.data) {
        response.cookies.set("auth-username", result.data.username, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60, // 24 hours
        });
      }
    }

    return response;
  }
);
