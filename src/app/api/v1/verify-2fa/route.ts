import { NextRequest, NextResponse } from "next/server";
import {
  createSuccessObject,
  createErrorObject,
} from "@/backend_lib/utils/responseUtils";
import { AuthService } from "@/backend_lib/services/auth-admin/auth/auth-service";
import { JWTUtils } from "@/backend_lib/utils/jwt";
import { CookieUtils } from "@/backend_lib/utils/cookie";

export async function POST(request: NextRequest) {
  try {
    console.log("2FA verification request received");

    // Check if user is authenticated via JWT token
    const authToken = request.cookies.get("auth-token")?.value;
    const authUsername = request.cookies.get("auth-username")?.value;

    if (!authToken || !authUsername) {
      console.error("User not authenticated for 2FA verification");
      return NextResponse.json(createErrorObject("Authentication required"), {
        status: 401,
      });
    }

    // Verify JWT token if it's a JWT token
    let userId: string;
    if (authToken.startsWith('eyJ')) {
      const decoded = JWTUtils.verifyToken(authToken);
      if (!decoded) {
        console.error("Invalid JWT token for 2FA verification");
        return NextResponse.json(createErrorObject("Invalid authentication token"), {
          status: 401,
        });
      }
      userId = decoded.userId;
    } else {
      // Legacy token handling
      userId = authToken;
    }

    const body = await request.json();
    const { verificationCode } = body;

    // Validate input
    if (!verificationCode) {
      console.error("Missing verification code in 2FA verification");
      return NextResponse.json(
        createErrorObject("Verification code is required"),
        { status: 400 }
      );
    }

    console.log("Processing 2FA verification for user:", userId);

    // Use the AuthService to verify 2FA
    const result = await AuthService.verify2FA(userId, verificationCode);

    if (!result.success) {
      console.error("2FA verification failed:", result.error);
      return NextResponse.json(
        createErrorObject(result.error || "2FA verification failed"),
        { status: 401 }
      );
    }

    console.log("2FA verification successful");

    // Get updated user status for JWT token
    const { check2FAStatusAction } = await import("@/backend_lib/actions/2fa");
    const userStatus = await check2FAStatusAction();

    if (!userStatus.success) {
      console.error("Failed to get user status after 2FA verification");
      return NextResponse.json(createErrorObject("Failed to complete authentication"), {
        status: 500,
      });
    }

    // Generate new JWT token with complete user status
    const jwtPayload = {
      userId: userId,
      username: authUsername,
      is2FAEnabled: userStatus.is2FAEnabled || false,
      hasSetup2FA: userStatus.hasSetup2FA || false,
      is2FAVerified: userStatus.is2FAVerified || false,
      needsVerification: false, // 2FA is now verified
      secret2FAHasValue: userStatus.secret2FAHasValue || false,
      tempSecret2FAHasValue: userStatus.tempSecret2FAHasValue || false,
    };
    
    const newJwtToken = JWTUtils.generateToken(jwtPayload);

    // Create response with new JWT token
    const response = NextResponse.json(createSuccessObject({ message: "2FA verification successful" }), { status: 200 });

    // Set new JWT token as auth-token cookie
    CookieUtils.set(response, "auth-token", newJwtToken);
    CookieUtils.set(response, "auth-username", authUsername);

    // Remove any legacy 2FA verification cookies
    response.cookies.delete("2fa-verified");
    response.cookies.delete("requires-2fa");

    return response;
  } catch (error) {
    console.error("2FA verification error:", error);
    return NextResponse.json(createErrorObject("Internal server error"), {
      status: 500,
    });
  }
}
