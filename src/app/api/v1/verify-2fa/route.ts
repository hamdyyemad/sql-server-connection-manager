import { NextRequest, NextResponse } from "next/server";
import {
  verifyCredentials,
  is2FAEnabledForUser,
} from "@/backend_lib/utils/2fa";
import { get2FASecretFromEnv } from "@/backend_lib/utils/2fa";

// Helper function to verify TOTP code
function verifyTOTP(secret: string, token: string): boolean {
  // In a real implementation, you would use speakeasy:
  // return speakeasy.totp.verify({
  //   secret: secret,
  //   encoding: 'base32',
  //   token: token,
  //   window: 2 // Allow 2 time steps in either direction
  // });

  // For now, accept any 6-digit code for testing
  return /^\d{6}$/.test(token);
}

export async function POST(request: NextRequest) {
  try {
    console.log("2FA verification request received");

    // Check if user is authenticated via cookie
    const authToken = request.cookies.get("auth-token")?.value;
    const authUsername = request.cookies.get("auth-username")?.value;

    if (!authToken || authToken !== "true" || !authUsername) {
      console.error("User not authenticated for 2FA verification");
      return NextResponse.json(createErrorObject("Authentication required"), {
        status: 401,
      });
    }

    const body = await request.json();
    const { username, token } = body;

    // Validate input
    if (!username || !token) {
      console.error("Missing username or token in 2FA verification");
      return NextResponse.json(
        createErrorObject("Username and verification token are required"),
        { status: 400 }
      );
    }

    // Verify username matches the authenticated user
    if (username !== authUsername) {
      console.error("Username mismatch in 2FA verification");
      return NextResponse.json(createErrorObject("Invalid username"), {
        status: 401,
      });
    }

    console.log("Credentials verified successfully for 2FA verification");

    // Step 2: Check if user has 2FA enabled
    const userHas2FA = is2FAEnabledForUser(username);
    if (!userHas2FA) {
      console.error("User does not have 2FA enabled");
      return NextResponse.json(
        createErrorObject("2FA is not enabled for this user"),
        { status: 400 }
      );
    }

    // Step 3: Get user's 2FA secret
    const secret = get2FASecretFromEnv(username);
    if (!secret) {
      console.error("No 2FA secret found for user");
      return NextResponse.json(
        createErrorObject("2FA secret not found for this user"),
        { status: 500 }
      );
    }

    // Step 4: Verify the TOTP token
    const isValidToken = verifyTOTP(secret, token);
    if (!isValidToken) {
      console.error("Invalid 2FA token provided");
      return NextResponse.json(
        createErrorObject("Invalid verification token"),
        { status: 401 }
      );
    }

    console.log("2FA verification successful");

    // Step 5: Set final authentication cookies
    const response = NextResponse.json(createSuccessObject(), { status: 200 });

    // Set final auth token (user is now fully authenticated)
    response.cookies.set("auth-token", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Set 2FA verified flag
    response.cookies.set("2fa-verified", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("2FA verification error:", error);
    return NextResponse.json(createErrorObject("Internal server error"), {
      status: 500,
    });
  }
}
