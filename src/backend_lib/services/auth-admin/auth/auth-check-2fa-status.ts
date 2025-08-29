import { NextRequest, NextResponse } from "next/server";
import { AuthenticationManager } from "./strategies/authentication-manager";
import { AuthStep } from "@/backend_lib/types/auth";
import {
  createErrorObject,
  createSuccessObject,
} from "@/backend_lib/utils/responseUtils";
import { withAuthErrorHandler } from "@/backend_lib/middleware/auth-error-handler";
import { type Check2FAStatusData } from "@/backend_lib/validations/auth-schemas";
import { UserService } from "../users/user-service";
import { TursoUserRepository } from "@/backend_lib/repositories";
import { JWTUtils } from "@/backend_lib/utils/jwt";
import { CookieUtils } from "@/backend_lib/utils/cookie";

// Initialize authentication manager
const authManager = new AuthenticationManager();

// 2FA Status Check handler
export const handle2FAStatusCheck = withAuthErrorHandler(
  async (request: NextRequest, validatedBody?: Record<string, unknown>) => {
    /*
     * We don't need to validate the request body here because it's already validated in the auth-security.ts file
     * Specially because we are using the withSQLInjectionPrevention middleware
     * Which uses the AuthSchemas.check2FAStatus schema to validate the request body
     */
    if (!validatedBody) {
      return NextResponse.json(createErrorObject("Invalid request body"), {
        status: 400,
      });
    }

    const { userId }: Check2FAStatusData = validatedBody as Check2FAStatusData;

    // Get user data for comprehensive status check
    const userService = new UserService(new TursoUserRepository());
    const user = await userService.getUserById(userId);

    if (!user) {
      return NextResponse.json(createErrorObject("User not found"), {
        status: 404,
      });
    }

    // Determine initial step for the user
    const initialStep = await authManager.determineInitialStep(userId);

    // Create response data with all required fields
    const statusData = {
      hasSetup2FA: user.hasSetup2FA,
      needsSetup: initialStep === AuthStep.SETUP_2FA,
      needsVerification: initialStep === AuthStep.VERIFY_2FA,
      isFirstSetup: initialStep === AuthStep.SETUP_2FA,
      is2FAEnabled: user.is2FAEnabled,
      is2FAVerified: user.is2FAVerified,
      isActive: user.isActive,
      secret2FAHasValue: !!(user.secret2FA && user.secret2FA.trim() !== ''),
      tempSecret2FAHasValue: !!(user.tempSecret2FA && user.tempSecret2FA.trim() !== ''),
    };

    // Use createSuccessObject to match the same structure as login API
    const responseData = createSuccessObject(
      statusData,
      initialStep === AuthStep.SETUP_2FA
        ? "First 2FA setup required"
        : "2FA verification required"
    );

    const response = NextResponse.json(responseData);

    // Update JWT token with current user status
    const jwtPayload = {
      userId: userId,
      username: "admin", // Default username, can be enhanced later
      is2FAEnabled: statusData.is2FAEnabled,
      hasSetup2FA: statusData.hasSetup2FA,
      is2FAVerified: statusData.is2FAVerified,
      needsVerification: statusData.needsVerification,
      secret2FAHasValue: statusData.secret2FAHasValue,
      tempSecret2FAHasValue: statusData.tempSecret2FAHasValue,
    };
    
    const newJwtToken = JWTUtils.generateToken(jwtPayload);
    
    // Update the auth-token cookie with new JWT token
    CookieUtils.set(response, "auth-token", newJwtToken);

    return response;
  }
);
