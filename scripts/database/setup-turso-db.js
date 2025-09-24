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

// Parse SQL statements using a much simpler approach
function parseSQLStatements(sqlContent) {
  // Remove comments first
  let cleanContent = sqlContent
    .replace(/--.*$/gm, "") // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, ""); // Remove multi-line comments

  // Split by semicolons, but be smart about it
  const statements = [];
  let currentStatement = "";
  let inString = false;
  let stringChar = "";
  let braceLevel = 0;
  let caseLevel = 0;

  for (let i = 0; i < cleanContent.length; i++) {
    const char = cleanContent[i];
    const nextChar = cleanContent[i + 1] || "";
    const nextThreeChars = cleanContent.substring(i, i + 4);
    const nextFourChars = cleanContent.substring(i, i + 5);
    const isLastChar = i === cleanContent.length - 1;

    // Handle string literals
    if (!inString && (char === "'" || char === '"')) {
      inString = true;
      stringChar = char;
    } else if (inString && char === stringChar) {
      inString = false;
    }

    // Track BEGIN/END blocks
    if (!inString) {
      if (
        nextFourChars.toUpperCase() === "BEGIN" &&
        (i === 0 || !/\w/.test(cleanContent[i - 1])) &&
        (i + 4 >= cleanContent.length || !/\w/.test(cleanContent[i + 4]))
      ) {
        braceLevel++;
        i += 4;
        currentStatement += "BEGIN";
        continue;
      } else if (
        nextThreeChars.toUpperCase() === "CASE" &&
        (i === 0 || !/\w/.test(cleanContent[i - 1])) &&
        (i + 3 >= cleanContent.length || !/\w/.test(cleanContent[i + 3]))
      ) {
        caseLevel++;
        i += 3;
        currentStatement += "CASE";
        continue;
      } else if (
        nextThreeChars.toUpperCase() === "END" &&
        (i === 0 || !/\w/.test(cleanContent[i - 1])) &&
        (i + 3 >= cleanContent.length || !/\w/.test(cleanContent[i + 3]))
      ) {
        if (caseLevel > 0) {
          caseLevel--;
          i += 2;
          currentStatement += "END";
          continue;
        } else if (braceLevel > 0) {
          braceLevel--;
          i += 2;
          currentStatement += "END";
          continue;
        }
      }
    }

    currentStatement += char;

    // Check for statement end (semicolon outside of string and outside BEGIN/END blocks)
    // Also handle end of file
    if (
      (char === ";" && !inString && braceLevel === 0 && caseLevel === 0) ||
      (isLastChar && currentStatement.trim().length > 0)
    ) {
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

// Execute database schema using a much simpler approach
async function executeDatabaseSchema(db) {
  console.log("📋 Executing database schema...");
  const schemaPath = path.join(__dirname, "..", "..", "database", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");

  // Clean up the schema content
  let cleanSchema = schema
    .replace(/--.*$/gm, "") // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\r/g, "\n"); // Normalize line endings

  // Use a different approach - execute statements in batches
  // First, try to execute the entire schema as one statement
  try {
    await db.execute(cleanSchema);
    console.log(`✅ Schema executed successfully as a single statement`);
    console.log("✅ Schema execution completed\n");
    return;
  } catch (error) {
    console.log(`⚠️  Single statement execution failed: ${error.message}`);
    console.log("🔄 Falling back to individual statement execution...");
  }

  // Fallback: Execute statements manually in a controlled way
  const statements = [
    // Tables
    `CREATE TABLE users (
      id TEXT PRIMARY KEY NOT NULL,
      username TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      passwordSalt TEXT NOT NULL,
      hasSetup2FA INTEGER NOT NULL DEFAULT 0,
      is2FAVerified INTEGER NOT NULL DEFAULT 0,
      is2FAEnabled INTEGER NOT NULL DEFAULT 1,
      secret2FA TEXT NULL,
      tempSecret2FA TEXT NULL,
      isActive INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      lastLoginAt TEXT NULL
    )`,

    `CREATE TABLE auth_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      sessionToken TEXT NOT NULL UNIQUE,
      step TEXT NOT NULL,
      isCompleted INTEGER NOT NULL DEFAULT 0,
      expiresAt TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      ipAddress TEXT,
      userAgent TEXT,
      success INTEGER NOT NULL DEFAULT 0,
      attemptedAt TEXT NOT NULL DEFAULT (datetime('now')),
      step TEXT NOT NULL
    )`,

    `CREATE TABLE audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT,
      action TEXT NOT NULL,
      details TEXT,
      ipAddress TEXT,
      userAgent TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    )`,

    // Indexes
    `CREATE INDEX idx_users_username ON users(username) WHERE isActive = 1`,
    `CREATE INDEX idx_users_active ON users(isActive)`,
    `CREATE INDEX idx_users_last_login ON users(lastLoginAt)`,
    `CREATE INDEX idx_users_2fa_verified ON users(is2FAVerified)`,
    `CREATE INDEX idx_users_2fa_enabled ON users(is2FAEnabled)`,
    `CREATE INDEX idx_sessions_token ON auth_sessions(sessionToken)`,
    `CREATE INDEX idx_sessions_user ON auth_sessions(userId)`,
    `CREATE INDEX idx_sessions_expires ON auth_sessions(expiresAt)`,
    `CREATE INDEX idx_login_attempts_username ON login_attempts(username, attemptedAt)`,
    `CREATE INDEX idx_login_attempts_ip ON login_attempts(ipAddress, attemptedAt)`,
    `CREATE INDEX idx_audit_logs_user ON audit_logs(userId, createdAt)`,
    `CREATE INDEX idx_audit_logs_action ON audit_logs(action, createdAt)`,

    // Triggers
    `CREATE TRIGGER update_users_updated_at 
     AFTER UPDATE ON users
     BEGIN
         UPDATE users SET updatedAt = datetime('now') WHERE id = NEW.id;
     END`,

    `CREATE TRIGGER update_sessions_updated_at 
     AFTER UPDATE ON auth_sessions
     BEGIN
         UPDATE auth_sessions SET updatedAt = datetime('now') WHERE id = NEW.id;
     END`,

    // Views
    `CREATE VIEW active_users AS
     SELECT 
         id,
         username,
         hasSetup2FA,
         is2FAVerified,
         is2FAEnabled,
         secret2FA IS NOT NULL as hasSecret,
         createdAt,
         lastLoginAt
     FROM users 
     WHERE isActive = 1`,

    `CREATE VIEW recent_login_attempts AS
     SELECT 
         username,
         COUNT(*) as attempt_count,
         MAX(attemptedAt) as last_attempt,
         SUM(success) as successful_attempts
     FROM login_attempts 
     WHERE attemptedAt > datetime('now', '-1 hour')
     GROUP BY username`,

    // Security trigger
    `CREATE TRIGGER validate_username_not_empty
     BEFORE INSERT ON users
     BEGIN
         SELECT CASE
             WHEN NEW.username IS NULL OR trim(NEW.username) = '' THEN
                 RAISE(ABORT, 'Username cannot be empty')
         END;
     END`,
  ];

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
