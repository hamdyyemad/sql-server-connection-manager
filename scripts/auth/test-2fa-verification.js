const speakeasy = require("speakeasy");
const fs = require("fs");
const path = require("path");

// Function to read .env.local file
function readEnvFile() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.log("❌ .env.local file not found");
    return {};
  }

  const envContent = fs.readFileSync(envPath, "utf8");
  const envVars = {};

  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join("=").trim();
    }
  });

  return envVars;
}

// Function to generate current TOTP
function generateCurrentTOTP(secret) {
  return speakeasy.totp({
    secret: secret,
    encoding: "base32",
  });
}

// Function to generate TOTP for a specific time
function generateTOTPForTime(secret, time) {
  return speakeasy.totp({
    secret: secret,
    encoding: "base32",
    time: time,
  });
}

// Main function
function main() {
  console.log("🔍 2FA Verification Test Script\n");

  // Read environment variables
  const envVars = readEnvFile();

  console.log("📋 Environment Variables:");
  console.log("ENABLED_2FA_USERS:", envVars.ENABLED_2FA_USERS || "Not set");

  // Check for 2FA secrets
  const secretKeys = Object.keys(envVars).filter((key) =>
    key.endsWith("_2FA_SECRET")
  );
  console.log("\n🔑 2FA Secrets found:");
  secretKeys.forEach((key) => {
    const username = key.replace("_2FA_SECRET", "").toLowerCase();
    const secret = envVars[key];
    console.log(`  ${username}: ${secret ? "✅ Set" : "❌ Not set"}`);

    if (secret) {
      // Generate current TOTP
      const currentOTP = generateCurrentTOTP(secret);
      console.log(`    Current OTP: ${currentOTP}`);

      // Generate OTPs for the last 2 and next 2 time steps
      const now = Math.floor(Date.now() / 1000);
      const timeStep = 30; // 30 seconds per TOTP

      console.log("    Recent/Upcoming OTPs:");
      for (let i = -2; i <= 2; i++) {
        const time = now + i * timeStep;
        const otp = generateTOTPForTime(secret, time);
        const timeLabel =
          i === 0 ? "Current" : i < 0 ? `${Math.abs(i)} ago` : `in ${i}`;
        console.log(`      ${timeLabel}: ${otp}`);
      }
    }
  });

  if (secretKeys.length === 0) {
    console.log("  No 2FA secrets found in .env.local");
    console.log("\n💡 To set up 2FA:");
    console.log("  1. Run your app and go to /2fa-setup");
    console.log("  2. Scan the QR code with your authenticator app");
    console.log("  3. The secret will be stored in .env.local");
  }

  console.log("\n✅ Test script completed");
}

// Run the script
main();
