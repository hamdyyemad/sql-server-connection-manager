import type { DatabaseHandler } from '../middleware/database';
import { ParameterBinder, SQLInjectionPrevention } from '../middleware/sql-injection-prevention';

export const setCustomPasswordHandler: DatabaseHandler = async (req, pool) => {
  const { database, userId, newPassword, requirePasswordChange = false } = req.parsedBody;
  
  if (!database || !userId || !newPassword) {
    return {
      success: false,
      error: 'Database name, user ID, and new password are required'
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
    const newPasswordParam = binder.addParameter(newPassword);
    const requirePasswordChangeParam = binder.addParameter(requirePasswordChange);
    
    // Start a transaction
    const transaction = new (await import('mssql')).Transaction(pool);
    await transaction.begin();

    try {
      // Update the user's password
      const updateQuery = `
        UPDATE [${sanitizedDatabase}].[dbo].[AspNetUsers] 
        SET [PasswordHash] = ${newPasswordParam},
            [ChangePass] = ${requirePasswordChangeParam}
        WHERE [Id] = ${userIdParam}
      `;
      
      const updateRequest = transaction.request();
      updateRequest.input(newPasswordParam, newPassword);
      updateRequest.input(requirePasswordChangeParam, requirePasswordChange);
      updateRequest.input(userIdParam, userId);
      
      const result = await updateRequest.query(updateQuery);
      
      if (result.rowsAffected[0] === 0) {
        throw new Error('User not found');
      }

      await transaction.commit();
      
      console.log(`Updated password for user ${userId} in database ${sanitizedDatabase}`);
      
      return {
        success: true,
        data: { message: 'Password updated successfully' }
      };
    } catch (transactionError) {
      await transaction.rollback();
      throw transactionError;
    }
  } catch (error) {
    console.error('Error updating password:', error);
    return {
      success: false,
      error: `Failed to update password: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}; 