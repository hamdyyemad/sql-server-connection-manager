import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, isFirst2FASetup } from "@/backend_lib/utils/2fa";
import {
  generate2FASecret,
  generateQRCode,
  set2FASecretInEnv,
  get2FASecretFromEnv,
} from "@/backend_lib/utils/2fa";
import {
  createErrorObject,
  createSuccessObject,
} from "@/backend_lib/utils/responseUtils";

export async function POST(request: NextRequest) {
  try {
    console.log("2FA setup request received");

    // Check if user is authenticated via cookie
    const authToken = request.cookies.get("auth-token")?.value;
    const authUsername = request.cookies.get("auth-username")?.value;

    if (!authToken || authToken !== "true" || !authUsername) {
      console.error("User not authenticated for 2FA setup");
      return NextResponse.json(createErrorObject("Authentication required"), {
        status: 401,
      });
    }

    const body = await request.json();
    const { username } = body;

    // Validate input
    if (!username) {
      console.error("Missing username in 2FA setup");
      return NextResponse.json(createErrorObject("Username is required"), {
        status: 400,
      });
    }

    // Verify username matches the authenticated user
    if (username !== authUsername) {
      console.error("Username mismatch in 2FA setup");
      return NextResponse.json(createErrorObject("Invalid username"), {
        status: 401,
      });
    }

    console.log("Credentials verified successfully for 2FA setup");

    // Step 2: Check if this is the first 2FA setup ever
    const isFirstSetup = isFirst2FASetup();

    if (isFirstSetup) {
      console.log("First 2FA setup ever - generating new secret and QR code");

      // Generate new secret and QR code
      const secretObj = generate2FASecret();
      const qrCode = generateQRCode(
        username,
        secretObj.base32,
        secretObj.otpauth_url
      );

      // Store the secret in environment
      set2FASecretInEnv(username, secretObj.base32);

      return NextResponse.json({
        ...createSuccessObject(),
        secret: secretObj.base32,
        qrCode,
        isFirstSetup: true,
        message: "First 2FA setup - scan QR code to complete setup",
      });
    }

    // Step 3: Check if user already has 2FA enabled
    const existingSecret = get2FASecretFromEnv(username);

    if (existingSecret) {
      console.log(
        "User already has 2FA enabled - generating QR code with existing secret"
      );

      // Generate QR code with existing secret
      const qrCode = generateQRCode(username, existingSecret);

      return NextResponse.json({
        ...createSuccessObject(),
        secret: existingSecret,
        qrCode,
        isFirstSetup: false,
        message: "2FA already enabled - scan QR code to verify",
      });
    }

    // Step 4: User needs new 2FA setup
    console.log("User needs new 2FA setup - generating new secret and QR code");

    const secretObj = generate2FASecret();
    const qrCode = generateQRCode(
      username,
      secretObj.base32,
      secretObj.otpauth_url
    );

    // Store the secret in environment
    set2FASecretInEnv(username, secretObj.base32);

    return NextResponse.json({
      ...createSuccessObject(),
      secret: secretObj.base32,
      qrCode,
      isFirstSetup: false,
      message: "2FA setup required - scan QR code to complete setup",
    });
  } catch (error) {
    console.error("2FA setup error:", error);
    return NextResponse.json(createErrorObject("Internal server error"), {
      status: 500,
    });
  }
}
