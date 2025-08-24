#!/usr/bin/env node

/**
 * Advanced SQL Injection Testing Script
 *
 * Usage:
 * node test-sql-injection-advanced.js <URL> <METHOD> <SCHEMA>
 *
 * Examples:
 * node test-sql-injection-advanced.js http://localhost:3000/api/v1/auth/login POST '{"username":"string","password":"string"}'
 * node test-sql-injection-advanced.js http://localhost:3000/api/v1/users GET
 * node test-sql-injection-advanced.js http://localhost:3000/api/v1/data POST '{"name":"string","age":"number","email":"string","isActive":"boolean"}'
 */

const https = require("https");
const http = require("http");
const { URL } = require("url");

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

// Available data types for payload generation
const DATA_TYPES = {
  // String types
  string: {
    description: "Text values",
    examples: ["admin", "user123", "test@example.com"],
    sqlInjectionPayloads: [
      "'1'='1",
      "'1'='1'",
      "'admin'='admin'",
      "'admin' OR '1'='1",
      "'admin' UNION SELECT",
      "'admin'; WAITFOR DELAY",
      "'admin'; DROP TABLE",
      "'admin'/*",
      "'admin'--",
      "'admin'#",
      "admin' OR '1'='1",
      "admin' UNION SELECT",
      "admin'; ls -la",
      "<script>alert('xss')</script>",
      "javascript:alert('xss')",
      "onload=alert('xss')",
      "'; DROP TABLE users; --",
      "'; INSERT INTO users VALUES ('hacker', 'password'); --",
      "'; UPDATE users SET password='hacked' WHERE username='admin'; --",
      "'; EXEC xp_cmdshell('dir'); --",
      "'; WAITFOR DELAY '00:00:05'; --",
      "'; BENCHMARK(1000000,MD5(1)); --",
      "'; SELECT SLEEP(5); --",
      "'; pg_sleep(5); --",
      "'; SELECT * FROM information_schema.tables; --",
      "'; SELECT * FROM users WHERE 1=1; --",
      "'; SELECT * FROM users WHERE 'a'='a'; --",
      "'; SELECT * FROM users WHERE 1=1 OR 'a'='a'; --",
    ],
  },

  // Number types
  number: {
    description: "Numeric values",
    examples: [1, 100, 3.14, -5],
    sqlInjectionPayloads: [
      "1 OR 1=1",
      "1' OR '1'='1",
      "1; DROP TABLE users; --",
      "1 UNION SELECT",
      "1' UNION SELECT",
      "1 AND 1=1",
      "1' AND '1'='1",
      "1 OR 1=1 OR 'a'='a",
      "1; WAITFOR DELAY '00:00:05'; --",
      "1; BENCHMARK(1000000,MD5(1)); --",
      "1; SELECT SLEEP(5); --",
      "1; pg_sleep(5); --",
      "1' OR 1=1 OR '1'='1",
      "1' AND 1=1 AND '1'='1",
      "1' UNION SELECT NULL,NULL,NULL--",
      "1' UNION SELECT username,password,NULL FROM users--",
      "1' ORDER BY 1--",
      "1' ORDER BY 2--",
      "1' GROUP BY 1--",
      "1' HAVING 1=1--",
    ],
  },

  // Boolean types
  boolean: {
    description: "True/False values",
    examples: [true, false, 1, 0],
    sqlInjectionPayloads: [
      "true OR 1=1",
      "false OR 1=1",
      "true' OR '1'='1",
      "false' OR '1'='1",
      "true; DROP TABLE users; --",
      "false; DROP TABLE users; --",
      "true UNION SELECT",
      "false UNION SELECT",
      "true AND 1=1",
      "false AND 1=1",
      "true' OR 1=1 OR 'a'='a",
      "false' OR 1=1 OR 'a'='a",
      "true; WAITFOR DELAY '00:00:05'; --",
      "false; WAITFOR DELAY '00:00:05'; --",
    ],
  },

  // Array types
  array: {
    description: "Array/list values",
    examples: [["item1", "item2"], [1, 2, 3], []],
    sqlInjectionPayloads: [
      ["admin' OR '1'='1", "password"],
      ["admin", "password' OR '1'='1"],
      ["admin' UNION SELECT", "password"],
      ["admin", "password' UNION SELECT"],
      ["admin'/*", "password"],
      ["admin", "password'/*"],
      ["admin'--", "password"],
      ["admin", "password'--"],
      ["admin'#", "password"],
      ["admin", "password'#"],
      ["admin'; DROP TABLE users; --", "password"],
      ["admin", "password'; DROP TABLE users; --"],
      ["admin'; WAITFOR DELAY '00:00:05'; --", "password"],
      ["admin", "password'; WAITFOR DELAY '00:00:05'; --"],
    ],
  },

  // Object types
  object: {
    description: "Object/dictionary values",
    examples: [
      { name: "John", age: 30 },
      { id: 1, active: true },
    ],
    sqlInjectionPayloads: [
      { username: "admin' OR '1'='1", password: "anything" },
      { username: "admin", password: "password' OR '1'='1" },
      { username: "admin' UNION SELECT", password: "anything" },
      { username: "admin", password: "password' UNION SELECT" },
      { username: "admin'/*", password: "anything" },
      { username: "admin", password: "password'/*" },
      { username: "admin'--", password: "anything" },
      { username: "admin", password: "password'--" },
      { username: "admin'#", password: "anything" },
      { username: "admin", password: "password'#" },
      { username: "admin'; DROP TABLE users; --", password: "anything" },
      { username: "admin", password: "password'; DROP TABLE users; --" },
      {
        username: "admin'; WAITFOR DELAY '00:00:05'; --",
        password: "anything",
      },
      {
        username: "admin",
        password: "password'; WAITFOR DELAY '00:00:05'; --",
      },
    ],
  },

  // Email types
  email: {
    description: "Email addresses",
    examples: ["user@example.com", "admin@test.org"],
    sqlInjectionPayloads: [
      "admin@test.com' OR '1'='1",
      "admin@test.com' UNION SELECT",
      "admin@test.com'/*",
      "admin@test.com'--",
      "admin@test.com'#",
      "admin@test.com'; DROP TABLE users; --",
      "admin@test.com'; WAITFOR DELAY '00:00:05'; --",
      "admin@test.com' OR 1=1 OR 'a'='a",
      "admin@test.com' AND 1=1 AND 'a'='a",
      "admin@test.com' ORDER BY 1--",
      "admin@test.com' GROUP BY 1--",
      "admin@test.com' HAVING 1=1--",
    ],
  },

  // Date types
  date: {
    description: "Date values",
    examples: ["2023-01-01", "2023-12-31T23:59:59Z"],
    sqlInjectionPayloads: [
      "2023-01-01' OR '1'='1",
      "2023-01-01' UNION SELECT",
      "2023-01-01'/*",
      "2023-01-01'--",
      "2023-01-01'#",
      "2023-01-01'; DROP TABLE users; --",
      "2023-01-01'; WAITFOR DELAY '00:00:05'; --",
      "2023-01-01' OR 1=1 OR 'a'='a",
      "2023-01-01' AND 1=1 AND 'a'='a",
    ],
  },

  // URL types
  url: {
    description: "URL values",
    examples: ["https://example.com", "http://localhost:3000"],
    sqlInjectionPayloads: [
      "https://example.com' OR '1'='1",
      "https://example.com' UNION SELECT",
      "https://example.com'/*",
      "https://example.com'--",
      "https://example.com'#",
      "https://example.com'; DROP TABLE users; --",
      "https://example.com'; WAITFOR DELAY '00:00:05'; --",
      "javascript:alert('xss')",
      "data:text/html,<script>alert('xss')</script>",
      "vbscript:alert('xss')",
      "onload=alert('xss')",
    ],
  },

  // Phone types
  phone: {
    description: "Phone numbers",
    examples: ["+1234567890", "123-456-7890"],
    sqlInjectionPayloads: [
      "+1234567890' OR '1'='1",
      "+1234567890' UNION SELECT",
      "+1234567890'/*",
      "+1234567890'--",
      "+1234567890'#",
      "+1234567890'; DROP TABLE users; --",
      "+1234567890'; WAITFOR DELAY '00:00:05'; --",
      "+1234567890' OR 1=1 OR 'a'='a",
      "+1234567890' AND 1=1 AND 'a'='a",
    ],
  },

  // ID types
  id: {
    description: "ID values",
    examples: [1, "user123", "abc-def-ghi"],
    sqlInjectionPayloads: [
      "1' OR '1'='1",
      "1' UNION SELECT",
      "1'/*",
      "1'--",
      "1'#",
      "1'; DROP TABLE users; --",
      "1'; WAITFOR DELAY '00:00:05'; --",
      "1' OR 1=1 OR 'a'='a",
      "1' AND 1=1 AND 'a'='a",
      "1' ORDER BY 1--",
      "1' GROUP BY 1--",
      "1' HAVING 1=1--",
      "user123' OR '1'='1",
      "user123' UNION SELECT",
      "user123'/*",
      "user123'--",
      "user123'#",
      "user123'; DROP TABLE users; --",
      "user123'; WAITFOR DELAY '00:00:05'; --",
    ],
  },
};

