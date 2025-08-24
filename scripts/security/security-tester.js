const axios = require("axios");

// Configuration
let BASE_URL = process.env.BASE_URL || "http://localhost:3000";
let DEFAULT_TIMEOUT = 5000;
const RATE_LIMIT_DELAY = 1000; // 1 second between requests

// SQL Injection payloads
const SQL_INJECTION_PAYLOADS = [
  "' OR '1'='1",
  "' OR 1=1--",
  "'; DROP TABLE users;--",
  "' UNION SELECT * FROM users--",
  "admin'--",
  "admin'/*",
  "' OR 'x'='x",
  "1' OR '1' = '1' #",
  "1' OR '1' = '1' /*",
  "1' OR '1' = '1' --",
  "1' OR '1' = '1'/**/",
  "1' OR '1' = '1' UNION SELECT 1,2,3--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7,8--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7,8,9--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7,8,9,10--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11,12--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19--",
  "1' OR '1' = '1' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20--",
];

// XSS payloads
const XSS_PAYLOADS = [
  "<script>alert('XSS')</script>",
  "<img src=x onerror=alert('XSS')>",
  "javascript:alert('XSS')",
  "<svg onload=alert('XSS')>",
  "<iframe src=javascript:alert('XSS')>",
  "<body onload=alert('XSS')>",
  "<input onfocus=alert('XSS') autofocus>",
  "<select onfocus=alert('XSS') autofocus>",
  "<textarea onfocus=alert('XSS') autofocus>",
  "<keygen onfocus=alert('XSS') autofocus>",
  "<video><source onerror=alert('XSS')>",
  "<audio src=x onerror=alert('XSS')>",
  "<details open ontoggle=alert('XSS')>",
  "<marquee onstart=alert('XSS')>",
  "<meter value=2 min=0 max=10 onmouseover=alert('XSS')>",
  "<progress value=70 max=100 onmouseover=alert('XSS')>",
  "<time onmouseover=alert('XSS')>",
  "<wbr onmouseover=alert('XSS')>",
  "<canvas onmouseover=alert('XSS')>",
  "<svg><animate onbegin=alert('XSS') attributeName=x dur=1s>",
];

// NoSQL Injection payloads
const NOSQL_INJECTION_PAYLOADS = [
  '{"$gt": ""}',
  '{"$ne": null}',
  '{"$where": "1==1"}',
  '{"$regex": ".*"}',
  '{"$exists": true}',
  '{"$type": 2}',
  '{"$in": ["admin", "user"]}',
  '{"$nin": []}',
  '{"$all": ["admin"]}',
  '{"$elemMatch": {"$gt": 0}}',
];

// Command Injection payloads
const COMMAND_INJECTION_PAYLOADS = [
  "; ls -la",
  "| whoami",
  "& dir",
  "`id`",
  "$(whoami)",
  "; cat /etc/passwd",
  "| netstat -an",
  "& type C:\\Windows\\System32\\drivers\\etc\\hosts",
  "`uname -a`",
  "$(ps aux)",
];

// Path Traversal payloads
const PATH_TRAVERSAL_PAYLOADS = [
  "../../../etc/passwd",
  "..\\..\\..\\Windows\\System32\\drivers\\etc\\hosts",
  "....//....//....//etc/passwd",
  "..%2F..%2F..%2Fetc%2Fpasswd",
  "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
  "..%252F..%252F..%252Fetc%252Fpasswd",
  "..%c0%af..%c0%af..%c0%afetc%c0%afpasswd",
  "..%255c..%255c..%255cWindows%255cSystem32%255cdrivers%255cetc%255chosts",
];

// LDAP Injection payloads
const LDAP_INJECTION_PAYLOADS = [
  "*)(uid=*))(|(uid=*",
  "*)(|(password=*))",
  "*)(|(objectclass=*))",
  "*)(|(cn=*))",
  "*)(|(mail=*))",
  "*)(|(sn=*))",
  "*)(|(givenName=*))",
  "*)(|(telephoneNumber=*))",
  "*)(|(memberOf=*))",
  "*)(|(userPassword=*))",
];

