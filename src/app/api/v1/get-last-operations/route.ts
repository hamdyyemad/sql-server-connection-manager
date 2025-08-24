import { NextRequest } from "next/server";
import {
  createDatabaseRouteHandler,
  withDatabaseErrorHandler,
} from "@/backend_lib";
import { getLastOperationsHandler } from "@/backend_lib/handlers/get-last-operations";

// Wrap the handler with database error handling middleware
const errorHandledHandler = withDatabaseErrorHandler(getLastOperationsHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);

export async function POST(request: NextRequest) {
  return handler(request);
}
