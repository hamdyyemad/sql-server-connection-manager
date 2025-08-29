#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Function to generate a secure JWT secret
function generateJWTSecret() {
  return crypto.randomBytes(32).toString("hex");
}

// Function to create .env file
function createEnvFile() {
  console.log("🔧 Creating .env file...\n");

  const envContent = `# Turso Database Configuration
TURSO_DATABASE_URL=PUT_YOUR_CONNECTION_HERE
TURSO_AUTH_TOKEN=PUT_YOUR_TOKEN_HERE

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_SALT=admin123

# Application Configuration
NEXT_PUBLIC_APP_NAME=Admin Panel
NEXT_PUBLIC_APP_ISSUER=Admin Panel

# Debug (optional)
DEBUG=true
NEXT_PUBLIC_DEBUG=true

# JWT Configuration
JWT_SECRET=${generateJWTSecret()}

# Session Configuration
SESSION_EXPIRY_HOURS=24
MAX_LOGIN_ATTEMPTS=5
RATE_LIMIT_WINDOW_HOURS=1
`;

  const envPath = path.join(process.cwd(), ".env");

  try {
    // Check if .env already exists
    if (fs.existsSync(envPath)) {
      console.log("⚠️  .env file already exists!");
      console.log("📁 Current location:", envPath);

      const backupPath = path.join(process.cwd(), ".env.backup");
      fs.copyFileSync(envPath, backupPath);
      console.log("💾 Backup created as .env.backup");

      const overwrite =
        process.argv.includes("--force") || process.argv.includes("-f");
      if (!overwrite) {
        console.log("\n💡 To overwrite existing .env file, run:");
        console.log("   node scripts/utils/create-env.js --force");
        console.log(
          "\n📝 Or manually update your existing .env file with the values above."
        );
        return false;
      }
    }

    // Write the .env file
    fs.writeFileSync(envPath, envContent);

    console.log("✅ .env file created successfully!");
    console.log("📁 Location:", envPath);

    console.log("\n📋 Next steps:");
    console.log(
      "1. Update TURSO_DATABASE_URL with your Turso connection string"
    );
    console.log("2. Update TURSO_AUTH_TOKEN with your Turso auth token");
    console.log("3. Customize other values as needed");
    console.log("4. Restart your development server");

    console.log("\n🔗 Get your Turso credentials from:");
    console.log("   https://dashboard.turso.tech/");

    console.log("\n⚠️  Important:");
    console.log(
      "- Keep your .env file secure and never commit it to version control"
    );
    console.log("- The JWT_SECRET has been auto-generated for security");
    console.log(
      "- Update ADMIN_USERNAME and ADMIN_PASSWORD_SALT for production"
    );

    return true;
  } catch (error) {
    console.error("❌ Error creating .env file:", error.message);
    return false;
  }
}

// Function to show help
function showHelp() {
  console.log("🔧 Create .env File - Help\n");
  console.log("Usage:");
  console.log(
    "  node scripts/utils/create-env.js          # Create new .env file"
  );
  console.log(
    "  node scripts/utils/create-env.js --force  # Overwrite existing .env"
  );
  console.log("  node scripts/utils/create-env.js --help   # Show this help\n");

  console.log("Description:");
  console.log("  Creates a .env file with all required environment variables");
  console.log("  for the QR Code Admin application.\n");

  console.log("Features:");
  console.log("  ✅ Auto-generates secure JWT secret");
  console.log("  ✅ Includes all required configuration");
  console.log("  ✅ Creates backup of existing .env files");
  console.log("  ✅ Provides helpful next steps");
}

// Main function
function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    return;
  }

  createEnvFile();
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createEnvFile, generateJWTSecret };
