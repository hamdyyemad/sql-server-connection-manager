const { execSync } = require("child_process");
const path = require("path");

console.log("🧪 Testing Security Refactor...\n");

try {
  // Test TypeScript compilation
  console.log("📝 Testing TypeScript compilation...");
  execSync("npx tsc --noEmit", {
    cwd: path.join(__dirname, "../../"),
    stdio: "inherit",
  });
  console.log("✅ TypeScript compilation successful\n");

  // Test if the new files can be imported
  console.log("📦 Testing module imports...");

  // Test security utils import
  const securityUtils = require("../../src/backend_lib/utils/security-utils");
  console.log("✅ Security utils imported successfully");
  console.log(
    "   - Available functions:",
    Object.keys(securityUtils).join(", ")
  );

  // Test auth schemas import
  const authSchemas = require("../../src/backend_lib/validations/auth-schemas");
  console.log("✅ Auth schemas imported successfully");
  console.log(
    "   - Available schemas:",
    Object.keys(authSchemas.AuthSchemas).join(", ")
  );

  // Test middleware import
  const authSecurity = require("../../src/backend_lib/middleware/auth-security");
  console.log("✅ Auth security middleware imported successfully");
  console.log("   - Available exports:", Object.keys(authSecurity).join(", "));

  console.log("\n🎉 All tests passed! The refactor was successful.");
} catch (error) {
  console.error("\n❌ Test failed:", error.message);
  process.exit(1);
}
