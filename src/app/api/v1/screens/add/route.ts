import { NextRequest } from "next/server";
import {
  createDatabaseRouteHandler,
  withDatabaseErrorHandler,
  addScreenHandler,
} from "@/backend_lib";

const errorHandledHandler = withDatabaseErrorHandler(addScreenHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);

export async function POST(request: NextRequest) {
  return handler(request);
} 