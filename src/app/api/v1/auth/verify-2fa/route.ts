import { NextRequest, NextResponse } from "next/server";
import { createSecureAuthHandler } from "@/backend_lib/middleware/auth-security";
import { handle2FAVerification } from "@/backend_lib/services/auth-admin/auth/auth-verify-2fa";

// Export the route handler with comprehensive security middleware
export const POST = createSecureAuthHandler(handle2FAVerification, "verify2FA");
