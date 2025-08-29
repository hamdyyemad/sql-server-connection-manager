import { NextRequest, NextResponse } from "next/server";
import { withDatabase, type DatabaseHandler } from "./database";

export interface RouteMiddlewareConfig {
  requireDatabase?: boolean;
  requireAuth?: boolean;
  customMiddleware?: (req: NextRequest) => Promise<NextRequest | NextResponse>;
}

export type RouteHandler = (req: NextRequest) => Promise<NextResponse>;

export function createRouteHandler(
  handler: RouteHandler | DatabaseHandler,
  config: RouteMiddlewareConfig = {}
): RouteHandler {
  return async (request: NextRequest) => {
    try {
      // Apply custom middleware if provided
      if (config.customMiddleware) {
        const middlewareResult = await config.customMiddleware(request);
        if (middlewareResult instanceof NextResponse) {
          return middlewareResult;
        }
        request = middlewareResult;
      }

      // Apply authentication middleware if required
      if (config.requireAuth) {
        const authResult = await handleAuthentication(request);
        if (authResult) {
          return authResult;
        }
      }

      // Apply database middleware if required
      if (config.requireDatabase) {
        const result = await withDatabase(request, handler as DatabaseHandler);

        if (result.success) {
          return NextResponse.json(result, { status: 200 });
        } else {
          return NextResponse.json(result, { status: 400 });
        }
      }

      // Handle regular route handler
      return await (handler as RouteHandler)(request);
    } catch (error) {
      console.error("Route middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

// Authentication middleware (placeholder for future implementation)
async function handleAuthentication(
  request: NextRequest
): Promise<NextResponse | null> {
  // TODO: Implement authentication logic
  // For now, return null to continue processing
  return null;
}

// Database route matcher
export function isDatabaseRoute(pathname: string): boolean {
  return pathname.startsWith("/api/v1/") && !pathname.includes("/auth/");
}

// Create database route handler (for routes that need database connection)
export function createDatabaseRouteHandler(
  handler: DatabaseHandler
): RouteHandler {
  return createRouteHandler(handler, { requireDatabase: true });
}

// Create regular route handler (for routes that don't need database)
export function createRegularRouteHandler(handler: RouteHandler): RouteHandler {
  return createRouteHandler(handler, { requireDatabase: false });
}
