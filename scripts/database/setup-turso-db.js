const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();

// Generate UUID using Node.js built-in crypto
function generateUUID() {
  return crypto.randomUUID();
}

// Database configuration
const config = {
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
};

// Admin user configuration
const adminConfig = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

// Parse SQL statements properly
function parseSQLStatements(sqlContent) {
  const statements = [];
  let currentStatement = "";
  let inString = false;
  let stringChar = "";
  let commentLevel = 0; // 0 = no comment, 1 = -- comment, 2 = /* comment */
  let braceLevel = 0; // Track BEGIN/END blocks

  for (let i = 0; i < sqlContent.length; i++) {
    const char = sqlContent[i];
    const nextChar = sqlContent[i + 1] || "";

    // Handle comments
    if (commentLevel === 0 && char === "-" && nextChar === "-") {
      commentLevel = 1;
      i++; // Skip next char
      continue;
    } else if (commentLevel === 0 && char === "/" && nextChar === "*") {
      commentLevel = 2;
      i++; // Skip next char
      continue;
    } else if (commentLevel === 1 && char === "\n") {
      commentLevel = 0;
      continue;
    } else if (commentLevel === 2 && char === "*" && nextChar === "/") {
      commentLevel = 0;
      i++; // Skip next char
      continue;
    }

    if (commentLevel > 0) continue;

    // Handle string literals
    if (!inString && (char === "'" || char === '"')) {
      inString = true;
      stringChar = char;
    } else if (inString && char === stringChar) {
      inString = false;
    }

    // Track BEGIN/END blocks for triggers
    if (!inString && commentLevel === 0) {
      if (
        char === "B" &&
        nextChar === "E" &&
        sqlContent[i + 2] === "G" &&
        sqlContent[i + 3] === "I" &&
        sqlContent[i + 4] === "N"
      ) {
        braceLevel++;
      } else if (
        char === "E" &&
        nextChar === "N" &&
        sqlContent[i + 2] === "D"
      ) {
        braceLevel--;
      }
    }

    // Add character to current statement
    currentStatement += char;

    // Check for statement end (semicolon outside of string and outside BEGIN/END blocks)
    if (char === ";" && !inString && braceLevel === 0) {
      const trimmed = currentStatement.trim();
      if (trimmed.length > 0) {
        statements.push(trimmed);
      }
      currentStatement = "";
    }
  }

  // Add any remaining statement
  const trimmed = currentStatement.trim();
  if (trimmed.length > 0) {
    statements.push(trimmed);
  }

  return statements.filter((stmt) => stmt.length > 0);
}

// Validate configuration
function validateConfiguration() {
  console.log("🔍 Validating configuration...");

  if (!config.url) {
    throw new Error("TURSO_DATABASE_URL is required in .env file");
  }

  if (!config.authToken) {
    throw new Error("TURSO_AUTH_TOKEN is required in .env file");
  }

  console.log("✅ Configuration validated");
  console.log(`📊 Database URL: ${config.url}`);
  console.log(`👤 Admin Username: ${adminConfig.username}\n`);
}

// Create and test database connection
async function createDatabaseConnection() {
  console.log("🔌 Connecting to Turso database...");
  const db = createClient(config);

  // Test connection
  await db.execute("SELECT 1 as test");
  console.log("✅ Database connection successful\n");

  return db;
}

// Execute database schema
async function executeDatabaseSchema(db) {
  console.log("📋 Executing database schema...");
  const schemaPath = path.join(__dirname, "..", "..", "database", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");

  // Parse SQL statements properly
  const statements = parseSQLStatements(schema);
  console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

  // Execute statements in order
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    try {
      await db.execute(statement);
      console.log(`✅ [${i + 1}/${statements.length}] Executed successfully`);
    } catch (error) {
      if (error.message.includes("already exists")) {
        console.log(
          `⚠️  [${i + 1}/${statements.length}] Skipped (already exists)`
        );
      } else {
        console.error(
          `❌ [${i + 1}/${statements.length}] Error: ${error.message}`
        );
        console.error(`   Statement: ${statement.substring(0, 100)}...`);
      }
    }
  }
  console.log("✅ Schema execution completed\n");
}

