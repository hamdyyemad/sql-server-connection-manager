import { NextRequest, NextResponse } from "next/server";
import { createSecureAuthHandler } from "@/backend_lib/middleware/auth-security";
import { handle2FAStatusCheck } from "@/backend_lib/services/auth-admin/auth/auth-check-2fa-status";

// Export the route handler with comprehensive security middleware
export const POST = createSecureAuthHandler(
  handle2FAStatusCheck,
  "check2FAStatus"
);
