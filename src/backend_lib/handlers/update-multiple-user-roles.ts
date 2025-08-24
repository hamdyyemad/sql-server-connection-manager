import type { DatabaseHandler } from '../middleware/database';
import { ParameterBinder, SQLInjectionPrevention } from '../middleware/sql-injection-prevention';

export const updateMultipleUserRolesHandler: DatabaseHandler = async (req, pool) => {
  const { database, updates } = req.parsedBody;
  
  if (!database || !updates || !Array.isArray(updates) || updates.length === 0) {
    return {
      success: false,
      error: 'Database name and updates array are required'
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
    
    // Start a transaction
    const transaction = new (await import('mssql')).Transaction(pool);
    await transaction.begin();

    try {
      const results = [];

      for (const update of updates) {
        const { userId, newRoleId } = update;
        
        if (!userId || !newRoleId) {
          throw new Error('User ID and new role ID are required for each update');
        }

        // Add parameters for this update (values only)
        const userIdParam = binder.addParameter(userId);
        const newRoleIdParam = binder.addParameter(newRoleId);

        // Remove existing role assignments for this user
        const deleteQuery = `
          DELETE FROM [${sanitizedDatabase}].[dbo].[AspNetUserRoles] 
          WHERE [UserId] = ${userIdParam}
        `;
        
        const deleteRequest = transaction.request();
        deleteRequest.input(userIdParam, userId);
        await deleteRequest.query(deleteQuery);

        // Add new role assignment
        const insertQuery = `
          INSERT INTO [${sanitizedDatabase}].[dbo].[AspNetUserRoles] ([UserId], [RoleId])
          VALUES (${userIdParam}, ${newRoleIdParam})
        `;
        
        const insertRequest = transaction.request();
        insertRequest.input(userIdParam, userId);
        insertRequest.input(newRoleIdParam, newRoleId);
        await insertRequest.query(insertQuery);

        // Update TypeLogin based on the new role
        const typeLogin = newRoleId === '2' ? 'HR' : newRoleId === '3' ? 'Employee' : 'Employee';
        const typeLoginParam = binder.addParameter(typeLogin);
        
        const updateQuery = `
          UPDATE [${sanitizedDatabase}].[dbo].[AspNetUsers] 
          SET [TypeLogin] = ${typeLoginParam}
          WHERE [Id] = ${userIdParam}
        `;
        
        const updateRequest = transaction.request();
        updateRequest.input(typeLoginParam, typeLogin);
        updateRequest.input(userIdParam, userId);
        await updateRequest.query(updateQuery);

        results.push({
          userId,
          newRoleId,
          success: true,
          message: 'User role updated successfully'
        });
      }

      await transaction.commit();
      
      console.log(`Updated roles for ${results.length} users in database ${sanitizedDatabase}`);
      
      return {
        success: true,
        data: {
          message: `Successfully updated ${results.length} user roles`,
          results
        }
      };
    } catch (transactionError) {
      await transaction.rollback();
      throw transactionError;
    }
  } catch (error) {
    console.error('Error updating multiple user roles:', error);
    return {
      success: false,
      error: `Failed to update user roles: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}; 