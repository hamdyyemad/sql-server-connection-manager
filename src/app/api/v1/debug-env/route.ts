import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("🔍 Debug Environment Variables");
  console.log("=================================");
  
  // Check all relevant environment variables
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD_SALT: process.env.ADMIN_PASSWORD_SALT ? `${process.env.ADMIN_PASSWORD_SALT.substring(0, 20)}...` : 'NOT SET',
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH ? `${process.env.ADMIN_PASSWORD_HASH.substring(0, 30)}...` : 'NOT SET',
    ENABLED_2FA_USERS: process.env.ENABLED_2FA_USERS,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_ISSUER: process.env.NEXT_PUBLIC_APP_ISSUER,
    DEBUG: process.env.DEBUG,
    NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG
  };
  
  console.log("Environment variables:", envVars);
  
  // Test credential verification
  const testCredentials = {
    username: "admin",
    password: "admin123"
  };
  
  console.log("Testing credentials:", testCredentials);
  
  // Simple credential check
  const envUsername = process.env.ADMIN_USERNAME;
  const envPasswordSalt = process.env.ADMIN_PASSWORD_SALT;
  const envPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  
  console.log("Raw environment values:");
  console.log("  - ADMIN_USERNAME:", envUsername);
  console.log("  - ADMIN_PASSWORD_SALT:", envPasswordSalt);
  console.log("  - ADMIN_PASSWORD_HASH:", envPasswordHash);
  
  const result = {
    environmentVariables: envVars,
    credentialTest: {
      usernameMatch: testCredentials.username === envUsername,
      passwordSaltExists: !!envPasswordSalt,
      passwordHashExists: !!envPasswordHash,
      passwordHashLength: envPasswordHash?.length || 0
    },
    rawValues: {
      adminUsername: envUsername,
      adminPasswordSalt: envPasswordSalt,
      adminPasswordHash: envPasswordHash
    }
  };
  
  return NextResponse.json(result);
}
