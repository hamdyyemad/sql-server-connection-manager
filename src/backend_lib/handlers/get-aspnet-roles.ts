import type { DatabaseHandler } from '../middleware/database';
import { SQLInjectionPrevention } from '../middleware/sql-injection-prevention';

export const getAspNetRolesHandler: DatabaseHandler = async (req, pool) => {
  const { database } = req.parsedBody;
  
  if (!database) {
    return {
      success: false,
      error: 'Database name is required'
    };
  }

  try {
    // Validate database name to prevent SQL injection
    const sqlPrevention = new SQLInjectionPrevention();
    const dbValidation = sqlPrevention.validateIdentifier(database, 'database');
    
    if (!dbValidation.isValid) {
      return {
        success: false,
        error: `Invalid database name: ${dbValidation.error}`
      };
    }

    // Use the sanitized database name directly in the query
    const sanitizedDatabase = dbValidation.sanitized;
    
    // Get all roles - database name must be directly embedded, not parameterized
    const query = `
      SELECT [Id], [Name]
      FROM [${sanitizedDatabase}].[dbo].[AspNetRoles]
      ORDER BY [Name]
    `;
    
    const request = pool.request();
    const result = await request.query(query);
    
    console.log(`Retrieved ${result.recordset.length} roles from database ${sanitizedDatabase}`);
    
    return {
      success: true,
      data: {
        roles: result.recordset,
        columns: ['Id', 'Name']
      }
    };
  } catch (error) {
    console.error('Error retrieving roles:', error);
    return {
      success: false,
      error: `Failed to retrieve roles: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}; 