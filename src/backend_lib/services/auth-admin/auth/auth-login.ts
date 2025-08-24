import { NextRequest, NextResponse } from "next/server";
import {
  createSuccessObject,
  createErrorObject,
} from "@/backend_lib/utils/responseUtils";
import { CookieUtils } from "@/backend_lib/utils/cookie";
import { withAuthErrorHandler } from "@/backend_lib/middleware/auth-error-handler";
import { type LoginData } from "@/backend_lib/validations/auth-schemas";
import { AuthService } from "./auth-service";

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
      CookieUtils.setAuthCookies(nextResponse, result.data.userId, username);
    }

    return nextResponse;
  }
);
