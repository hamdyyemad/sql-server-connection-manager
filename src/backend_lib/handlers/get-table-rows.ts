import type { DatabaseHandler } from "../middleware/database";
import {
  ParameterBinder,
  SQLInjectionPrevention,
} from "../middleware/sql-injection-prevention";

export const getTableRowsHandler: DatabaseHandler = async (req, pool) => {
  const { database, table, limit = 100 } = req.parsedBody;

  console.log(
    `🔍 Debug: getTableRowsHandler called with database: ${database}, table: ${table}, limit: ${limit}`
  );

  if (!database || !table) {
    return {
      success: false,
      error: "Database name and table name are required",
    };
  }

  try {
    // Validate database and table names to prevent SQL injection
    const sqlPrevention = new SQLInjectionPrevention();

    const dbValidation = sqlPrevention.validateIdentifier(database, "database");
    if (!dbValidation.isValid) {
      return {
        success: false,
        error: `Invalid database name: ${dbValidation.error}`,
      };
    }

    const tableValidation = sqlPrevention.validateIdentifier(table, "table");
    if (!tableValidation.isValid) {
      return {
        success: false,
        error: `Invalid table name: ${tableValidation.error}`,
      };
    }

    // Use the sanitized names directly in queries
    const sanitizedDatabase = dbValidation.sanitized;
    const sanitizedTable = tableValidation.sanitized;

    // Validate and sanitize the limit value
    const safeLimit = Math.max(
      1,
      Math.min(1000, parseInt(limit.toString()) || 100)
    );

    // Try different schema combinations for the table
    let query = `SELECT * FROM [${sanitizedDatabase}].[dpo].[${sanitizedTable}] `;

    try {
      // First try dpo schema
      await pool.request().query(query);
    } catch (error) {
      try {
        // If dpo schema fails, try dbo schema
        console.log(
          `🔍 Debug: Table not found in dpo schema, trying dbo schema for ${sanitizedTable}`
        );
        query = `SELECT * FROM [${sanitizedDatabase}].[dbo].[${sanitizedTable}] `;
        await pool.request().query(query);
      } catch (error2) {
        // If both fail, try without schema (default schema)
        console.log(
          `🔍 Debug: Table not found in dbo schema, trying default schema for ${sanitizedTable}`
        );
        query = `SELECT * FROM [${sanitizedDatabase}].[${sanitizedTable}] `;
        await pool.request().query(query);
      }
    }

    console.log(`🔍 Debug: Executing query: ${query}`);

    // Execute the final query that worked
    const result = await pool.request().query(query);

    console.log(
      `✅ Success: Retrieved ${result.recordset.length} rows from table ${sanitizedTable} in database ${sanitizedDatabase} on server: ${req.dbConfig.server}`
    );

    return {
      success: true,
      data: {
        rows: result.recordset,
        columns:
          result.recordset.length > 0 ? Object.keys(result.recordset[0]) : [],
      },
    };
  } catch (error) {
    console.error("❌ Error retrieving table rows:", error);
    console.error("❌ Error details:", {
      database,
      table,
      limit,
      server: req.dbConfig.server,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorStack: error instanceof Error ? error.stack : undefined,
    });

    return {
      success: false,
      error: `Failed to retrieve table rows: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
