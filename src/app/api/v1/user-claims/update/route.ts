import { NextRequest } from "next/server";
import {
  createDatabaseRouteHandler,
  withDatabaseErrorHandler,
  updateUserClaimHandler,
} from "@/backend_lib";

const errorHandledHandler = withDatabaseErrorHandler(updateUserClaimHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);

export async function POST(request: NextRequest) {
  return handler(request);
} 