// Test results storage
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  blocked: 0,
  errors: 0,
  details: [],
};

// Helper function to make HTTP requests
function makeRequest(url, method, headers, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "SQL-Injection-Tester/1.0",
        ...headers,
      },
    };

    if (body) {
      options.headers["Content-Length"] = Buffer.byteLength(body);
    }

    const client = urlObj.protocol === "https:" ? https : http;
    const req = client.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          url: url,
          method: method,
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

// Helper function to check if response indicates SQL injection was blocked
function isSQLInjectionBlocked(response) {
  const body = response.body.toLowerCase();
  const statusCode = response.statusCode;

  // Check for security violation messages
  const securityKeywords = [
    "security violation",
    "sql injection",
    "malicious",
    "forbidden",
    "blocked",
    "invalid input",
    "suspicious pattern",
    "detected",
  ];

  // Check for error status codes
  const errorStatusCodes = [400, 401, 403, 422, 500];

  return (
    securityKeywords.some((keyword) => body.includes(keyword)) ||
    errorStatusCodes.includes(statusCode)
  );
}

// Helper function to check if response indicates successful authentication
function isAuthenticationSuccessful(response) {
  const body = response.body.toLowerCase();
  const statusCode = response.statusCode;

  // Check for success indicators
  const successKeywords = [
    "success",
    "authenticated",
    "login successful",
    "welcome",
    "dashboard",
  ];

  // Check for auth cookies
  const hasAuthCookies =
    response.headers["set-cookie"] &&
    response.headers["set-cookie"].some(
      (cookie) =>
        cookie.toLowerCase().includes("auth") ||
        cookie.toLowerCase().includes("token") ||
        cookie.toLowerCase().includes("session")
    );

  return (
    successKeywords.some((keyword) => body.includes(keyword)) ||
    (statusCode === 200 && hasAuthCookies)
  );
}

