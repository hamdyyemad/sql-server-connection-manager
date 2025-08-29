// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextRequest, NextResponse } from "next/server";
import { createSecureAuthHandler } from "@/backend_lib/middleware/auth-security";
import { handleLogin } from "@/backend_lib/services/auth-admin/auth/auth-login";

// Export the route handler with comprehensive security middleware
export const POST = createSecureAuthHandler(handleLogin, "login");
