import { NextRequest } from "next/server";
import { createDatabaseRouteHandler, withDatabaseErrorHandler } from "@/backend_lib";
import {
  SQLInjectionPrevention,
  ParameterBinder,
} from "@/backend_lib/middleware/sql-injection-prevention";
import { ApiError } from "@/backend_lib/middleware/error-handler";

// Example secure handler that demonstrates SQL injection prevention
async function secureExampleHandler(req: any, pool: any) {
  const { database, search } = req.parsedBody;

  // Initialize SQL injection prevention
  const sqlPrevention = new SQLInjectionPrevention();
  const binder = new ParameterBinder();

  // Validate database name
  if (!database) {
    throw ApiError.badRequest("Database name is required");
  }
  const dbValidation = sqlPrevention.validateIdentifier(database, "database");
  if (!dbValidation.isValid) {
    throw ApiError.badRequest(dbValidation.error || "Invalid database name");
  }

  // Use the sanitized database name directly in the query
  const sanitizedDatabase = dbValidation.sanitized;

  // Validate search term if present
  if (search) {
    const searchValidation = sqlPrevention.validateInput(search, "search");
    if (!searchValidation.isValid) {
      throw ApiError.badRequest(searchValidation.error || "Invalid search term");
    }
  }

  // Database name must be directly embedded, not parameterized
  const query = `
    SELECT COUNT(*) as table_count
    FROM [${sanitizedDatabase}].INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE'
  `;

  const request = pool.request();
  const result = await request.query(query);

  return {
    success: true,
    data: {
      message: "Query executed securely with proper database name validation",
      tableCount: result.recordset[0].table_count,
      database: sanitizedDatabase,
    },
  };
}

// Wrap the handler with database error handling middleware
const errorHandledHandler = withDatabaseErrorHandler(secureExampleHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);

export async function POST(request: NextRequest) {
  return handler(request);
}
