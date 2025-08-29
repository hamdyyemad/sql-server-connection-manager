import { NextRequest } from "next/server";
import {
  createDatabaseRouteHandler,
  withDatabaseErrorHandler,
  updateScreenHandler,
} from "@/backend_lib";

const errorHandledHandler = withDatabaseErrorHandler(updateScreenHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);

export async function POST(request: NextRequest) {
  return handler(request);
} 