// Generate test payloads based on schema
function generateTestPayloads(schema) {
  const payloads = [];

  try {
    const schemaObj = typeof schema === "string" ? JSON.parse(schema) : schema;

    for (const [fieldName, fieldType] of Object.entries(schemaObj)) {
      const type = fieldType.toLowerCase();

      if (DATA_TYPES[type]) {
        const typePayloads = DATA_TYPES[type].sqlInjectionPayloads;

        for (const payload of typePayloads) {
          const testPayload = { ...schemaObj };

          // Generate valid values for other fields
          for (const [otherField, otherType] of Object.entries(schemaObj)) {
            if (otherField !== fieldName) {
              testPayload[otherField] = generateValidValue(otherType);
            }
          }

          // Set the malicious payload for the current field
          testPayload[fieldName] = payload;

          payloads.push({
            field: fieldName,
            type: type,
            payload: payload,
            fullPayload: testPayload,
            description: `Testing ${type} injection in ${fieldName} field`,
          });
        }
      } else {
        console.log(
          `${colors.yellow}Warning: Unknown type '${fieldType}' for field '${fieldName}'. Using 'string' type.${colors.reset}`
        );

        // Fallback to string type
        const typePayloads = DATA_TYPES.string.sqlInjectionPayloads;
        for (const payload of typePayloads) {
          const testPayload = { ...schemaObj };

          // Generate valid values for other fields
          for (const [otherField, otherType] of Object.entries(schemaObj)) {
            if (otherField !== fieldName) {
              testPayload[otherField] = generateValidValue(otherType);
            }
          }

          // Set the malicious payload for the current field
          testPayload[fieldName] = payload;

          payloads.push({
            field: fieldName,
            type: "string",
            payload: payload,
            fullPayload: testPayload,
            description: `Testing string injection in ${fieldName} field (fallback)`,
          });
        }
      }
    }
  } catch (error) {
    console.error(
      `${colors.red}Error parsing schema: ${error.message}${colors.reset}`
    );
    return [];
  }

  return payloads;
}

