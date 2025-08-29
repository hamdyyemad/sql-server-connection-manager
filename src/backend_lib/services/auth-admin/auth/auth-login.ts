import { NextRequest, NextResponse } from "next/server";
import {
  createSuccessObject,
  createErrorObject,
} from "@/backend_lib/utils/responseUtils";
import { CookieUtils } from "@/backend_lib/utils/cookie";
import { withAuthErrorHandler } from "@/backend_lib/middleware/auth-error-handler";
import { type LoginData } from "@/backend_lib/validations/auth-schemas";
import { AuthService } from "./auth-service";
import { JWTUtils } from "@/backend_lib/utils/jwt";

// Login handler
export const handleLogin = withAuthErrorHandler(
  async (request: NextRequest, validatedBody?: Record<string, unknown>) => {
    /*
     * We don't need to validate the request body here because it's already validated in the auth-security.ts file
     * Specially because we are using the withSQLInjectionPrevention middleware
     * Which uses the AuthSchemas.login schema to validate the request body
     */
    if (!validatedBody) {
      return NextResponse.json(createErrorObject("Invalid request body"), {
        status: 400,
      });
    }

    const { username, password }: LoginData = validatedBody as LoginData;

    // Use the centralized auth service
    const result = await AuthService.login({ username, password });

    if (!result.success) {
      return NextResponse.json(
        createErrorObject(result.error || "Login failed"),
        { status: 401 }
      );
    }

    // Create response based on next step
    const response = createSuccessObject(
      {
        nextStep: result.nextStep, // Single source of truth from database
        user: result.data,
      },
      "Login successful"
    );

    const nextResponse = NextResponse.json(response);

    // Set authentication cookies if login was successful
    if (result.data && "userId" in result.data) {
      // Get user status directly from database to avoid circular dependency
      const { UserService } = await import("../users/user-service");
      const { TursoUserRepository } = await import("@/backend_lib/repositories");
      
      const userService = new UserService(new TursoUserRepository());
      const user = await userService.getUserById(result.data.userId);
      
      if (user) {
        // Generate JWT token with actual user status from database
        const jwtPayload = {
          userId: result.data.userId,
          username: username,
          is2FAEnabled: user.is2FAEnabled,
          hasSetup2FA: user.hasSetup2FA,
          is2FAVerified: user.is2FAVerified,
          needsVerification: result.nextStep === "verify-2fa",
          secret2FAHasValue: !!(user.secret2FA && user.secret2FA.trim() !== ''),
          tempSecret2FAHasValue: !!(user.tempSecret2FA && user.tempSecret2FA.trim() !== ''),
        };
        
        console.log('[auth-login] User from database:', {
          is2FAEnabled: user.is2FAEnabled,
          hasSetup2FA: user.hasSetup2FA,
          is2FAVerified: user.is2FAVerified,
          secret2FA: user.secret2FA ? 'has value' : 'no value',
          tempSecret2FA: user.tempSecret2FA ? 'has value' : 'no value',
        });
        console.log('[auth-login] JWT payload:', jwtPayload);
        
        const jwtToken = JWTUtils.generateToken(jwtPayload);
        
        // Set JWT token as auth-token cookie
        CookieUtils.set(nextResponse, "auth-token", jwtToken);
        CookieUtils.set(nextResponse, "auth-username", username);
      } else {
        // Fallback to basic JWT token if user not found
        const jwtPayload = {
          userId: result.data.userId,
          username: username,
          is2FAEnabled: true, // Default to true for security
          hasSetup2FA: false,
          is2FAVerified: false,
          needsVerification: result.nextStep === "verify-2fa",
          secret2FAHasValue: false,
          tempSecret2FAHasValue: false,
        };
        
        const jwtToken = JWTUtils.generateToken(jwtPayload);
        
        // Set JWT token as auth-token cookie
        CookieUtils.set(nextResponse, "auth-token", jwtToken);
        CookieUtils.set(nextResponse, "auth-username", username);
      }
    }

    return nextResponse;
  }
);
