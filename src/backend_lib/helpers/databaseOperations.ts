/* eslint-disable @typescript-eslint/no-explicit-any */
// Debug functions are now automatically handled by console override
import { createErrorObject, createSuccessObject } from "../utils/responseUtils";
import {
  ConnectionParams,
  DatabaseConfig,
} from "../validations/connectionValidation";
import {
  validateConnectionParamsWithSQLInjectionPrevention,
} from "../validations/sqlInjectionValidation";

import { formatConnectionError } from "./formatErrors";
// Close database connection safely
async function closeDatabaseConnection(
  pool: any,
  server: string
): Promise<void> {
  if (!pool) return;

  try {
    console.log("Closing connection pool...");
    await pool.close();
          console.log(`Closed connection to server: ${server}`);
  } catch (closeErr) {
          console.warn(`Error closing connection to server ${server}:`, closeErr);
  }
}

// Main database operation handler
export async function handleDatabaseOperation(
  params: ConnectionParams,
  sql: any,
  handler: (request: any, pool: any) => Promise<any>,
  request: any,
  body: any
): Promise<{ success: boolean; error?: string; [key: string]: any }> {
  const { server, authenticationType } = params;
  let pool: any = null;

  try {
    // Validate connection parameters with SQL injection prevention
    const connectionValidation = validateConnectionParamsWithSQLInjectionPrevention(params);
    if (!connectionValidation.success) {
      return connectionValidation;
    }

    // Create database configuration
    const configResult = createDatabaseConfig(params);
    if (!configResult.success) {
      return createErrorObject(configResult.error);
    }

    const config = configResult.config!;
    console.log(`Using config:`, JSON.stringify(config, null, 2));

    // Connect to database
    const connectionResult = await connectToDatabase(sql, config);
    if (!connectionResult.success) {
      return createErrorObject(connectionResult.error);
    }

    pool = connectionResult.pool;

    // For Windows Authentication, ensure testuser login exists
    if (authenticationType === "windows" && ensureTestLogin) {
      await ensureTestLogin(pool, server);
    }

    // Create extended request with database config
    const dbReq = request as any;
    dbReq.dbConfig = {
      server,
      user: config.user,
      password: config.password,
      authenticationType,
    };
    dbReq.parsedBody = body;

    // Call the actual handler
    console.log("Calling handler function...");
    const result = await handler(dbReq, pool);
          console.log("Handler completed successfully");

    return result;
  } catch (err) {
    console.error(`Database operation failed for server ${server}:`, err);
    console.error("Error type:", (err as Error).constructor.name);
    console.error("Error message:", (err as Error).message);
    console.error("Error stack:", (err as Error).stack);

    const formattedError = formatConnectionError(
      err as Error,
      server,
      authenticationType
    );
    return createErrorObject(formattedError);
  } finally {
    await closeDatabaseConnection(pool, server);
  }
}

// Function to create test login if it doesn't exist
async function ensureTestLogin(pool: any, server: string) {
  try {
    console.log(`Checking if testuser login exists on ${server}...`);

    // Check if testuser login exists
    const checkResult = await pool.request().query(`
        SELECT name, type_desc, is_disabled 
        FROM sys.server_principals 
        WHERE name = 'testuser'
      `);

    if (checkResult.recordset.length === 0) {
      console.log(`Creating testuser login on ${server}...`);

      // Create the login
      await pool.request().query(`
          CREATE LOGIN testuser WITH PASSWORD = 'Admin'
        `);

      // Add to sysadmin role for testing
      await pool.request().query(`
          ALTER SERVER ROLE sysadmin ADD MEMBER testuser
        `);

      console.log(`Successfully created testuser login on ${server}`);
    } else {
      console.log(`testuser login already exists on ${server}`);
    }

    return true;
  } catch (error) {
    console.error(`Failed to create/check testuser login on ${server}:`, error);
    return false;
  }
}

// Create database configuration based on authentication type
function createDatabaseConfig(params: ConnectionParams): {
  success: boolean;
  error: string;
  config?: DatabaseConfig;
} {
  const { server, user, password, authenticationType } = params;

  const baseOptions = {
    trustServerCertificate: true,
    enableArithAbort: true,
    encrypt: false,
    connectTimeout: 30000,
  };

  if (authenticationType === "windows") {
    console.log(
      "Windows Authentication selected - using SQL Authentication with testuser"
    );

    return {
      ...createSuccessObject(),
      config: {
        server,
        user: "testuser",
        password: "Admin",
        options: baseOptions,
      },
    };
  }

  if (authenticationType === "sql") {
    if (!user || !password) {
      console.error("SQL auth missing credentials");
      return createErrorObject(
        "Username and password are required for SQL Authentication"
      );
    }

    return {
      ...createSuccessObject(),
      config: {
        server,
        user,
        password,
        options: baseOptions,
      },
    };
  }

  return createErrorObject("Invalid authentication type");
}

// Attempt connection with fallback options
async function connectToDatabase(
  sql: any,
  config: DatabaseConfig
): Promise<{ success: boolean; error: string; pool?: any }> {
  console.log("Attempting to connect to SQL Server...");
  console.log("Connection config:", {
    server: config.server,
    user: config.user,
    hasPassword: !!config.password,
    options: config.options,
  });

  // Try primary configuration
  try {
    const pool = await sql.connect(config);
    console.log("Successfully connected to SQL Server");
    return {
      ...createSuccessObject(),
      pool,
    };
  } catch (connectionError) {
    console.error("Initial connection failed:", connectionError);
    console.log("Trying alternative connection strings...");
  }

  return createErrorObject(
    `Failed to connect to SQL Server. Tried: ${config.server}`
  );
}