// Check if admin user exists
async function checkExistingAdminUser(db) {
  console.log("🔍 Checking for existing admin user...");
  const existingUser = await db.execute({
    sql: "SELECT id, username FROM users WHERE username = ? AND isActive = 1",
    args: [adminConfig.username],
  });

  if (existingUser.rows.length > 0) {
    console.log("⚠️  Admin user already exists, skipping creation");
    console.log(`   User ID: ${existingUser.rows[0].id}`);
    return existingUser.rows[0];
  }

  return null;
}

// Create admin user
async function createAdminUser(db) {
  console.log("👤 Creating admin user...");
  const userId = generateUUID();
  const passwordHash = await bcrypt.hash(adminConfig.password, 12);

  // Generate a separate salt for additional security
  const passwordSalt = crypto.randomBytes(32).toString("hex");

  await db.execute({
    sql: `
      INSERT INTO users (
        id, username, passwordHash, passwordSalt,
        hasSetup2FA, is2FAVerified, is2FAEnabled,
        secret2FA, tempSecret2FA, 
        isActive, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `,
    args: [
      userId,
      adminConfig.username,
      passwordHash,
      passwordSalt,
      0, // hasSetup2FA = false
      0, // is2FAVerified = false
      1, // is2FAEnabled = true
      null, // secret2FA
      null, // tempSecret2FA
      1, // isActive = true
    ],
  });

  console.log("✅ Admin user created successfully");
  console.log(`   User ID: ${userId}`);
  console.log(`   Username: ${adminConfig.username}`);
  console.log(`   Password: ${adminConfig.password}`);

  return { id: userId, username: adminConfig.username };
}

// Verify database setup
async function verifyDatabaseSetup(db) {
  console.log("\n🔍 Verifying database setup...");
  const userCount = await db.execute(
    "SELECT COUNT(*) as count FROM users WHERE isActive = 1"
  );
  const tableCount = await db.execute(
    "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'"
  );

  console.log(`✅ Users table: ${userCount.rows[0].count} active users`);
  console.log(`✅ Database tables: ${tableCount.rows[0].count} tables created`);

  // Show active users
  const activeUsers = await db.execute(
    "SELECT id, username, hasSetup2FA, createdAt FROM users WHERE isActive = 1"
  );
  console.log("\n📊 Active Users:");
  activeUsers.rows.forEach((user) => {
    console.log(
      `   - ${user.username} (ID: ${user.id}, 2FA: ${
        user.hasSetup2FA ? "Enabled" : "Disabled"
      })`
    );
  });
}

// Display completion message
function displayCompletionMessage() {
  console.log("\n🎉 Turso Database Setup Completed Successfully!");
  console.log("\n📝 Next Steps:");
  console.log("   1. Start your Next.js application: npm run dev");
  console.log("   2. Navigate to /auth/login");
  console.log("   3. Login with the admin credentials");
  console.log("   4. Complete 2FA setup");
}

// Main setup function
async function setupTursoDatabase() {
  console.log("🚀 Starting Turso Database Setup...\n");

  try {
    // Validate configuration
    validateConfiguration();

    // Check/Create database connection
    const db = await createDatabaseConnection();

    // Execute database schema
    await executeDatabaseSchema(db);

    // Check if admin user already exists
    const existingUser = await checkExistingAdminUser(db);

    // Create a default admin user based on .env configuration if no rows are found
    if (!existingUser) {
      await createAdminUser(db);
    }

    // Verify setup
    await verifyDatabaseSetup(db);

    // Display completion message
    displayCompletionMessage();
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupTursoDatabase();
}

module.exports = { setupTursoDatabase };
