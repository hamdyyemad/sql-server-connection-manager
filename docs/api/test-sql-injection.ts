import { validateConnectionParamsWithSQLInjectionPrevention } from "@/backend_lib/validations/sqlInjectionValidation";

// Test the SQL injection attempt mentioned by the user
const testSQLInjectionAttempt = () => {
  console.log("Testing SQL Injection Prevention...\n");

  const maliciousData = {
    server: "' OR 1=1 --",
    authenticationType: "sql" as const,
    user: "' OR 1=1 --",
    password: "Admin",
  };

  console.log("Testing malicious input:");
  console.log("Server:", maliciousData.server);
  console.log("User:", maliciousData.user);
  console.log("Password:", maliciousData.password);
  console.log("Authentication Type:", maliciousData.authenticationType);
  console.log("");

  const result =
    validateConnectionParamsWithSQLInjectionPrevention(maliciousData);

  console.log("Validation Result:");
  console.log("Success:", result.success);
  console.log("Error:", result.error);
  console.log("");

  if (!result.success) {
    console.log("✅ SQL Injection Prevention WORKING - Attack blocked!");
  } else {
    console.log("❌ SQL Injection Prevention FAILED - Attack not blocked!");
  }
};

// Test other common SQL injection patterns
const testOtherPatterns = () => {
  console.log("\nTesting other SQL injection patterns...\n");

  const testCases = [
    {
      name: "DROP TABLE attack",
      data: {
        server: "localhost",
        authenticationType: "sql" as const,
        user: "admin'; DROP TABLE Users; --",
        password: "password",
      },
    },
    {
      name: "UNION SELECT attack",
      data: {
        server: "localhost",
        authenticationType: "sql" as const,
        user: "admin' UNION SELECT * FROM Users --",
        password: "password",
      },
    },
    {
      name: "Comment attack",
      data: {
        server: "localhost",
        authenticationType: "sql" as const,
        user: "admin'--",
        password: "password",
      },
    },
    {
      name: "Stored procedure attack",
      data: {
        server: "localhost",
        authenticationType: "sql" as const,
        user: "admin'; EXEC xp_cmdshell 'dir' --",
        password: "password",
      },
    },
  ];

  testCases.forEach((testCase) => {
    console.log(`Testing: ${testCase.name}`);
    const result = validateConnectionParamsWithSQLInjectionPrevention(
      testCase.data
    );
    console.log(
      `Result: ${result.success ? "PASSED" : "BLOCKED"} - ${
        result.error || "No error"
      }`
    );
    console.log("");
  });
};

// Test valid data to ensure it passes
const testValidData = () => {
  console.log("\nTesting valid data...\n");

  const validData = {
    server: "localhost",
    authenticationType: "sql" as const,
    user: "admin",
    password: "password123",
  };

  console.log("Testing valid input:");
  console.log("Server:", validData.server);
  console.log("User:", validData.user);
  console.log("Password:", validData.password);
  console.log("Authentication Type:", validData.authenticationType);
  console.log("");

  const result = validateConnectionParamsWithSQLInjectionPrevention(validData);

  console.log("Validation Result:");
  console.log("Success:", result.success);
  console.log("Error:", result.error);
  console.log("");

  if (result.success) {
    console.log("✅ Valid data PASSES - No false positives!");
  } else {
    console.log("❌ Valid data BLOCKED - False positive!");
  }
};

// Run all tests
testSQLInjectionAttempt();
testOtherPatterns();
testValidData();
