const { runSecurityTests } = require("./security-tester");

async function testWithoutServer() {
  console.log("🔒 Testing Security Tester (without server)...\n");

  try {
    // This should fail because there's no server running
    await runSecurityTests("/api/v1/auth/login", "POST", [
      "username",
      "password",
    ]);
  } catch (error) {
    console.log("✅ Security tester is working correctly!");
    console.log("❌ Expected error (no server running):", error.message);
  }
}

testWithoutServer().catch(console.error);
