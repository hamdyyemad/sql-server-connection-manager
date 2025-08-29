import { NextRequest } from "next/server";
import {
  createDatabaseRouteHandler,
  withDatabaseErrorHandler,
  addUserClaimHandler,
} from "@/backend_lib";

const errorHandledHandler = withDatabaseErrorHandler(addUserClaimHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);

export async function POST(request: NextRequest) {
  return handler(request);
} 