// Utility functions
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(message, type = "info") {
  const timestamp = new Date().toISOString();
  const colors = {
    info: "\x1b[36m", // Cyan
    success: "\x1b[32m", // Green
    warning: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    reset: "\x1b[0m", // Reset
  };
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

function generateRandomString(length = 10) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

// Test functions
async function testSQLInjection(endpoint, method, bodyKeys) {
  log("🔍 Testing SQL Injection vulnerabilities...", "info");

  const results = [];

  for (const payload of SQL_INJECTION_PAYLOADS) {
    for (const key of bodyKeys) {
      try {
        const testBody = {};
        bodyKeys.forEach((k) => {
          testBody[k] = k === key ? payload : "test";
        });

        const response = await axios({
          method: method.toLowerCase(),
          url: `${BASE_URL}${endpoint}`,
          data: testBody,
          timeout: DEFAULT_TIMEOUT,
          validateStatus: () => true, // Don't throw on any status
        });

        // Check for potential SQL injection indicators
        const isVulnerable =
          response.status === 200 &&
          (response.data.includes("error") ||
            response.data.includes("sql") ||
            response.data.includes("mysql") ||
            response.data.includes("sqlite") ||
            response.data.includes("database"));

        if (isVulnerable) {
          results.push({
            type: "SQL_INJECTION",
            key,
            payload,
            status: response.status,
            vulnerable: true,
            response: response.data,
          });
          log(
            `❌ SQL Injection detected in ${key} with payload: ${payload}`,
            "error"
          );
        }

        await sleep(100); // Small delay between requests
      } catch (error) {
        log(
          `⚠️ Error testing SQL injection on ${key}: ${error.message}`,
          "warning"
        );
      }
    }
  }

  return results;
}

async function testXSS(endpoint, method, bodyKeys) {
  log("🔍 Testing XSS vulnerabilities...", "info");

  const results = [];

  for (const payload of XSS_PAYLOADS) {
    for (const key of bodyKeys) {
      try {
        const testBody = {};
        bodyKeys.forEach((k) => {
          testBody[k] = k === key ? payload : "test";
        });

        const response = await axios({
          method: method.toLowerCase(),
          url: `${BASE_URL}${endpoint}`,
          data: testBody,
          timeout: DEFAULT_TIMEOUT,
          validateStatus: () => true,
        });

        // Check if payload is reflected in response
        const isVulnerable =
          response.data &&
          typeof response.data === "string" &&
          response.data.includes(payload.replace(/[<>'"]/g, ""));

        if (isVulnerable) {
          results.push({
            type: "XSS",
            key,
            payload,
            status: response.status,
            vulnerable: true,
            response: response.data,
          });
          log(
            `❌ XSS vulnerability detected in ${key} with payload: ${payload}`,
            "error"
          );
        }

        await sleep(100);
      } catch (error) {
        log(`⚠️ Error testing XSS on ${key}: ${error.message}`, "warning");
      }
    }
  }

  return results;
}

async function testNoSQLInjection(endpoint, method, bodyKeys) {
  log("🔍 Testing NoSQL Injection vulnerabilities...", "info");

  const results = [];

  for (const payload of NOSQL_INJECTION_PAYLOADS) {
    for (const key of bodyKeys) {
      try {
        const testBody = {};
        bodyKeys.forEach((k) => {
          testBody[k] = k === key ? JSON.parse(payload) : "test";
        });

        const response = await axios({
          method: method.toLowerCase(),
          url: `${BASE_URL}${endpoint}`,
          data: testBody,
          timeout: DEFAULT_TIMEOUT,
          validateStatus: () => true,
        });

        // Check for potential NoSQL injection indicators
        const isVulnerable =
          response.status === 200 &&
          (response.data.includes("error") ||
            response.data.includes("mongo") ||
            response.data.includes("database"));

        if (isVulnerable) {
          results.push({
            type: "NOSQL_INJECTION",
            key,
            payload,
            status: response.status,
            vulnerable: true,
            response: response.data,
          });
          log(
            `❌ NoSQL Injection detected in ${key} with payload: ${payload}`,
            "error"
          );
        }

        await sleep(100);
      } catch (error) {
        log(
          `⚠️ Error testing NoSQL injection on ${key}: ${error.message}`,
          "warning"
        );
      }
    }
  }

  return results;
}

async function testBruteForce(endpoint, method, bodyKeys, attempts = 10) {
  log(`🔍 Testing Brute Force attacks (${attempts} attempts)...`, "info");

  const results = [];
  let successCount = 0;

  for (let i = 0; i < attempts; i++) {
    try {
      const testBody = {};
      bodyKeys.forEach((key) => {
        // Generate random credentials for brute force
        if (key.toLowerCase().includes("password")) {
          testBody[key] = `password${i}`;
        } else if (key.toLowerCase().includes("user")) {
          testBody[key] = `user${i}`;
        } else {
          testBody[key] = `test${i}`;
        }
      });

      const response = await axios({
        method: method.toLowerCase(),
        url: `${BASE_URL}${endpoint}`,
        data: testBody,
        timeout: DEFAULT_TIMEOUT,
        validateStatus: () => true,
      });

      if (response.status === 200) {
        successCount++;
        results.push({
          type: "BRUTE_FORCE",
          attempt: i + 1,
          status: response.status,
          vulnerable: true,
          response: response.data,
        });
        log(`❌ Brute force attempt ${i + 1} succeeded`, "error");
      }

      await sleep(RATE_LIMIT_DELAY);
    } catch (error) {
      log(
        `⚠️ Error in brute force attempt ${i + 1}: ${error.message}`,
        "warning"
      );
    }
  }

  if (successCount > 0) {
    log(
      `❌ Brute force vulnerability detected: ${successCount}/${attempts} attempts succeeded`,
      "error"
    );
  } else {
    log(`✅ Brute force protection appears to be working`, "success");
  }

  return results;
}

async function testRateLimiting(endpoint, method, bodyKeys, requests = 20) {
  log(`🔍 Testing Rate Limiting (${requests} rapid requests)...`, "info");

  const results = [];
  const promises = [];

  // Send rapid requests
  for (let i = 0; i < requests; i++) {
    const testBody = {};
    bodyKeys.forEach((key) => {
      testBody[key] = `test${i}`;
    });

    promises.push(
      axios({
        method: method.toLowerCase(),
        url: `${BASE_URL}${endpoint}`,
        data: testBody,
        timeout: DEFAULT_TIMEOUT,
        validateStatus: () => true,
      }).catch((error) => ({ error: error.message }))
    );
  }

  const responses = await Promise.all(promises);

  let rateLimitedCount = 0;
  let successCount = 0;

  responses.forEach((response, index) => {
    if (response.error) {
      log(`⚠️ Request ${index + 1} failed: ${response.error}`, "warning");
    } else if (response.status === 429) {
      rateLimitedCount++;
      results.push({
        type: "RATE_LIMITING",
        request: index + 1,
        status: response.status,
        rateLimited: true,
      });
    } else if (response.status === 200) {
      successCount++;
    }
  });

  if (rateLimitedCount > 0) {
    log(
      `✅ Rate limiting is working: ${rateLimitedCount} requests were rate limited`,
      "success"
    );
  } else {
    log(
      `❌ Rate limiting may not be working: ${successCount} requests succeeded`,
      "error"
    );
  }

  return results;
}

async function testInputValidation(endpoint, method, bodyKeys) {
  log("🔍 Testing Input Validation...", "info");

  const testCases = [
    { type: "EMPTY_STRING", value: "" },
    { type: "NULL", value: null },
    { type: "UNDEFINED", value: undefined },
    { type: "LONG_STRING", value: "a".repeat(10000) },
    { type: "SPECIAL_CHARS", value: "!@#$%^&*()_+-=[]{}|;:,.<>?" },
    { type: "UNICODE", value: "🚀🎉💻" },
    { type: "SQL_KEYWORDS", value: "SELECT UNION INSERT UPDATE DELETE DROP" },
    { type: "SCRIPT_TAGS", value: '<script>alert("test")</script>' },
    { type: "COMMAND_INJECTION", value: "; ls -la" },
    { type: "PATH_TRAVERSAL", value: "../../../etc/passwd" },
  ];

  const results = [];

  for (const testCase of testCases) {
    for (const key of bodyKeys) {
      try {
        const testBody = {};
        bodyKeys.forEach((k) => {
          testBody[k] = k === key ? testCase.value : "test";
        });

        const response = await axios({
          method: method.toLowerCase(),
          url: `${BASE_URL}${endpoint}`,
          data: testBody,
          timeout: DEFAULT_TIMEOUT,
          validateStatus: () => true,
        });

        // Check if input validation is working
        const isVulnerable =
          response.status === 200 &&
          (response.data.includes("error") === false ||
            response.data.includes("validation") === false);

        if (isVulnerable) {
          results.push({
            type: "INPUT_VALIDATION",
            key,
            testCase: testCase.type,
            value: testCase.value,
            status: response.status,
            vulnerable: true,
            response: response.data,
          });
          log(
            `❌ Input validation failed for ${key} with ${testCase.type}`,
            "error"
          );
        }

        await sleep(100);
      } catch (error) {
        log(
          `⚠️ Error testing input validation on ${key}: ${error.message}`,
          "warning"
        );
      }
    }
  }

  return results;
}

// Main test function
async function runSecurityTests(endpoint, method, bodyKeys) {
  log(`🚀 Starting security tests for ${method} ${endpoint}`, "info");
  log(`📋 Testing keys: ${bodyKeys.join(", ")}`, "info");

  const allResults = [];

  try {
    // Test SQL Injection
    const sqlResults = await testSQLInjection(endpoint, method, bodyKeys);
    allResults.push(...sqlResults);

    // Test XSS
    const xssResults = await testXSS(endpoint, method, bodyKeys);
    allResults.push(...xssResults);

    // Test NoSQL Injection
    const nosqlResults = await testNoSQLInjection(endpoint, method, bodyKeys);
    allResults.push(...nosqlResults);

    // Test Brute Force
    const bruteForceResults = await testBruteForce(endpoint, method, bodyKeys);
    allResults.push(...bruteForceResults);

    // Test Rate Limiting
    const rateLimitResults = await testRateLimiting(endpoint, method, bodyKeys);
    allResults.push(...rateLimitResults);

    // Test Input Validation
    const validationResults = await testInputValidation(
      endpoint,
      method,
      bodyKeys
    );
    allResults.push(...validationResults);
  } catch (error) {
    log(`❌ Error during security testing: ${error.message}`, "error");
  }

  // Generate report
  const vulnerabilities = allResults.filter((r) => r.vulnerable);
  const totalTests = allResults.length;

  log(`\n📊 Security Test Report`, "info");
  log(`Total tests: ${totalTests}`, "info");
  log(
    `Vulnerabilities found: ${vulnerabilities.length}`,
    vulnerabilities.length > 0 ? "error" : "success"
  );

  if (vulnerabilities.length > 0) {
    log(`\n❌ Vulnerabilities found:`, "error");
    vulnerabilities.forEach((vuln, index) => {
      log(`${index + 1}. ${vuln.type} - ${vuln.key || "N/A"}`, "error");
      if (vuln.payload) {
        log(`   Payload: ${vuln.payload}`, "error");
      }
    });
  } else {
    log(`\n✅ No vulnerabilities detected!`, "success");
  }

  return allResults;
}

// Simple CLI interface
function showHelp() {
  console.log(`
🔒 Security Tester - Usage Examples:

1. Test login endpoint:
   node scripts/security/security-tester.js login

2. Test 2FA setup endpoint:
   node scripts/security/security-tester.js setup-2fa

3. Test 2FA verification endpoint:
   node scripts/security/security-tester.js verify-2fa

4. Test 2FA status check endpoint:
   node scripts/security/security-tester.js check-2fa-status

5. Test all endpoints:
   node scripts/security/security-tester.js all

6. Show this help:
   node scripts/security/security-tester.js help
`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (
    !command ||
    command === "help" ||
    command === "--help" ||
    command === "-h"
  ) {
    showHelp();
    return;
  }

  const endpoints = {
    login: {
      endpoint: "/api/v1/auth/login",
      method: "POST",
      bodyKeys: ["username", "password"],
      description: "Login endpoint",
    },
    "setup-2fa": {
      endpoint: "/api/v1/auth/setup-2fa",
      method: "POST",
      bodyKeys: ["userId", "verificationCode"],
      description: "2FA Setup endpoint",
    },
    "verify-2fa": {
      endpoint: "/api/v1/auth/verify-2fa",
      method: "POST",
      bodyKeys: ["userId", "verificationCode"],
      description: "2FA Verification endpoint",
    },
    "check-2fa-status": {
      endpoint: "/api/v1/auth/check-2fa-status",
      method: "POST",
      bodyKeys: ["username"],
      description: "2FA Status Check endpoint",
    },
  };

  if (command === "all") {
    console.log(
      "🔒 Testing All Authentication Endpoints for Security Vulnerabilities\n"
    );

    for (const [name, config] of Object.entries(endpoints)) {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`Testing: ${config.description}`);
      console.log(`Endpoint: ${config.method} ${config.endpoint}`);
      console.log(`Body Keys: ${config.bodyKeys.join(", ")}`);
      console.log(`${"=".repeat(60)}\n`);

      try {
        await runSecurityTests(config.endpoint, config.method, config.bodyKeys);
      } catch (error) {
        console.error(`❌ Error testing ${config.endpoint}: ${error.message}`);
      }
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log("📊 ALL TESTS COMPLETED");
    console.log(`${"=".repeat(60)}`);
    return;
  }

  const config = endpoints[command];
  if (!config) {
    console.error(`❌ Unknown command: ${command}`);
    showHelp();
    return;
  }

  console.log(`🔒 Testing: ${config.description}`);
  console.log(`Endpoint: ${config.method} ${config.endpoint}`);
  console.log(`Body Keys: ${config.bodyKeys.join(", ")}\n`);

  try {
    await runSecurityTests(config.endpoint, config.method, config.bodyKeys);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

// Export for use in other scripts
module.exports = {
  runSecurityTests,
  testSQLInjection,
  testXSS,
  testNoSQLInjection,
  testBruteForce,
  testRateLimiting,
  testInputValidation,
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
