# SQL Injection Prevention Guide

This guide explains the comprehensive SQL injection prevention system implemented in this application.

## Overview

The SQL injection prevention system consists of:

1. **SQL Injection Prevention Middleware** - Validates and sanitizes input
2. **Parameter Binding Utilities** - Safely binds parameters to SQL queries
3. **Input Validation Schemas** - Zod schemas for request validation
4. **Updated Handlers** - All database handlers now use parameter binding

## Components

### 1. SQL Injection Prevention Class

Located in `src/backend/middleware/sql-injection-prevention.ts`

```typescript
import { SQLInjectionPrevention } from '../middleware/sql-injection-prevention';

const sqlPrevention = new SQLInjectionPrevention();

// Validate input
const validation = sqlPrevention.validateInput(userInput, 'fieldName');
if (!validation.isValid) {
  return { success: false, error: validation.error };
}

// Validate identifiers (database, table, column names)
const dbValidation = sqlPrevention.validateIdentifier(databaseName, 'database');
if (!dbValidation.isValid) {
  return { success: false, error: dbValidation.error };
}
```

**Features:**
- Blocks SQL keywords and dangerous patterns
- Validates character sets
- Enforces length limits
- Prevents common SQL injection attacks

### 2. Parameter Binding Utilities

```typescript
import { ParameterBinder } from '../middleware/sql-injection-prevention';

const binder = new ParameterBinder();

// Add parameters safely
const dbParam = binder.addParameter(database);
const userIdParam = binder.addParameter(userId);

// Build safe query
const query = `
  SELECT * FROM [${dbParam}].[dbo].[Users] 
  WHERE [Id] = ${userIdParam}
`;

// Execute with parameters
const request = pool.request();
const parameters = binder.getParameters();
for (const [name, value] of Object.entries(parameters)) {
  request.input(name, value);
}
const result = await request.query(query);
```

### 3. Validation Schemas

Predefined Zod schemas for common request types:

```typescript
import { 
  DatabaseRequestSchema, 
  UserRoleRequestSchema,
  PasswordRequestSchema 
} from '../middleware/sql-injection-prevention';

// Validate request body
const validation = validateRequestBody(DatabaseRequestSchema, body);
if (!validation.isValid) {
  return { success: false, error: validation.error };
}
```

## Usage Examples

### Example 1: Basic Parameter Binding

```typescript
export const secureHandler: DatabaseHandler = async (req, pool) => {
  const { database, userId } = req.parsedBody;
  
  // Initialize parameter binder
  const binder = new ParameterBinder();
  
  // Add parameters safely
  const dbParam = binder.addParameter(database);
  const userIdParam = binder.addParameter(userId);
  
  // Build safe query
  const query = `
    SELECT * FROM [${dbParam}].[dbo].[Users] 
    WHERE [Id] = ${userIdParam}
  `;
  
  // Execute with parameters
  const request = pool.request();
  const parameters = binder.getParameters();
  for (const [name, value] of Object.entries(parameters)) {
    request.input(name, value);
  }
  
  const result = await request.query(query);
  
  return {
    success: true,
    data: result.recordset
  };
};
```

### Example 2: With Input Validation

```typescript
export const secureHandlerWithValidation: DatabaseHandler = async (req, pool) => {
  const { database, search } = req.parsedBody;
  
  // Initialize prevention utilities
  const sqlPrevention = new SQLInjectionPrevention();
  const binder = new ParameterBinder();
  
  // Validate database name
  const dbValidation = sqlPrevention.validateIdentifier(database, 'database');
  if (!dbValidation.isValid) {
    return { success: false, error: dbValidation.error };
  }
  
  // Validate search term
  if (search) {
    const searchValidation = sqlPrevention.validateInput(search, 'search');
    if (!searchValidation.isValid) {
      return { success: false, error: searchValidation.error };
    }
  }
  
  // Build safe query with parameters
  const dbParam = binder.addParameter(database);
  const searchParam = search ? binder.addParameter(`%${search}%`) : null;
  
  let query = `SELECT * FROM [${dbParam}].[dbo].[Users]`;
  if (searchParam) {
    query += ` WHERE [Name] LIKE ${searchParam}`;
  }
  
  // Execute query
  const request = pool.request();
  const parameters = binder.getParameters();
  for (const [name, value] of Object.entries(parameters)) {
    request.input(name, value);
  }
  
  const result = await request.query(query);
  
  return {
    success: true,
    data: result.recordset
  };
};
```

### Example 3: Using Validation Schemas

```typescript
import { DatabaseRequestSchema, validateRequestBody } from '../middleware/sql-injection-prevention';

export const schemaValidatedHandler: DatabaseHandler = async (req, pool) => {
  // Validate request body using schema
  const validation = validateRequestBody(DatabaseRequestSchema, req.parsedBody);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }
  
  const { database, page, limit, search } = validation.data;
  
  // Continue with safe parameter binding...
  const binder = new ParameterBinder();
  // ... rest of implementation
};
```

