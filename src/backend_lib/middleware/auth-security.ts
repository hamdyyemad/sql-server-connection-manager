import { NextRequest, NextResponse } from "next/server";
import { withSQLInjectionPrevention } from "./sql-injection-prevention";
import {
  getClientIP,
  checkRateLimit,
  addSecurityHeaders,
  createRateLimitResponse,
} from "../utils/security-utils";
import { withAuthErrorHandler } from "./auth-error-handler";
import { AuthSchemas } from "../validations/auth-schemas";

// Helper function to create secure auth route handler
export function createSecureAuthHandler(
  handler: (
    request: NextRequest,
    validatedBody?: Record<string, unknown>
  ) => Promise<NextResponse>,
  endpoint: keyof typeof AuthSchemas
) {
  return withAuthErrorHandler(
    async (request: NextRequest): Promise<NextResponse> => {
      const clientIP = getClientIP(request);

      // Check rate limit
      const rateLimit = checkRateLimit(clientIP);
      if (!rateLimit.allowed) {
        return createRateLimitResponse();
      }

      // Use SQL injection prevention with auth schema
      const schema = AuthSchemas[endpoint];
      console.log(
        "🔍 Starting SQL injection prevention for endpoint:",
        endpoint
      );

      const result = await withSQLInjectionPrevention(
        request,
        async (req: NextRequest, validatedBody: unknown) => {
          console.log("🔍 SQL injection prevention passed, calling handler");
          // Call the original handler with validated body
          return await handler(req, validatedBody as Record<string, unknown>);
        },
        schema
      )(request);

      console.log("🔍 SQL injection prevention result type:", typeof result);
      console.log("🔍 SQL injection prevention result:", result);

      // If result is a NextResponse, add security headers
      if (result instanceof NextResponse) {
        return addSecurityHeaders(result, rateLimit);
      }

      // If result is a plain object (from SQL injection prevention), convert to NextResponse
      if (result && typeof result === "object" && "success" in result) {
        const resultObj = result as { success: boolean; error?: string };
        console.log("🔍 Auth security middleware result:", {
          success: resultObj.success,
          error: resultObj.error,
          type: typeof result,
        });

        if (!resultObj.success) {
          console.log(
            "🚨 REQUEST BLOCKED - Returning error response, no authentication will occur"
          );
        }

        const status = resultObj.success ? 200 : 400;
        const response = NextResponse.json(result, { status });
        return addSecurityHeaders(response, rateLimit);
      }

      // Fallback
      const response = NextResponse.json(result, { status: 200 });
      return addSecurityHeaders(response, rateLimit);
    }
  );
}
