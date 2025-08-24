import { NextRequest, NextResponse } from "next/server";
import { AuthenticationManager } from "./strategies/authentication-manager";
import { AuthStep } from "@/backend_lib/types/auth";
import {
  createErrorObject,
  createSuccessObject,
} from "@/backend_lib/utils/responseUtils";
import { withAuthErrorHandler } from "@/backend_lib/middleware/auth-error-handler";
import { type Setup2FAData } from "@/backend_lib/validations/auth-schemas";

// Initialize authentication manager
const authManager = new AuthenticationManager();

// 2FA Setup handler
export const handle2FASetup = withAuthErrorHandler(
  async (request: NextRequest, validatedBody?: Record<string, unknown>) => {
    /*
     * We don't need to validate the request body here because it's already validated in the auth-security.ts file
     * Specially because we are using the withSQLInjectionPrevention middleware
     * Which uses the AuthSchemas.setup2FA schema to validate the request body
     */
    if (!validatedBody) {
      return NextResponse.json(createErrorObject("Invalid request body"), {
        status: 400,
      });
    }

    const { userId }: Setup2FAData = validatedBody as Setup2FAData;

    // Execute 2FA setup strategy
    const result = await authManager.executeStep(AuthStep.SETUP_2FA, {
      userId,
    });

    if (!result.success) {
      return NextResponse.json(
        createErrorObject(result.error || "2FA setup failed"),
        { status: 400 }
      );
    }

    // Create response data
    const responseData = {
      qrCode:
        result.data && "qrCode" in result.data ? result.data.qrCode : undefined,
      secret:
        result.data && "secret" in result.data ? result.data.secret : undefined,
      needsSetup:
        !(result.data && "qrCode" in result.data && result.data.qrCode) &&
        result.nextStep === AuthStep.SETUP_2FA,
      isFirstSetup: true,
    };

    // Use createSuccessObject to match the same structure as login API
    const response = createSuccessObject(
      responseData,
      "QR code generated for 2FA setup"
    );

    return NextResponse.json(response);
  }
);
