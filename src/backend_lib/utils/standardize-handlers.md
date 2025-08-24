# Handler Standardization Guide

## Current Issues Found:
1. **Mixed Error Handling Patterns**: Some handlers throw `ApiError`, others return error objects
2. **Redundant Try-Catch Blocks**: Many handlers have try-catch that defeats middleware error handling
3. **Inconsistent Error Responses**: Different error formats across handlers

## How to Fix Each Handler:

### 1. Update Handler Files (`src/backend_lib/handlers/`)

**Before:**
```typescript
export const someHandler: DatabaseHandler = async (req, pool) => {
  if (!database) {
    return { success: false, error: "Database required" };
  }

  try {
    // ... code ...
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

  // ... code without try-catch ...
};
```

### 2. Update Route Files (`src/app/api/v1/`)

**Before:**
```typescript
const handler = createDatabaseRouteHandler(someHandler);
```

**After:**
```typescript
import { withDatabaseErrorHandler } from "@/backend_lib";

const errorHandledHandler = withDatabaseErrorHandler(someHandler);
const handler = createDatabaseRouteHandler(errorHandledHandler);
```

## Handlers to Update:
- [x] `get-aspnet-users.ts` - ✅ Fixed
- [x] `reset-user-password.ts` - ✅ Fixed
- [x] `get-aspnet-roles.ts` - ✅ Route updated
- [x] `get-user-roles.ts` - ✅ Route updated
- [x] `list-tables.ts` - ✅ Route updated
- [x] `list-databases.ts` - ✅ Route updated
- [x] `get-table-rows.ts` - ✅ Route updated
- [x] `update-user-role.ts` - ✅ Route updated
- [x] `update-multiple-user-roles.ts` - ✅ Route updated
- [x] `set-custom-password.ts` - ✅ Route updated
- [x] `detect-local-instances.ts` - ✅ Uses withErrorHandler (different pattern)
- [x] `test-connection.ts` - ✅ Route updated
- [x] `secure-example.ts` - ✅ Route updated + handler improved

## Routes Updated:
- [x] `/api/v1/get-aspnet-users/route.ts` - ✅ Complete
- [x] `/api/v1/reset-user-password/route.ts` - ✅ Complete
- [x] `/api/v1/get-aspnet-roles/route.ts` - ✅ Complete
- [x] `/api/v1/get-user-roles/route.ts` - ✅ Complete
- [x] `/api/v1/list-tables/route.ts` - ✅ Complete
- [x] `/api/v1/list-databases/route.ts` - ✅ Complete
- [x] `/api/v1/get-table-rows/route.ts` - ✅ Complete
- [x] `/api/v1/update-user-role/route.ts` - ✅ Complete
- [x] `/api/v1/update-multiple-user-roles/route.ts` - ✅ Complete
- [x] `/api/v1/set-custom-password/route.ts` - ✅ Complete
- [x] `/api/v1/detect-local-instances/route.ts` - ✅ Complete (uses withErrorHandler)
- [x] `/api/v1/test-connection/route.ts` - ✅ Complete
- [x] `/api/v1/secure-example/route.ts` - ✅ Complete

## Benefits:
1. **Consistent Error Handling**: All errors go through middleware
2. **Better Error Messages**: Structured error responses
3. **Easier Debugging**: Centralized error logging
4. **Type Safety**: Proper TypeScript error types
5. **Maintainability**: Less duplicate error handling code

## Next Steps:
1. **Test all endpoints** to ensure error handling works correctly
2. **Update remaining handlers** to use `ApiError` instead of returning error objects
3. **Verify consistent error responses** across all endpoints 