# Security Middleware Refactor

## Overview

The `auth-security.ts` middleware has been refactored to improve code organization and maintainability by separating concerns into dedicated utility files.

## Changes Made

### 1. Security Utilities (`src/backend_lib/utils/security-utils.ts`)

**Extracted Functions:**

- `getClientIP()` - Extract client IP from request headers
- `checkRateLimit()` - Check and manage rate limiting
- `addSecurityHeaders()` - Add security headers to responses
- `createRateLimitResponse()` - Create standardized rate limit error response
- `clearRateLimit()` - Clear rate limit data (for testing)
- `getRateLimitData()` - Get current rate limit data (for debugging)

**Configuration:**

- `RATE_LIMIT_CONFIG` - Rate limiting configuration object

### 2. Authentication Schemas (`src/backend_lib/validations/auth-schemas.ts`)

**Extracted Schemas:**

- `AuthSchemas.login` - Login validation schema
- `AuthSchemas.setup2FA` - 2FA setup validation schema
- `AuthSchemas.verify2FA` - 2FA verification validation schema
- `AuthSchemas.check2FAStatus` - 2FA status check validation schema

**Type Definitions:**

- `AuthSchemaKeys` - Type for schema keys
- `LoginData`, `Setup2FAData`, `Verify2FAData`, `Check2FAStatusData` - Inferred types from schemas

### 3. Updated Middleware (`src/backend_lib/middleware/auth-security.ts`)

**Changes:**

- Removed inline function definitions
- Added imports for security utilities and auth schemas
- Simplified `createSecureAuthHandler` function
- Maintained all existing functionality

### 4. Updated Exports

**Utils Index (`src/backend_lib/utils/index.ts`):**

- Added export for `security-utils`

**Validations Index (`src/backend_lib/validations/index.ts`):**

- Added export for `auth-schemas`

## Benefits

1. **Separation of Concerns**: Each file has a single responsibility
2. **Reusability**: Security utilities can be used in other parts of the application
3. **Testability**: Individual functions can be tested in isolation
4. **Maintainability**: Easier to modify and extend individual components
5. **Type Safety**: Better TypeScript support with dedicated type definitions

## Usage

### Before Refactor

```typescript
// All functions and schemas were inline in auth-security.ts
```

### After Refactor

```typescript
// Import security utilities
import {
  getClientIP,
  checkRateLimit,
  addSecurityHeaders,
  createRateLimitResponse,
} from "../utils/security-utils";

// Import auth schemas
import { AuthSchemas } from "../validations/auth-schemas";

// Use in middleware
export function createSecureAuthHandler(
  handler: (request: NextRequest) => Promise<NextResponse>,
  endpoint: keyof typeof AuthSchemas
) {
  // Implementation using imported utilities
}
```

## Testing

Run the test script to verify the refactor:

```bash
node scripts/testing/test-security-refactor-simple.js
```

## Migration Notes

- All existing functionality is preserved
- No breaking changes to the public API
- Existing route handlers continue to work without modification
- Rate limiting behavior remains the same
- Security headers are still applied consistently

## Future Enhancements

1. **Redis Integration**: Replace in-memory rate limiting with Redis for production
2. **Configurable Limits**: Make rate limiting configurable per endpoint
3. **Enhanced Logging**: Add detailed security event logging
4. **Metrics**: Add rate limiting metrics and monitoring