// Generate valid values for different types
function generateValidValue(type) {
  const typeLower = type.toLowerCase();

  switch (typeLower) {
    case "string":
      return "valid_string";
    case "number":
      return 123;
    case "boolean":
      return true;
    case "array":
      return ["item1", "item2"];
    case "object":
      return { key: "value" };
    case "email":
      return "user@example.com";
    case "date":
      return "2023-01-01";
    case "url":
      return "https://example.com";
    case "phone":
      return "+1234567890";
    case "id":
      return "valid_id";
    default:
      return "valid_value";
  }
}

// Run a single test
async function runTest(url, method, payload, testInfo) {
  const startTime = Date.now();

  try {
    const body =
      method.toUpperCase() !== "GET"
        ? JSON.stringify(payload.fullPayload)
        : null;
    const headers = {};

    // Add query parameters for GET requests
    let finalUrl = url;
    if (method.toUpperCase() === "GET" && payload.fullPayload) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(payload.fullPayload)) {
        params.append(key, value);
      }
      finalUrl = `${url}?${params.toString()}`;
    }

    const response = await makeRequest(finalUrl, method, headers, body);
    const duration = Date.now() - startTime;

    const isBlocked = isSQLInjectionBlocked(response);
    const isSuccessful = isAuthenticationSuccessful(response);

    const result = {
      testInfo,
      payload: payload.payload,
      field: payload.field,
      type: payload.type,
      fullPayload: payload.fullPayload,
      response: {
        statusCode: response.statusCode,
        body: response.body,
        headers: response.headers,
        duration,
      },
      isBlocked,
      isSuccessful,
      passed: isBlocked && !isSuccessful,
      timestamp: new Date().toISOString(),
    };

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    return {
      testInfo,
      payload: payload.payload,
      field: payload.field,
      type: payload.type,
      fullPayload: payload.fullPayload,
      error: error.message,
      duration,
      passed: false,
      timestamp: new Date().toISOString(),
    };
  }
}

