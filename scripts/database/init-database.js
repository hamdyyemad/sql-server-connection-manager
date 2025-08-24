const { createClient } = require('@libsql/client');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbUrl = process.env.TURSO_DATABASE_URL;
const dbAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!dbUrl) {
  console.error('❌ TURSO_DATABASE_URL is not defined');
  process.exit(1);
}

if (!dbAuthToken) {
  console.error('❌ TURSO_AUTH_TOKEN is not defined');
  process.exit(1);
}

// Create database client
const db = createClient({
  url: dbUrl,
  authToken: dbAuthToken,
});

// Read schema file
function readSchema() {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  return fs.readFileSync(schemaPath, 'utf8');
}

// Initialize database
async function initializeDatabase() {
  try {
    console.log('🔍 Initializing database...');
    
    // Test connection
    const testResult = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    // Read and execute schema
    const schema = readSchema();
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await db.execute(statement);
      }
    }
    
    console.log('✅ Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

// Create admin user
async function createAdminUser() {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    console.log('🔍 Creating admin user:', adminUsername);
    
    // Check if admin user already exists
    const existingUser = await db.execute({
      sql: 'SELECT id FROM users WHERE username = ? AND isActive = 1',
      args: [adminUsername]
    });
    
    if (existingUser.rows.length > 0) {
      console.log('✅ Admin user already exists');
      return true;
    }
    
    // Generate salt and hash password
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(adminPassword + salt).digest('hex');
    
    // Create admin user
    await db.execute({
      sql: `
        INSERT INTO users (id, username, passwordHash, passwordSalt, hasSetup2FA, isActive, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `,
      args: [
        crypto.randomUUID(),
        adminUsername,
        hash,
        salt,
        0, // hasSetup2FA = false
        1  // isActive = true
      ]
    });
    
    console.log('✅ Admin user created successfully');
    console.log('📋 Admin credentials:');
    console.log(`   Username: ${adminUsername}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Password Hash: ${hash}`);
    console.log(`   Password Salt: ${salt}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting database initialization...\n');
  
  // Initialize database
  const dbInitialized = await initializeDatabase();
  if (!dbInitialized) {
    console.error('❌ Database initialization failed');
    process.exit(1);
  }
  
  // Create admin user
  const adminCreated = await createAdminUser();
  if (!adminCreated) {
    console.error('❌ Admin user creation failed');
    process.exit(1);
  }
  
  console.log('\n🎉 Database initialization completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Set up your environment variables:');
  console.log('   TURSO_DATABASE_URL=your_turso_db_url');
  console.log('   TURSO_AUTH_TOKEN=your_turso_auth_token');
  console.log('   ADMIN_USERNAME=admin (optional, defaults to "admin")');
  console.log('   ADMIN_PASSWORD=admin123 (optional, defaults to "admin123")');
  console.log('2. Start your Next.js development server: npm run dev');
  console.log('3. Access the login page at: http://localhost:3000/auth/login');
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
