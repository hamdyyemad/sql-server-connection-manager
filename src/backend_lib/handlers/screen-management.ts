import type { DatabaseHandler } from '../middleware/database';
import { ParameterBinder, SQLInjectionPrevention } from '../middleware/sql-injection-prevention';

// Screens handlers
export const addScreenHandler: DatabaseHandler = async (req, pool) => {
  const { database, name, description, isActive = true } = req.parsedBody;
  
  if (!database || !name) {
    return {
      success: false,
      error: 'Database name and screen name are required'
    };
  }

  try {
    const sqlPrevention = new SQLInjectionPrevention();
    const dbValidation = sqlPrevention.validateIdentifier(database, 'database');
    
    if (!dbValidation.isValid) {
      return {
        success: false,
        error: `Invalid database name: ${dbValidation.error}`
      };
    }

    const sanitizedDatabase = dbValidation.sanitized;
    const binder = new ParameterBinder();
    
    const nameParam = binder.addParameter(name);
    const descriptionParam = binder.addParameter(description || '');
    const isActiveParam = binder.addParameter(isActive);
    
    const query = `
      INSERT INTO [${sanitizedDatabase}].[dpo].[Screens] ([Name], [Description], [IsActive])
      VALUES (${nameParam}, ${descriptionParam}, ${isActiveParam})
    `;
    
    const request = pool.request();
    request.input(nameParam, name);
    request.input(descriptionParam, description || '');
    request.input(isActiveParam, isActive);
    
    await request.query(query);
    
    console.log(`Added new screen "${name}" to database ${sanitizedDatabase}`);
    
    return {
      success: true,
      data: { message: 'Screen added successfully' }
    };
  } catch (error) {
    console.error('Error adding screen:', error);
    return {
      success: false,
      error: `Failed to add screen: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const updateScreenHandler: DatabaseHandler = async (req, pool) => {
  const { database, id, name, description, isActive } = req.parsedBody;
  
  if (!database || !id || !name) {
    return {
      success: false,
      error: 'Database name, screen ID, and screen name are required'
    };
  }

  try {
    const sqlPrevention = new SQLInjectionPrevention();
    const dbValidation = sqlPrevention.validateIdentifier(database, 'database');
    
    if (!dbValidation.isValid) {
      return {
        success: false,
        error: `Invalid database name: ${dbValidation.error}`
      };
    }

    const sanitizedDatabase = dbValidation.sanitized;
    const binder = new ParameterBinder();
    
    const idParam = binder.addParameter(id);
    const nameParam = binder.addParameter(name);
    const descriptionParam = binder.addParameter(description || '');
    const isActiveParam = binder.addParameter(isActive);
    
    const query = `
      UPDATE [${sanitizedDatabase}].[dpo].[Screens] 
      SET [Name] = ${nameParam}, [Description] = ${descriptionParam}, [IsActive] = ${isActiveParam}
      WHERE [Id] = ${idParam}
    `;
    
    const request = pool.request();
    request.input(idParam, id);
    request.input(nameParam, name);
    request.input(descriptionParam, description || '');
    request.input(isActiveParam, isActive);
    
    const result = await request.query(query);
    
    if (result.rowsAffected[0] === 0) {
      return {
        success: false,
        error: 'Screen not found'
      };
    }
    
    console.log(`Updated screen ${id} in database ${sanitizedDatabase}`);
    
    return {
      success: true,
      data: { message: 'Screen updated successfully' }
    };
  } catch (error) {
    console.error('Error updating screen:', error);
    return {
      success: false,
      error: `Failed to update screen: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const deleteScreenHandler: DatabaseHandler = async (req, pool) => {
  const { database, id } = req.parsedBody;
  
  if (!database || !id) {
    return {
      success: false,
      error: 'Database name and screen ID are required'
    };
  }

  try {
    const sqlPrevention = new SQLInjectionPrevention();
    const dbValidation = sqlPrevention.validateIdentifier(database, 'database');
    
    if (!dbValidation.isValid) {
      return {
        success: false,
        error: `Invalid database name: ${dbValidation.error}`
      };
    }

    const sanitizedDatabase = dbValidation.sanitized;
    const binder = new ParameterBinder();
    
    const idParam = binder.addParameter(id);
    
    const query = `
      DELETE FROM [${sanitizedDatabase}].[dpo].[Screens] 
      WHERE [Id] = ${idParam}
    `;
    
    const request = pool.request();
    request.input(idParam, id);
    
    const result = await request.query(query);
    
    if (result.rowsAffected[0] === 0) {
      return {
        success: false,
        error: 'Screen not found'
      };
    }
    
    console.log(`Deleted screen ${id} from database ${sanitizedDatabase}`);
    
    return {
      success: true,
      data: { message: 'Screen deleted successfully' }
    };
  } catch (error) {
    console.error('Error deleting screen:', error);
    return {
      success: false,
      error: `Failed to delete screen: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Actions handlers
export const addActionHandler: DatabaseHandler = async (req, pool) => {
  const { database, name, description, isActive = true } = req.parsedBody;
  
  if (!database || !name) {
    return {
      success: false,
      error: 'Database name and action name are required'
    };
  }

  try {
    const sqlPrevention = new SQLInjectionPrevention();
    const dbValidation = sqlPrevention.validateIdentifier(database, 'database');
    
    if (!dbValidation.isValid) {
      return {
        success: false,
        error: `Invalid database name: ${dbValidation.error}`
      };
    }

    const sanitizedDatabase = dbValidation.sanitized;
    const binder = new ParameterBinder();
    
    const nameParam = binder.addParameter(name);
    const descriptionParam = binder.addParameter(description || '');
    const isActiveParam = binder.addParameter(isActive);
    
    const query = `
      INSERT INTO [${sanitizedDatabase}].[dpo].[ActionClaimsTable] ([Name], [Description], [IsActive])
      VALUES (${nameParam}, ${descriptionParam}, ${isActiveParam})
    `;
    
    const request = pool.request();
    request.input(nameParam, name);
    request.input(descriptionParam, description || '');
    request.input(isActiveParam, isActive);
    
    await request.query(query);
    
    console.log(`Added new action "${name}" to database ${sanitizedDatabase}`);
    
    return {
      success: true,
      data: { message: 'Action added successfully' }
    };
  } catch (error) {
    console.error('Error adding action:', error);
    return {
      success: false,
      error: `Failed to add action: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const updateActionHandler: DatabaseHandler = async (req, pool) => {
  const { database, id, name, description, isActive } = req.parsedBody;
  
  if (!database || !id || !name) {
    return {
      success: false,
      error: 'Database name, action ID, and action name are required'
    };
  }

  try {
    const sqlPrevention = new SQLInjectionPrevention();
    const dbValidation = sqlPrevention.validateIdentifier(database, 'database');
    
    if (!dbValidation.isValid) {
      return {
        success: false,
        error: `Invalid database name: ${dbValidation.error}`
      };
    }

    const sanitizedDatabase = dbValidation.sanitized;
    const binder = new ParameterBinder();
    
    const idParam = binder.addParameter(id);
    const nameParam = binder.addParameter(name);
    const descriptionParam = binder.addParameter(description || '');
    const isActiveParam = binder.addParameter(isActive);
    
    const query = `
      UPDATE [${sanitizedDatabase}].[dpo].[ActionClaimsTable] 
      SET [Name] = ${nameParam}, [Description] = ${descriptionParam}, [IsActive] = ${isActiveParam}
      WHERE [Id] = ${idParam}
    `;
    
    const request = pool.request();
    request.input(idParam, id);
    request.input(nameParam, name);
    request.input(descriptionParam, description || '');
    request.input(isActiveParam, isActive);
    
    const result = await request.query(query);
    
    if (result.rowsAffected[0] === 0) {
      return {
        success: false,
        error: 'Action not found'
      };
    }
    
    console.log(`Updated action ${id} in database ${sanitizedDatabase}`);
    
    return {
      success: true,
      data: { message: 'Action updated successfully' }
    };
  } catch (error) {
    console.error('Error updating action:', error);
    return {
      success: false,
      error: `Failed to update action: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const deleteActionHandler: DatabaseHandler = async (req, pool) => {
  const { database, id } = req.parsedBody;
  
  if (!database || !id) {
    return {
      success: false,
      error: 'Database name and action ID are required'
    };
  }

  try {
    const sqlPrevention = new SQLInjectionPrevention();
    const dbValidation = sqlPrevention.validateIdentifier(database, 'database');
    
    if (!dbValidation.isValid) {
      return {
        success: false,
        error: `Invalid database name: ${dbValidation.error}`
      };
    }

    const sanitizedDatabase = dbValidation.sanitized;
    const binder = new ParameterBinder();
    
    const idParam = binder.addParameter(id);
    
    const query = `
      DELETE FROM [${sanitizedDatabase}].[dpo].[ActionClaimsTable] 
      WHERE [Id] = ${idParam}
    `;
    
    const request = pool.request();
    request.input(idParam, id);
    
    const result = await request.query(query);
    
    if (result.rowsAffected[0] === 0) {
      return {
        success: false,
        error: 'Action not found'
      };
    }
    
    console.log(`Deleted action ${id} from database ${sanitizedDatabase}`);
    
    return {
      success: true,
      data: { message: 'Action deleted successfully' }
    };
  } catch (error) {
    console.error('Error deleting action:', error);
    return {
      success: false,
      error: `Failed to delete action: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// User Claims handlers
export const addUserClaimHandler: DatabaseHandler = async (req, pool) => {
  const { database, userId, claimType, claimValue } = req.parsedBody;
  
  if (!database || !userId || !claimType || !claimValue) {
    return {
      success: false,
      error: 'Database name, user ID, claim type, and claim value are required'
    };
  }

  try {
    const sqlPrevention = new SQLInjectionPrevention();
    const dbValidation = sqlPrevention.validateIdentifier(database, 'database');
    
    if (!dbValidation.isValid) {
      return {
        success: false,
        error: `Invalid database name: ${dbValidation.error}`
      };
    }

    const sanitizedDatabase = dbValidation.sanitized;
    const binder = new ParameterBinder();
    
    const userIdParam = binder.addParameter(userId);
    const claimTypeParam = binder.addParameter(claimType);
    const claimValueParam = binder.addParameter(claimValue);
    
    const query = `
      INSERT INTO [${sanitizedDatabase}].[dpo].[AspNetUserClaims] ([UserId], [ClaimType], [ClaimValue])
      VALUES (${userIdParam}, ${claimTypeParam}, ${claimValueParam})
    `;
    
    const request = pool.request();
    request.input(userIdParam, userId);
    request.input(claimTypeParam, claimType);
    request.input(claimValueParam, claimValue);
    
    await request.query(query);
    
    console.log(`Added new user claim for user ${userId} in database ${sanitizedDatabase}`);
    
    return {
      success: true,
      data: { message: 'User claim added successfully' }
    };
  } catch (error) {
    console.error('Error adding user claim:', error);
    return {
      success: false,
      error: `Failed to add user claim: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const updateUserClaimHandler: DatabaseHandler = async (req, pool) => {
  const { database, id, userId, claimType, claimValue } = req.parsedBody;
  
  if (!database || !id || !userId || !claimType || !claimValue) {
    return {
      success: false,
      error: 'Database name, claim ID, user ID, claim type, and claim value are required'
    };
  }

  try {
    const sqlPrevention = new SQLInjectionPrevention();
    const dbValidation = sqlPrevention.validateIdentifier(database, 'database');
    
    if (!dbValidation.isValid) {
      return {
        success: false,
        error: `Invalid database name: ${dbValidation.error}`
      };
    }

    const sanitizedDatabase = dbValidation.sanitized;
    const binder = new ParameterBinder();
    
    const idParam = binder.addParameter(id);
    const userIdParam = binder.addParameter(userId);
    const claimTypeParam = binder.addParameter(claimType);
    const claimValueParam = binder.addParameter(claimValue);
    
    const query = `
      UPDATE [${sanitizedDatabase}].[dpo].[AspNetUserClaims] 
      SET [UserId] = ${userIdParam}, [ClaimType] = ${claimTypeParam}, [ClaimValue] = ${claimValueParam}
      WHERE [Id] = ${idParam}
    `;
    
    const request = pool.request();
    request.input(idParam, id);
    request.input(userIdParam, userId);
    request.input(claimTypeParam, claimType);
    request.input(claimValueParam, claimValue);
    
    const result = await request.query(query);
    
    if (result.rowsAffected[0] === 0) {
      return {
        success: false,
        error: 'User claim not found'
      };
    }
    
    console.log(`Updated user claim ${id} in database ${sanitizedDatabase}`);
    
    return {
      success: true,
      data: { message: 'User claim updated successfully' }
    };
  } catch (error) {
    console.error('Error updating user claim:', error);
    return {
      success: false,
      error: `Failed to update user claim: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const deleteUserClaimHandler: DatabaseHandler = async (req, pool) => {
  const { database, id } = req.parsedBody;
  
  if (!database || !id) {
    return {
      success: false,
      error: 'Database name and claim ID are required'
    };
  }

  try {
    const sqlPrevention = new SQLInjectionPrevention();
    const dbValidation = sqlPrevention.validateIdentifier(database, 'database');
    
    if (!dbValidation.isValid) {
      return {
        success: false,
        error: `Invalid database name: ${dbValidation.error}`
      };
    }

    const sanitizedDatabase = dbValidation.sanitized;
    const binder = new ParameterBinder();
    
    const idParam = binder.addParameter(id);
    
    const query = `
      DELETE FROM [${sanitizedDatabase}].[dpo].[AspNetUserClaims] 
      WHERE [Id] = ${idParam}
    `;
    
    const request = pool.request();
    request.input(idParam, id);
    
    const result = await request.query(query);
    
    if (result.rowsAffected[0] === 0) {
      return {
        success: false,
        error: 'User claim not found'
      };
    }
    
    console.log(`Deleted user claim ${id} from database ${sanitizedDatabase}`);
    
    return {
      success: true,
      data: { message: 'User claim deleted successfully' }
    };
  } catch (error) {
    console.error('Error deleting user claim:', error);
    return {
      success: false,
      error: `Failed to delete user claim: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}; 