// Display test results
function displayResults() {
  console.log(
    `\n${colors.bright}${colors.cyan}=== SQL INJECTION TEST RESULTS ===${colors.reset}\n`
  );

  console.log(`${colors.bright}Summary:${colors.reset}`);
  console.log(
    `  Total Tests: ${colors.white}${testResults.total}${colors.reset}`
  );
  console.log(
    `  Passed (Blocked): ${colors.green}${testResults.passed}${colors.reset}`
  );
  console.log(
    `  Failed (Not Blocked): ${colors.red}${testResults.failed}${colors.reset}`
  );
  console.log(`  Errors: ${colors.yellow}${testResults.errors}${colors.reset}`);

  if (testResults.total > 0) {
    const passRate = ((testResults.passed / testResults.total) * 100).toFixed(
      2
    );
    console.log(`  Pass Rate: ${colors.cyan}${passRate}%${colors.reset}`);
  }

  console.log(`\n${colors.bright}Detailed Results:${colors.reset}`);

  for (const result of testResults.details) {
    const status = result.passed
      ? `${colors.green}✓ BLOCKED${colors.reset}`
      : result.error
      ? `${colors.yellow}⚠ ERROR${colors.reset}`
      : `${colors.red}✗ NOT BLOCKED${colors.reset}`;

    console.log(`\n${status} - ${result.field} (${result.type})`);
    console.log(`  Payload: ${colors.magenta}${result.payload}${colors.reset}`);
    console.log(
      `  Status: ${colors.white}${result.response?.statusCode || "N/A"}${
        colors.reset
      }`
    );
    console.log(
      `  Duration: ${colors.white}${result.duration || "N/A"}ms${colors.reset}`
    );

    if (result.error) {
      console.log(`  Error: ${colors.yellow}${result.error}${colors.reset}`);
    } else if (result.response) {
      const responsePreview = result.response.body.substring(0, 200);
      console.log(
        `  Response: ${colors.white}${responsePreview}${
          responsePreview.length >= 200 ? "..." : ""
        }${colors.reset}`
      );
    }
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(
      `${colors.bright}${colors.cyan}Advanced SQL Injection Testing Script${colors.reset}\n`
    );
    console.log(`${colors.bright}Usage:${colors.reset}`);
    console.log(
      `  node test-sql-injection-advanced.js <URL> <METHOD> [SCHEMA]\n`
    );
    console.log(`${colors.bright}Examples:${colors.reset}`);
    console.log(
      `  node test-sql-injection-advanced.js http://localhost:3000/api/v1/auth/login POST '{"username":"string","password":"string"}'`
    );
    console.log(
      `  node test-sql-injection-advanced.js http://localhost:3000/api/v1/users GET`
    );
    console.log(
      `  node test-sql-injection-advanced.js http://localhost:3000/api/v1/data POST '{"name":"string","age":"number","email":"string","isActive":"boolean"}'`
    );
    console.log(
      `  node test-sql-injection-advanced.js http://localhost:3000/api/v1/profile PUT '{"id":"id","name":"string","email":"email","phone":"phone","birthDate":"date"}'`
    );
    console.log(`\n${colors.bright}Available Types:${colors.reset}`);

    for (const [type, info] of Object.entries(DATA_TYPES)) {
      console.log(
        `  ${colors.cyan}${type}${colors.reset}: ${info.description}`
      );
    }

    process.exit(1);
  }

  const [url, method, schema] = args;

  console.log(
    `${colors.bright}${colors.cyan}=== Advanced SQL Injection Testing ===${colors.reset}\n`
  );
  console.log(
    `${colors.bright}Target:${colors.reset} ${
      colors.white
    }${method.toUpperCase()} ${url}${colors.reset}`
  );

  if (schema) {
    console.log(
      `${colors.bright}Schema:${colors.reset} ${colors.white}${schema}${colors.reset}`
    );
  } else {
    console.log(
      `${colors.bright}Schema:${colors.reset} ${colors.yellow}No schema provided - using basic tests${colors.reset}`
    );
  }

  console.log(
    `\n${colors.bright}${colors.yellow}Starting tests...${colors.reset}\n`
  );

  // Generate test payloads
  let testPayloads = [];

  if (schema) {
    testPayloads = generateTestPayloads(schema);
  } else {
    // Basic tests without schema
    testPayloads = [
      {
        field: "query",
        type: "string",
        payload: "'1'='1",
        fullPayload: { query: "'1'='1" },
        description: "Basic SQL injection test",
      },
      {
        field: "query",
        type: "string",
        payload: "'admin' OR '1'='1",
        fullPayload: { query: "'admin' OR '1'='1" },
        description: "OR-based SQL injection test",
      },
      {
        field: "query",
        type: "string",
        payload: "'admin' UNION SELECT",
        fullPayload: { query: "'admin' UNION SELECT" },
        description: "UNION-based SQL injection test",
      },
    ];
  }

  console.log(
    `${colors.bright}Generated ${testPayloads.length} test payloads${colors.reset}\n`
  );

  // Run tests
  for (let i = 0; i < testPayloads.length; i++) {
    const payload = testPayloads[i];
    const testInfo = `Test ${i + 1}/${testPayloads.length}`;

    process.stdout.write(
      `${colors.cyan}${testInfo}${colors.reset} - Testing ${payload.field} (${payload.type})... `
    );

    const result = await runTest(url, method, payload, testInfo);

    testResults.total++;
    testResults.details.push(result);

    if (result.error) {
      testResults.errors++;
      console.log(`${colors.yellow}ERROR${colors.reset}`);
    } else if (result.passed) {
      testResults.passed++;
      console.log(`${colors.green}PASSED${colors.reset}`);
    } else {
      testResults.failed++;
      console.log(`${colors.red}FAILED${colors.reset}`);
    }

    // Add a small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Display results
  displayResults();

  // Exit with appropriate code
  if (testResults.failed > 0) {
    console.log(
      `\n${colors.red}${colors.bright}⚠️  WARNING: ${testResults.failed} tests failed - potential security vulnerabilities detected!${colors.reset}`
    );
    process.exit(1);
  } else if (testResults.errors > 0) {
    console.log(
      `\n${colors.yellow}${colors.bright}⚠️  WARNING: ${testResults.errors} tests had errors - check your connection and endpoint${colors.reset}`
    );
    process.exit(2);
  } else {
    console.log(
      `\n${colors.green}${colors.bright}✅ All tests passed - SQL injection protection appears to be working correctly!${colors.reset}`
    );
    process.exit(0);
  }
}

// Handle errors
process.on("unhandledRejection", (reason, promise) => {
  console.error(
    `${colors.red}Unhandled Rejection at:${colors.reset}`,
    promise,
    `\n${colors.red}reason:${colors.reset}`,
    reason
  );
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error(`${colors.red}Script error:${colors.reset}`, error);
    process.exit(1);
  });
}

module.exports = {
  makeRequest,
  generateTestPayloads,
  isSQLInjectionBlocked,
  isAuthenticationSuccessful,
  DATA_TYPES,
};
