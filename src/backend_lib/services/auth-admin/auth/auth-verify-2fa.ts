import { NextRequest, NextResponse } from "next/server";
import { AuthenticationManager } from "./strategies/authentication-manager";
import { AuthStep } from "@/backend_lib/types/auth";
import {
  createErrorObject,
  createSuccessObject,
} from "@/backend_lib/utils/responseUtils";
import { withAuthErrorHandler } from "@/backend_lib/middleware/auth-error-handler";
import { type Verify2FAData } from "@/backend_lib/validations/auth-schemas";
import { JWTUtils } from "@/backend_lib/utils/jwt";
import { CookieUtils } from "@/backend_lib/utils/cookie";

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

    // Set JWT authentication token when 2FA verification is successful
    if (result.success && result.data) {
      // Get updated user status for JWT token
      const { check2FAStatusAction } = await import("@/backend_lib/actions/2fa");
      const userStatus = await check2FAStatusAction();
      
      if (userStatus.success) {
        // Generate new JWT token with updated user status
        const jwtPayload = {
          userId: userId,
          username: result.data && "username" in result.data ? result.data.username : "admin",
          is2FAEnabled: userStatus.is2FAEnabled || false,
          hasSetup2FA: userStatus.hasSetup2FA || false,
          is2FAVerified: userStatus.is2FAVerified || false,
          needsVerification: false, // 2FA is now verified
          secret2FAHasValue: userStatus.secret2FAHasValue || false,
          tempSecret2FAHasValue: userStatus.tempSecret2FAHasValue || false,
        };
        
        const newJwtToken = JWTUtils.generateToken(jwtPayload);
        
        // Set JWT token as auth-token cookie
        CookieUtils.set(response, "auth-token", newJwtToken);
        
        // Set username cookie
        if (result.data && "username" in result.data) {
          CookieUtils.set(response, "auth-username", result.data.username);
        }
      }
    }

    return response;
  }
);
