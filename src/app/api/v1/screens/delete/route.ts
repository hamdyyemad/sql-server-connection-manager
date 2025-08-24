import { NextRequest } from "next/server";
import {
  createDatabaseRouteHandler,
  withDatabaseErrorHandler,
  deleteScreenHandler,
} from "@/backend_lib";

const errorHandledHandler = withDatabaseErrorHandler(deleteScreenHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);

export async function POST(request: NextRequest) {
  return handler(request);
} 