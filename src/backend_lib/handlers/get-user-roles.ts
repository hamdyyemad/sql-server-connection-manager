import type { DatabaseHandler } from '../middleware/database';
import { ParameterBinder, SQLInjectionPrevention } from '../middleware/sql-injection-prevention';

export const getUserRolesHandler: DatabaseHandler = async (req, pool) => {
  const { database, userId } = req.parsedBody;
  
  if (!database || !userId) {
    return {
      success: false,
      error: 'Database name and user ID are required'
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

    // Use the sanitized database name directly in queries
    const sanitizedDatabase = dbValidation.sanitized;
    const binder = new ParameterBinder();
    
    // Add parameters for values only
    const userIdParam = binder.addParameter(userId);
    
    // Get user roles - database name must be directly embedded, not parameterized
    const query = `
      SELECT r.[Id], r.[Name]
      FROM [${sanitizedDatabase}].[dbo].[AspNetUserRoles] ur
      INNER JOIN [${sanitizedDatabase}].[dbo].[AspNetRoles] r ON ur.[RoleId] = r.[Id]
      WHERE ur.[UserId] = ${userIdParam}
    `;
    
    const request = pool.request();
    request.input(userIdParam, userId);
    
    const result = await request.query(query);
    
    console.log(`Retrieved ${result.recordset.length} roles for user ${userId} in database ${sanitizedDatabase}`);
    
    return {
      success: true,
      data: {
        roles: result.recordset,
        userId: userId
      }
    };
  } catch (error) {
    console.error('Error retrieving user roles:', error);
    return {
      success: false,
      error: `Failed to retrieve user roles: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}; 