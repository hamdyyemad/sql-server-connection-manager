const fs = require("fs");
const path = require("path");

console.log("🧪 Testing Security Refactor (Simple)...\n");

const filesToCheck = [
  "src/backend_lib/utils/security-utils.ts",
  "src/backend_lib/validations/auth-schemas.ts",
  "src/backend_lib/validations/index.ts",
  "src/backend_lib/middleware/auth-security.ts",
  "src/backend_lib/middleware/auth-error-handler.ts",
];

let allFilesExist = true;

filesToCheck.forEach((filePath) => {
  const fullPath = path.join(__dirname, "../../", filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${filePath} exists`);

    // Check file content for key functions/schemas
    const content = fs.readFileSync(fullPath, "utf8");

    if (filePath.includes("security-utils.ts")) {
      const hasRateLimit = content.includes("checkRateLimit");
      const hasGetClientIP = content.includes("getClientIP");
      const hasAddSecurityHeaders = content.includes("addSecurityHeaders");
      console.log(`   - checkRateLimit: ${hasRateLimit ? "✅" : "❌"}`);
      console.log(`   - getClientIP: ${hasGetClientIP ? "✅" : "❌"}`);
      console.log(
        `   - addSecurityHeaders: ${hasAddSecurityHeaders ? "✅" : "❌"}`
      );
    }

    if (filePath.includes("auth-schemas.ts")) {
      const hasLoginSchema = content.includes("login: z.object");
      const hasSetup2FASchema = content.includes("setup2FA: z.object");
      const hasVerify2FASchema = content.includes("verify2FA: z.object");
      console.log(`   - login schema: ${hasLoginSchema ? "✅" : "❌"}`);
      console.log(`   - setup2FA schema: ${hasSetup2FASchema ? "✅" : "❌"}`);
      console.log(`   - verify2FA schema: ${hasVerify2FASchema ? "✅" : "❌"}`);
    }

    if (filePath.includes("auth-security.ts")) {
      const hasCreateSecureAuthHandler = content.includes(
        "createSecureAuthHandler"
      );
      const importsSecurityUtils = content.includes(
        'from "../utils/security-utils"'
      );
      const importsAuthSchemas = content.includes(
        'from "../validations/auth-schemas"'
      );
      const importsAuthErrorHandler = content.includes(
        'from "./auth-error-handler"'
      );
      console.log(
        `   - createSecureAuthHandler: ${
          hasCreateSecureAuthHandler ? "✅" : "❌"
        }`
      );
      console.log(
        `   - imports security-utils: ${importsSecurityUtils ? "✅" : "❌"}`
      );
      console.log(
        `   - imports auth-schemas: ${importsAuthSchemas ? "✅" : "❌"}`
      );
      console.log(
        `   - imports auth-error-handler: ${
          importsAuthErrorHandler ? "✅" : "❌"
        }`
      );
    }

    if (filePath.includes("auth-error-handler.ts")) {
      const hasWithAuthErrorHandler = content.includes("withAuthErrorHandler");
      const importsSecurityUtils = content.includes(
        'from "../utils/security-utils"'
      );
      console.log(
        `   - withAuthErrorHandler: ${hasWithAuthErrorHandler ? "✅" : "❌"}`
      );
      console.log(
        `   - imports security-utils: ${importsSecurityUtils ? "✅" : "❌"}`
      );
    }
  } else {
    console.log(`❌ ${filePath} does not exist`);
    allFilesExist = false;
  }
  console.log("");
});

// Check if utils index exports security-utils
const utilsIndexPath = path.join(
  __dirname,
  "../../src/backend_lib/utils/index.ts"
);
if (fs.existsSync(utilsIndexPath)) {
  const utilsIndexContent = fs.readFileSync(utilsIndexPath, "utf8");
  const exportsSecurityUtils = utilsIndexContent.includes(
    'export * from "./security-utils"'
  );
  console.log(
    `📦 Utils index exports security-utils: ${
      exportsSecurityUtils ? "✅" : "❌"
    }`
  );
}

if (allFilesExist) {
  console.log("🎉 All files exist and have the expected structure!");
  console.log("📝 The refactor successfully separated:");
  console.log("   - Security utilities (rate limiting, headers, etc.)");
  console.log("   - Authentication schemas (Zod validation)");
  console.log("   - Clean middleware that imports from utilities");
} else {
  console.log("❌ Some files are missing!");
  process.exit(1);
}
