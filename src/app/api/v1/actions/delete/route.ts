import { NextRequest } from "next/server";
import {
  createDatabaseRouteHandler,
  withDatabaseErrorHandler,
  deleteActionHandler,
} from "@/backend_lib";

const errorHandledHandler = withDatabaseErrorHandler(deleteActionHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);

export async function POST(request: NextRequest) {
  return handler(request);
} 