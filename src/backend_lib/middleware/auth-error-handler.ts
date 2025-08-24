import { NextResponse } from "next/server";
import { addSecurityHeaders } from "../utils/security-utils";

/**
 * Error handler specifically for auth middleware that returns NextResponse
 */
export function withAuthErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("Auth error:", error);

      if (error instanceof Error && "statusCode" in error) {
        const apiError = error as {
          statusCode: number;
          message: string;
          code?: string;
          details?: unknown;
        };
        const response = NextResponse.json(
          {
            success: false,
            error: apiError.message,
            code: apiError.code,
            details: apiError.details,
          },
          { status: apiError.statusCode }
        );
        return addSecurityHeaders(response, { remaining: 0 });
      }

      const response = NextResponse.json(
        {
          success: false,
          error: "Internal server error",
          code: "INTERNAL_ERROR",
        },
        { status: 500 }
      );
      return addSecurityHeaders(response, { remaining: 0 });
    }
  };
}
