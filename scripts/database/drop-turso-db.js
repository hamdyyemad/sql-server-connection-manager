const { createClient } = require("@libsql/client");
require("dotenv").config();

async function dropTursoDatabase() {
  console.log("🗑️  Starting Turso Database Cleanup...\n");

  const config = {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  };

  if (!config.url) {
    console.error("❌ TURSO_DATABASE_URL is required in .env file");
    process.exit(1);
  }

  if (!config.authToken) {
    console.error("❌ TURSO_AUTH_TOKEN is required in .env file");
    process.exit(1);
  }

  try {
    console.log("🔌 Connecting to Turso database...");
    const db = createClient(config);

    // Test connection
    await db.execute("SELECT 1 as test");
    console.log("✅ Database connection successful\n");

    // Get all tables
    console.log("📋 Getting list of existing tables...");
    const tables = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    console.log(
      `Found ${tables.rows.length} tables: ${tables.rows
        .map((t) => t.name)
        .join(", ")}\n`
    );

    // Drop tables in reverse dependency order
    const dropOrder = [
      "audit_logs",
      "login_attempts",
      "auth_sessions",
      "users",
      "users_new",
    ];

    for (const tableName of dropOrder) {
      if (tables.rows.some((t) => t.name === tableName)) {
        try {
          console.log(`🗑️  Dropping table: ${tableName}`);
          await db.execute(`DROP TABLE IF EXISTS ${tableName}`);
          console.log(`✅ Dropped table: ${tableName}`);
        } catch (error) {
          console.error(`❌ Error dropping ${tableName}: ${error.message}`);
        }
      } else {
        console.log(`⚠️  Table ${tableName} doesn't exist, skipping`);
      }
    }

    // Drop views
    console.log("\n🗑️  Dropping views...");
    const views = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='view'"
    );
    for (const view of views.rows) {
      try {
        console.log(`🗑️  Dropping view: ${view.name}`);
        await db.execute(`DROP VIEW IF EXISTS ${view.name}`);
        console.log(`✅ Dropped view: ${view.name}`);
      } catch (error) {
        console.error(`❌ Error dropping view ${view.name}: ${error.message}`);
      }
    }

    // Drop triggers
    console.log("\n🗑️  Dropping triggers...");
    const triggers = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='trigger'"
    );
    for (const trigger of triggers.rows) {
      try {
        console.log(`🗑️  Dropping trigger: ${trigger.name}`);
        await db.execute(`DROP TRIGGER IF EXISTS ${trigger.name}`);
        console.log(`✅ Dropped trigger: ${trigger.name}`);
      } catch (error) {
        console.error(
          `❌ Error dropping trigger ${trigger.name}: ${error.message}`
        );
      }
    }

    // Verify cleanup
    console.log("\n🔍 Verifying cleanup...");
    const remainingTables = await db.execute(
      "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'"
    );
    const remainingViews = await db.execute(
      "SELECT COUNT(*) as count FROM sqlite_master WHERE type='view'"
    );
    const remainingTriggers = await db.execute(
      "SELECT COUNT(*) as count FROM sqlite_master WHERE type='trigger'"
    );

    console.log(`✅ Remaining tables: ${remainingTables.rows[0].count}`);
    console.log(`✅ Remaining views: ${remainingViews.rows[0].count}`);
    console.log(`✅ Remaining triggers: ${remainingTriggers.rows[0].count}`);

    console.log("\n🎉 Database cleanup completed successfully!");
    console.log("\n📝 Next Steps:");
    console.log("   1. Run: node scripts/setup-turso-db.js");
    console.log("   2. This will recreate all tables and the admin user");
  } catch (error) {
    console.error("❌ Database cleanup failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

// Run the cleanup
if (require.main === module) {
  dropTursoDatabase();
}

module.exports = { dropTursoDatabase };
