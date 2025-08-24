/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

export class ApiError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, code?: string, details?: any): ApiError {
    return new ApiError(message, 400, code, details);
  }

  static unauthorized(
    message: string = "Unauthorized",
    code?: string,
    details?: any
  ): ApiError {
    return new ApiError(message, 401, code, details);
  }

  static forbidden(
    message: string = "Forbidden",
    code?: string,
    details?: any
  ): ApiError {
    return new ApiError(message, 403, code, details);
  }

  static notFound(
    message: string = "Not found",
    code?: string,
    details?: any
  ): ApiError {
    return new ApiError(message, 404, code, details);
  }

  static internal(
    message: string = "Internal server error",
    code?: string,
    details?: any
  ): ApiError {
    return new ApiError(message, 500, code, details);
  }

  static database(message: string, code?: string, details?: any): ApiError {
    return new ApiError(message, 500, code || "DATABASE_ERROR", details);
  }

  static tooManyRequests(
    message: string = "Too many requests",
    code?: string,
    details?: any
  ): ApiError {
    return new ApiError(message, 429, code || "RATE_LIMIT_EXCEEDED", details);
  }
}

export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<ApiResponse>
) {
  return async (...args: T): Promise<ApiResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("Error in handler:", error);

      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
        };
      }

      // Handle database-specific errors
      if (error instanceof Error) {
        const errorMessage = error.message;

        if (
          errorMessage.includes("Could not connect") ||
          errorMessage.includes("Login failed") ||
          errorMessage.includes("Windows Authentication")
        ) {
          return {
            success: false,
            error: errorMessage,
            code: "DATABASE_CONNECTION_ERROR",
          };
        }
      }

      // Handle unknown errors
      return {
        success: false,
        error: "An unexpected error occurred",
        code: "INTERNAL_ERROR",
      };
    }
  };
}

export function createErrorResponse(error: ApiError): NextResponse {
  const response: ErrorResponse = {
    success: false,
    error: error.message,
    code: error.code,
  };

  if (error.details) {
    response.details = error.details;
  }

  return NextResponse.json(response, { status: error.statusCode });
}

export function createSuccessResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };

  return NextResponse.json(response, { status: statusCode });
}

// Helper function to convert DatabaseResponse to ApiResponse
export function convertDatabaseResponse(dbResponse: {
  success: boolean;
  data?: any;
  error?: string;
}): ApiResponse {
  if (dbResponse.success) {
    return {
      success: true,
      data: dbResponse.data,
    };
  } else {
    return {
      success: false,
      error: dbResponse.error || "Unknown database error",
      code: "DATABASE_ERROR",
    };
  }
}

// Specialized error handler for database handlers
export function withDatabaseErrorHandler<T extends any[]>(
  handler: (
    ...args: T
  ) => Promise<{ success: boolean; data?: any; error?: string }>
) {
  return async (
    ...args: T
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("Error in database handler:", error);

      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Handle database-specific errors
      if (error instanceof Error) {
        const errorMessage = error.message;

        if (
          errorMessage.includes("Could not connect") ||
          errorMessage.includes("Login failed") ||
          errorMessage.includes("Windows Authentication")
        ) {
          return {
            success: false,
            error: errorMessage,
          };
        }
      }

      // Handle unknown errors
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  };
}
