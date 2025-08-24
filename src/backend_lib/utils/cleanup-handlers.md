# Handler Cleanup Guide

## What to Keep vs Remove:

### ✅ KEEP (Infrastructure Error Handling):
- `src/backend_lib/middleware/database.ts` - Keep try-catch for connection/validation errors
- `src/backend_lib/helpers/databaseOperations.ts` - Keep try-catch for connection-level errors
- `src/backend_lib/validations/*.ts` - Keep validation error handling

### ❌ REMOVE (Business Logic Error Handling):
- Handler try-catch blocks that return error objects
- Manual error formatting in handlers
- Redundant error logging in handlers

## Pattern to Follow:

**Before:**
```typescript
export const someHandler: DatabaseHandler = async (req, pool) => {
  if (!database) {
    return { success: false, error: "Database required" };
  }

  try {
    // ... business logic ...
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

**After:**
```typescript
import { ApiError } from '../middleware/error-handler';

export const someHandler: DatabaseHandler = async (req, pool) => {
  if (!database) {
    throw ApiError.badRequest("Database required");
  }

  // ... business logic ...
  return { success: true, data: result };
};
```

## Handlers to Clean Up:
- [x] `list-databases.ts` - ✅ Cleaned
- [x] `list-tables.ts` - ✅ Cleaned
- [x] `get-aspnet-users.ts` - ✅ Already clean
- [x] `reset-user-password.ts` - ✅ Already clean
- [ ] `get-aspnet-roles.ts` - Needs cleanup
- [ ] `get-user-roles.ts` - Needs cleanup
- [ ] `get-table-rows.ts` - Needs cleanup
- [ ] `update-user-role.ts` - Needs cleanup
- [ ] `update-multiple-user-roles.ts` - Needs cleanup
- [ ] `set-custom-password.ts` - Needs cleanup
- [ ] `test-connection.ts` - Needs cleanup
- [ ] `detect-local-instances.ts` - Needs cleanup

## Benefits:
1. **Cleaner Code**: Less boilerplate in handlers
2. **Consistent Errors**: All errors go through middleware
3. **Better Debugging**: Centralized error handling
4. **Easier Maintenance**: Less duplicate error handling code 