const { runSecurityTests } = require("./security-tester");

// Test configuration
const AUTH_ENDPOINTS = [
  {
    endpoint: "/api/v1/auth/login",
    method: "POST",
    bodyKeys: ["username", "password"],
    description: "Login endpoint",
  },
  {
    endpoint: "/api/v1/auth/setup-2fa",
    method: "POST",
    bodyKeys: ["userId", "verificationCode"],
    description: "2FA Setup endpoint",
  },
  {
    endpoint: "/api/v1/auth/verify-2fa",
    method: "POST",
    bodyKeys: ["userId", "verificationCode"],
    description: "2FA Verification endpoint",
  },
  {
    endpoint: "/api/v1/auth/check-2fa-status",
    method: "POST",
    bodyKeys: ["username"],
    description: "2FA Status Check endpoint",
  },
];

async function testAllAuthEndpoints() {
  console.log(
    "🔒 Testing All Authentication Endpoints for Security Vulnerabilities\n"
  );

  const allResults = [];

  for (const config of AUTH_ENDPOINTS) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Testing: ${config.description}`);
    console.log(`Endpoint: ${config.method} ${config.endpoint}`);
    console.log(`Body Keys: ${config.bodyKeys.join(", ")}`);
    console.log(`${"=".repeat(60)}\n`);

    try {
      const results = await runSecurityTests(
        config.endpoint,
        config.method,
        config.bodyKeys
      );

      allResults.push({
        endpoint: config.endpoint,
        description: config.description,
        results,
      });
    } catch (error) {
      console.error(`❌ Error testing ${config.endpoint}: ${error.message}`);
    }
  }

  // Generate final report
  console.log(`\n${"=".repeat(60)}`);
  console.log("📊 FINAL SECURITY REPORT");
  console.log(`${"=".repeat(60)}`);

  const totalVulnerabilities = allResults.reduce((total, endpoint) => {
    const vulns = endpoint.results.filter((r) => r.vulnerable);
    return total + vulns.length;
  }, 0);

  const totalTests = allResults.reduce((total, endpoint) => {
    return total + endpoint.results.length;
  }, 0);

  console.log(`Total endpoints tested: ${allResults.length}`);
  console.log(`Total security tests: ${totalTests}`);
  console.log(`Total vulnerabilities found: ${totalVulnerabilities}`);

  if (totalVulnerabilities === 0) {
    console.log("\n✅ All authentication endpoints are secure!");
  } else {
    console.log("\n❌ Vulnerabilities found:");
    allResults.forEach((endpoint) => {
      const vulns = endpoint.results.filter((r) => r.vulnerable);
      if (vulns.length > 0) {
        console.log(`\n  ${endpoint.description} (${endpoint.endpoint}):`);
        vulns.forEach((vuln) => {
          console.log(`    - ${vuln.type}: ${vuln.key || "N/A"}`);
          if (vuln.payload) {
            console.log(`      Payload: ${vuln.payload}`);
          }
        });
      }
    });
  }

  console.log(`\n${"=".repeat(60)}`);
}

// Run the tests if called directly
if (require.main === module) {
  testAllAuthEndpoints().catch(console.error);
}

module.exports = { testAllAuthEndpoints };
