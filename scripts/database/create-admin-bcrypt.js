const { createClient } = require("@libsql/client");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();

// Generate UUID using Node.js built-in crypto
function generateUUID() {
  return crypto.randomUUID();
}

async function createAdminWithBcrypt() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log("🚀 Creating admin user with bcrypt...");

  try {
    // Check if users table exists, if not create it
    const tableCheck = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='users'
    `);

    if (tableCheck.rows.length === 0) {
      console.log("📋 Creating users table...");
      await client.execute(`
        CREATE TABLE users (
          id TEXT PRIMARY KEY NOT NULL,
          username TEXT NOT NULL UNIQUE,
          passwordHash TEXT NOT NULL,
          hasSetup2FA INTEGER NOT NULL DEFAULT 0,
          secret2FA TEXT NULL,
          tempSecret2FA TEXT NULL,
          isActive INTEGER NOT NULL DEFAULT 1,
          createdAt TEXT NOT NULL DEFAULT (datetime('now')),
          updatedAt TEXT DEFAULT (datetime('now')),
          lastLoginAt TEXT NULL
        )
      `);

      // Create indexes
      await client.execute(
        "CREATE INDEX idx_users_username ON users(username) WHERE isActive = 1"
      );
      await client.execute("CREATE INDEX idx_users_active ON users(isActive)");
      await client.execute(
        "CREATE INDEX idx_users_last_login ON users(lastLoginAt)"
      );
    }

    // Check if admin user exists
    const existingUser = await client.execute({
      sql: "SELECT id FROM users WHERE username = ? AND isActive = 1",
      args: [process.env.ADMIN_USERNAME || "admin"],
    });

    if (existingUser.rows.length > 0) {
      console.log("⚠️ Admin user already exists, updating password...");
      const passwordHash = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin123",
        12
      );
      await client.execute({
        sql: "UPDATE users SET passwordHash = ? WHERE username = ?",
        args: [passwordHash, process.env.ADMIN_USERNAME || "admin"],
      });
      console.log("✅ Admin password updated with bcrypt");
    } else {
      console.log("👤 Creating new admin user...");
      const userId = generateUUID();
      const passwordHash = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin123",
        12
      );

      await client.execute({
        sql: `
          INSERT INTO users (
            id, username, passwordHash, hasSetup2FA, secret2FA, tempSecret2FA, 
            isActive, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `,
        args: [
          userId,
          process.env.ADMIN_USERNAME || "admin",
          passwordHash,
          0, // hasSetup2FA = false
          null, // secret2FA
          null, // tempSecret2FA
          1, // isActive = true
        ],
      });

      console.log("✅ Admin user created successfully");
      console.log(`   User ID: ${userId}`);
      console.log(`   Username: ${process.env.ADMIN_USERNAME || "admin"}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || "admin123"}`);
    }
  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
  }
}

createAdminWithBcrypt();
