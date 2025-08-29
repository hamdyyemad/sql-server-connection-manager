import type { DatabaseHandler } from '../middleware/database';
import { SQLInjectionPrevention } from '../middleware/sql-injection-prevention';
import { ApiError } from '../middleware/error-handler';

export const listTablesHandler: DatabaseHandler = async (req, pool) => {
  const { database } = req.parsedBody;
  
  if (!database) {
    throw ApiError.badRequest('Database name is required');
  }

  // Validate database name to prevent SQL injection
  const sqlPrevention = new SQLInjectionPrevention();
  const dbValidation = sqlPrevention.validateIdentifier(database, 'database');
  
  if (!dbValidation.isValid) {
    throw ApiError.badRequest(`Invalid database name: ${dbValidation.error}`);
  }

  // Use the sanitized database name directly in the query
  const sanitizedDatabase = dbValidation.sanitized;
  
  // Get all tables in the database - database name must be directly embedded, not parameterized
  const query = `
    SELECT TABLE_NAME as name
    FROM [${sanitizedDatabase}].INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE'
    ORDER BY TABLE_NAME
  `;
  
  const request = pool.request();
  const result = await request.query(query);
  
  console.log(`Retrieved ${result.recordset.length} tables from database ${sanitizedDatabase}`);
  
  return {
    success: true,
    data: {
      tables: result.recordset.map((row: { name: string }) => row.name),
      count: result.recordset.length
    }
  };
}; 