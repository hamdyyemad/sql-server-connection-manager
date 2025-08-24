import { NextRequest } from "next/server";
import {
  createDatabaseRouteHandler,
  withDatabaseErrorHandler,
  updateActionHandler,
} from "@/backend_lib";

const errorHandledHandler = withDatabaseErrorHandler(updateActionHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);

export async function POST(request: NextRequest) {
  return handler(request);
} 