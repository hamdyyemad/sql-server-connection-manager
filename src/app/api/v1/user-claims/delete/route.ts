import { NextRequest } from "next/server";
import {
  createDatabaseRouteHandler,
  withDatabaseErrorHandler,
  deleteUserClaimHandler,
} from "@/backend_lib";

const errorHandledHandler = withDatabaseErrorHandler(deleteUserClaimHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);

export async function POST(request: NextRequest) {
  return handler(request);
} 