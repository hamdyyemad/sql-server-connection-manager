import { NextRequest } from "next/server";
import {
  createDatabaseRouteHandler,
  withDatabaseErrorHandler,
} from "@/backend_lib";

// Simple ping handler that just returns success
const pingHandler = async (req: any, pool: any) => {
  try {
    // Just return success - the middleware already established the connection
    return {
      success: true,
      data: {
        message: `Ping successful to ${req.dbConfig.server}`,
        timestamp: new Date().toISOString(),
        server: req.dbConfig.server,
        authType: req.dbConfig.authenticationType,
      },
    };
  } catch (error) {
    console.error("❌ Debug: Ping failed:", error);
    throw error;
  }
};

// Wrap the handler with database error handling middleware
const errorHandledHandler = withDatabaseErrorHandler(pingHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);

export async function POST(request: NextRequest) {
  return handler(request);
}
