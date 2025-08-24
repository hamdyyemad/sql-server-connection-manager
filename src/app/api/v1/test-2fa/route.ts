import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Simple test endpoint to verify 2FA setup
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "YourApp";
    const appIssuer = process.env.NEXT_PUBLIC_APP_ISSUER || "YourApp";

    // Generate a test QR code
    const secret = {
      base32: "JBSWY3DPEHPK3PXP",
      otpauth_url: `otpauth://totp/${appName}:test@example.com?secret=JBSWY3DPEHPK3PXP&issuer=${appIssuer}`,
    };

    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      secret.otpauth_url
    )}`;

    return NextResponse.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCode,
        otpauthUrl: secret.otpauth_url,
        message: "Test QR code generated successfully",
      },
    });
  } catch (error) {
    console.error("Test 2FA error:", error);
    return NextResponse.json({ error: "Test failed" }, { status: 500 });
  }
}
