/* eslint-disable @typescript-eslint/no-explicit-any */
import loadSqlDriver from "../helpers/loadSqlDriver";

import type { NextRequest } from "next/server";
import type { DatabaseConfig, DatabaseResponse } from "../types/database";

// Debug functions are now automatically handled by console override
import { validatePostRequest } from "../validations/requestValidations";
import { validateConnectionParamsWithSQLInjectionPrevention } from "../validations/sqlInjectionValidation";
import { createErrorObject } from "../utils/responseUtils";
import { handleDatabaseOperation } from "../helpers/databaseOperations";

export interface DatabaseRequest extends NextRequest {
  dbConfig: DatabaseConfig;
  parsedBody: any;
}

export type DatabaseHandler = (
  req: DatabaseRequest,
  pool: any
) => Promise<DatabaseResponse>;

export async function withDatabase(
  request: NextRequest,
  handler: DatabaseHandler
) {
  // Backend Debugging - Middleware entry point
  console.log("withDatabase middleware called");
  console.log("Request method:", request.method);
  console.log("Request URL:", request.url);
  console.log("Request headers:", Object.fromEntries(request.headers.entries()));

  const {
    success: isPostRequestSuccess,
    error: PostRequestErrMsg,
    body,
  } = await validatePostRequest(request);
  if (!isPostRequestSuccess) {
    return createErrorObject(PostRequestErrMsg);
  }

  const { server, user, password, authenticationType } = body;

  // Validate server, authenticationType with SQL injection prevention
  const { success: isConnectionValid, error: connectionErrMsg } =
    validateConnectionParamsWithSQLInjectionPrevention({
      server,
      user,
      password,
      authenticationType,
    });
  if (!isConnectionValid) {
    return createErrorObject(connectionErrMsg);
  }

  // Import the regular mssql driver
  const {
    success: driverLoaded,
    error: driverError,
    sql,
  } = await loadSqlDriver();
  if (!driverLoaded) {
    return createErrorObject(driverError);
  }

  // In your main function:
  const result = await handleDatabaseOperation(
    {
      server,
      user,
      password,
      authenticationType,
    },
    sql,
    handler,
    request,
    body
  );
  return result;
}

// Simple database connection function for GET requests
export async function connectToDatabase(server: string) {
  try {
    console.log(`Connecting to database server: ${server}`);

    // Import the regular mssql driver
    const {
      success: driverLoaded,
      error: driverError,
      sql,
    } = await loadSqlDriver();
    if (!driverLoaded) {
      throw new Error(driverError);
    }

    // Create database configuration
    const config = {
      server,
      user: "testuser",
      password: "Admin",
      options: {
        trustServerCertificate: true,
        enableArithAbort: true,
        encrypt: false,
        connectTimeout: 30000,
      },
    };

    console.log(`Using config for ${server}:`, JSON.stringify(config, null, 2));

    // Connect to database
    const pool = await sql.connect(config);
    console.log(`Successfully connected to SQL Server: ${server}`);

    return { success: true, pool };
  } catch (error) {
    console.log(`Failed to connect to SQL Server ${server}:`, error);
    return {
      success: false,
      error: `Failed to connect to SQL Server: ${server}. Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

// Database connection function with custom credentials
export async function connectToDatabaseWithCredentials(
  server: string,
  user: string,
  password: string,
  authType: string
) {
  try {
    console.log(
      `Connecting to database server: ${server} with custom credentials`
    );

    // Import the regular mssql driver
    const {
      success: driverLoaded,
      error: driverError,
      sql,
    } = await loadSqlDriver();
    if (!driverLoaded) {
      throw new Error(driverError);
    }

    // Create database configuration based on auth type
    let config;
    if (authType === "windows") {
      // For Windows auth, we still use SQL auth with provided credentials
      config = {
        server,
        user,
        password,
        options: {
          trustServerCertificate: true,
          enableArithAbort: true,
          encrypt: false,
          connectTimeout: 30000,
        },
      };
    } else {
      // SQL authentication
      config = {
        server,
        user,
        password,
        options: {
          trustServerCertificate: true,
          enableArithAbort: true,
          encrypt: false,
          connectTimeout: 30000,
        },
      };
    }

    console.log(
      `Using custom config for ${server}:`,
      JSON.stringify(
        {
          ...config,
          password: config.password ? "***" : undefined,
        },
        null,
        2
      )
    );

    // Connect to database
    const pool = await sql.connect(config);
    console.log(
      `Successfully connected to SQL Server: ${server} with custom credentials`
    );

    return { success: true, pool };
  } catch (error) {
    console.log(
      `Failed to connect to SQL Server ${server} with custom credentials:`,
      error
    );
    return {
      success: false,
      error: `Failed to connect to SQL Server: ${server}. Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
