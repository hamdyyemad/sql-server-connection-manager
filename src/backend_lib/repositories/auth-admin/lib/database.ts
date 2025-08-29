import { createClient } from '@libsql/client';

// Database configuration
const config = {
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
};

// Validate configuration
if (!config.url) {
  throw new Error('TURSO_DATABASE_URL is required in environment variables');
}

if (!config.authToken) {
  throw new Error('TURSO_AUTH_TOKEN is required in environment variables');
}

// Create and export database client
export const db = createClient(config);

// Test database connection
export async function testDatabaseConnection() {
  try {
    await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
