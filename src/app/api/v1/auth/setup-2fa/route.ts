import { NextRequest, NextResponse } from "next/server";
import { createSecureAuthHandler } from "@/backend_lib/middleware/auth-security";
import { handle2FASetup } from "@/backend_lib/services/auth-admin/auth/auth-setup-2fa";

// Export the route handler with comprehensive security middleware
export const POST = createSecureAuthHandler(handle2FASetup, "setup2FA");
