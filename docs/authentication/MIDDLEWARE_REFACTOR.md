# Middleware Refactor Documentation

## Overview

The authentication system has been refactored to move all redirect logic from client-side hooks to server-side middleware and server actions. This provides better performance, security, and maintainability.

## Changes Made

### 1. Removed Client-Side Hooks

The following hooks have been removed as their functionality is now handled by middleware and server actions:

- `src/app/auth/hooks/use-auth-check.ts` - Authentication status checking
- `src/app/auth/hooks/use-login-redirect.ts` - Login redirect handling
- `src/app/auth/login/hooks/use-login-redirect.ts` - Duplicate login redirect hook

### 2. Updated Components

- **LoginFormServer**: Removed hook usage, simplified component
- **TwoFactorSetupContainer**: Removed client-side redirect logic, simplified `handleNext` function
- **TwoFactorVerifyFormServer**: Removed client-side redirect logic

### 3. Enhanced Server Actions

- **loginAction**: Now handles redirects directly based on `nextStep` response
- **verify2FAAction**: Already handled redirects correctly
- **setup2FAAction**: Handles QR code generation without redirects

### 4. New Middleware Structure

The middleware now uses a chaining pattern with separate handlers for auth pages and non-auth pages:

```typescript
// Main middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isQuickExit(pathname)) {
    return NextResponse.next();
  }

  if (isAuthPath(pathname)) {
    return chainMiddlewares(request, [authPagesMiddleware]);
  } else {
    return chainMiddlewares(request, [nonAuthPagesMiddleware]);
  }
}
```

## Middleware Functions

### 1. `authPagesMiddleware`

Handles authentication logic for auth pages (`/auth/login`, `/auth/2fa-setup`, `/auth/2fa-verify`):

#### POST Requests
- Skip authentication checks to allow server actions to complete
- Server actions handle redirects based on response

#### GET Requests
- Check authentication status and redirect if needed

#### Login Page Logic (`/auth/login`)
- If no auth token: Stay on login page
- If 2FA disabled: Redirect to homepage
- If 2FA set up and verified: Redirect to homepage
- If 2FA set up but not verified: Redirect to 2FA setup
- Otherwise: Redirect to 2FA verify

#### 2FA Setup Page Logic (`/auth/2fa-setup`)
- If no auth token: Stay on setup page
- If 2FA disabled: Redirect to homepage
- If 2FA set up and verified: Redirect to homepage
- If 2FA set up but not verified: Check for temp secret
  - If temp secret exists: Redirect to 2FA verify
  - Otherwise: Stay on setup page

#### 2FA Verify Page Logic (`/auth/2fa-verify`)
- If 2FA disabled: Redirect to homepage
- If 2FA set up and verified: Redirect to homepage
- If user has `hasSetup2FA = true` but no actual secrets (`!secret2FAHasValue && !tempSecret2FAHasValue`): Redirect to 2FA setup
- Otherwise: Stay on verify page

### 2. `nonAuthPagesMiddleware`

Handles authentication logic for protected routes:

- **Branch 1**: Unauthenticated users → Redirect to login
- **Branch 1.5**: Authenticated users with incomplete 2FA setup (no secrets) → Clean cookies and redirect to login
- **Branch 2**: Authenticated users requiring 2FA verification → Redirect to 2FA verify
- **Branch 3**: Authenticated users needing 2FA setup → Redirect to 2FA setup
- **Branch 4**: Fully authenticated users → Allow access

#### Branch 1.5: Incomplete 2FA Setup Check
This new check handles edge cases where a user is marked as having 2FA setup (`hasSetup2FA = true`) but actually has no 2FA secrets in the database. When this condition is detected:
- Logs the issue for debugging
- Creates a redirect response to the login page
- Cleans authentication cookies (`auth-token`, `temp-2fa-secret`)
- Returns the response with cleaned cookies

This ensures users with corrupted or incomplete 2FA setup go through a fresh authentication flow.

## Authentication Status Flags

The middleware now uses enhanced boolean flags for better 2FA status checking:

### Available Flags
- `isAuthenticated`: Whether user has valid auth token
- `hasSetup2FA`: Whether user has completed 2FA setup
- `is2FAVerified`: Whether user has verified 2FA
- `is2FAEnabled`: Whether 2FA is enabled for the system
- `secret2FAHasValue`: Whether user has a permanent 2FA secret (boolean)
- `tempSecret2FAHasValue`: Whether user has a temporary 2FA secret (boolean)

### Flag Derivation
The `secret2FAHasValue` and `tempSecret2FAHasValue` flags are derived from the actual secret values:
```typescript
secret2FAHasValue: !!(user.secret2FA && user.secret2FA.trim() !== '')
tempSecret2FAHasValue: !!(user.tempSecret2FA && user.tempSecret2FA.trim() !== '')
```

These flags enable more precise middleware logic, particularly for detecting incomplete 2FA setups.

## Server Action Redirects

### Login Action
```typescript
// Handle redirects based on nextStep
switch (nextStep) {
  case "complete":
    revalidatePath("/");
    redirect("/");
    break;
  case "setup-2fa":
    revalidatePath("/auth/2fa-setup");
    redirect("/auth/2fa-setup");
    break;
  case "verify-2fa":
    revalidatePath("/auth/2fa-verify");
    redirect("/auth/2fa-verify");
    break;
  default:
    revalidatePath("/");
    redirect("/");
}
```

### 2FA Verify Action
- Already handles redirect to homepage after successful verification

## Benefits

1. **Performance**: No client-side authentication checks
2. **Security**: All redirects happen server-side
3. **Maintainability**: Centralized authentication logic
4. **Consistency**: Uniform behavior across all pages
5. **Reduced Bundle Size**: Removed client-side hooks
6. **Better UX**: Immediate redirects after form submissions

## Usage

The middleware and server actions automatically handle all authentication redirects. Components no longer need to:

- Check authentication status
- Handle redirects based on 2FA status
- Import or use authentication hooks

Components can focus on their primary functionality while the middleware ensures proper authentication flow.

## Testing

To test the middleware:

1. Try accessing protected routes without authentication
2. Test 2FA flow with different user states
3. Verify redirects work correctly for all auth pages
4. Check that fully authenticated users can access protected routes
5. Test form submissions to ensure server actions handle redirects properly
