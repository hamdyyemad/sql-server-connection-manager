import { NextRequest } from "next/server";
import { 
  createDatabaseRouteHandler, 
  getUserRolesHandler,
  withDatabaseErrorHandler 
} from "@/backend_lib";

// Wrap the handler with database error handling middleware
const errorHandledHandler = withDatabaseErrorHandler(getUserRolesHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);

export async function POST(request: NextRequest) {
  return handler(request);
}
