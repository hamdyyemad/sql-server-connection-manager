import { NextRequest } from "next/server";
import {
  createDatabaseRouteHandler,
  resetUserPasswordHandler,
  withDatabaseErrorHandler,
} from "@/backend_lib";

// Wrap the handler with database error handling middleware
const errorHandledHandler = withDatabaseErrorHandler(resetUserPasswordHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);

export async function POST(request: NextRequest) {
  return handler(request);
}