## Security Features

### 1. SQL Keyword Blocking

The system blocks dangerous SQL keywords:
- `DROP`, `DELETE`, `TRUNCATE`, `ALTER`, `CREATE`
- `EXEC`, `EXECUTE`, `INSERT`, `UPDATE`, `MERGE`
- `UNION`, `SELECT INTO`, `OUTFILE`, `DUMPFILE`
- Comments: `--`, `/*`, `*/`
- Stored procedures: `sp_`, `xp_`

### 2. Pattern Detection

Detects common SQL injection patterns:
- Union-based attacks
- Comment-based attacks
- Stored procedure attacks
- File system attacks

### 3. Character Validation

Validates input against allowed character sets:
- Alphanumeric characters
- Common punctuation
- Safe special characters
- Blocks dangerous characters

### 4. Length Limits

Enforces maximum input lengths to prevent buffer overflow attacks.

## Updated Handlers

All database handlers have been updated to use parameter binding:

1. **get-table-rows.ts** - Safe table row retrieval
2. **get-aspnet-users.ts** - Secure user listing with search
3. **update-user-role.ts** - Safe role updates
4. **update-multiple-user-roles.ts** - Batch role updates
5. **set-custom-password.ts** - Secure password setting
6. **reset-user-password.ts** - Safe password reset
7. **get-user-roles.ts** - Secure role retrieval
8. **get-aspnet-roles.ts** - Safe role listing
9. **list-tables.ts** - Secure table listing

## Best Practices

### 1. Always Use Parameter Binding

❌ **Dangerous (String Concatenation):**
```typescript
const query = `SELECT * FROM Users WHERE Id = '${userId}'`;
```

✅ **Safe (Parameter Binding):**
```typescript
const userIdParam = binder.addParameter(userId);
const query = `SELECT * FROM Users WHERE Id = ${userIdParam}`;
```

### 2. Validate Input Before Processing

```typescript
const validation = sqlPrevention.validateInput(userInput, 'fieldName');
if (!validation.isValid) {
  return { success: false, error: validation.error };
}
```

### 3. Use Validation Schemas

```typescript
const validation = validateRequestBody(DatabaseRequestSchema, body);
if (!validation.isValid) {
  return { success: false, error: validation.error };
}
```

### 4. Handle Errors Gracefully

```typescript
try {
  const result = await request.query(query);
  return { success: true, data: result.recordset };
} catch (error) {
  console.error('Database error:', error);
  return {
    success: false,
    error: `Database operation failed: ${error.message}`
  };
}
```

### 5. Use Transactions for Multiple Operations

```typescript
const transaction = new sql.Transaction(pool);
await transaction.begin();

try {
  // Multiple operations...
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
  throw error;
}
```

## Testing SQL Injection Prevention

### Test Cases

1. **Basic SQL Injection:**
   ```
   Input: "'; DROP TABLE Users; --"
   Expected: Blocked by keyword detection
   ```

2. **Union Attack:**
   ```
   Input: "' UNION SELECT * FROM Users --"
   Expected: Blocked by pattern detection
   ```

3. **Comment Attack:**
   ```
   Input: "admin'--"
   Expected: Blocked by comment detection
   ```

4. **Stored Procedure Attack:**
   ```
   Input: "'; EXEC xp_cmdshell 'dir' --"
   Expected: Blocked by keyword detection
   ```

### Testing Commands

```bash
# Test with curl
curl -X POST http://localhost:3000/api/v1/get-table-rows \
  -H "Content-Type: application/json" \
  -d '{"database":"test","table":"users; DROP TABLE users; --"}'
```

## Configuration

### Customizing Prevention Rules

```typescript
const sqlPrevention = new SQLInjectionPrevention({
  maxQueryLength: 5000,
  allowedCharacters: /^[a-zA-Z0-9\s\-_\.]+$/,
  blockKeywords: ['DROP', 'DELETE', 'CUSTOM_KEYWORD']
});
```

### Environment Variables

```env
# Maximum query length (default: 10000)
SQL_MAX_QUERY_LENGTH=5000

# Enable/disable prevention (default: true)
SQL_INJECTION_PREVENTION_ENABLED=true
```

## Monitoring and Logging

The system includes comprehensive logging:

```typescript
console.log('🔍 Debug: SQL injection prevention check passed');
console.log('❌ Debug: SQL injection attempt blocked:', validation.error);
```

## Conclusion

This SQL injection prevention system provides:

1. **Comprehensive Protection** - Multiple layers of defense
2. **Easy Integration** - Simple API for existing code
3. **Flexible Configuration** - Customizable rules and limits
4. **Performance Optimized** - Minimal overhead
5. **Developer Friendly** - Clear error messages and logging

By following this guide and using the provided utilities, your application will be protected against SQL injection attacks while maintaining clean, maintainable code. 