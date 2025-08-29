import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";

// Helper function to get 2FA secret from environment variables
const get2FASecretFromEnv = (username: string): string | null => {
  const envKey = `${username.toUpperCase()}_2FA_SECRET`;
  return process.env[envKey] || null;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required" },
        { status: 400 }
      );
    }

    const sanitizedUsername = username.trim();
    const secret = get2FASecretFromEnv(sanitizedUsername);

    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          error: "No 2FA secret found for this user. Please set up 2FA first.",
        },
        { status: 400 }
      );
    }

    // Generate current TOTP
    const currentOTP = speakeasy.totp({
      secret: secret,
      encoding: "base32",
    });

    // Generate OTPs for the last 2 and next 2 time steps
    const now = Math.floor(Date.now() / 1000);
    const timeStep = 30; // 30 seconds per TOTP

    const otps = {};
    for (let i = -2; i <= 2; i++) {
      const time = now + i * timeStep;
      const otp = speakeasy.totp({
        secret: secret,
        encoding: "base32",
        time: time,
      });
      const timeLabel =
        i === 0 ? "current" : i < 0 ? `${Math.abs(i)}_ago` : `in_${i}`;
      otps[timeLabel] = otp;
    }

    return NextResponse.json({
      success: true,
      data: {
        username: sanitizedUsername,
        currentOTP: currentOTP,
        allOTPs: otps,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Error generating test OTP:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to generate test OTP: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
