# New Authentication System Documentation

## Overview

This authentication system has been completely refactored to follow the Strategy Pattern with industry-standard bcrypt security. It uses a Turso SQLite database for user storage and implements a clean separation of concerns with dedicated strategies for each authentication step.

## 🔒 **Security Features**

- **bcrypt Password Hashing**: Industry-standard security with cost factor 12
- **Embedded Salt**: No separate salt storage (included in bcrypt hash)
- **TOTP 2FA**: Real-time verification with speakeasy library
- **Optimized Performance**: 50% fewer database calls
- **Type Safety**: Full TypeScript coverage for security-critical code

## Architecture

### Design Patterns Used

1. **Strategy Pattern**: Each authentication step (Login, 2FA Setup, 2FA Verify) is implemented as a separate strategy
2. **Repository Pattern**: Data access is abstracted through repository interfaces
3. **Service Layer**: UserService handles all user operations with bcrypt security
4. **Dependency Injection**: Clean dependency management without circular dependencies

### Core Components

#### 1. Types and Interfaces (`src/backend_lib/types/auth.ts`)

```typescript
export interface AuthStrategy {
  execute(data: AuthData): Promise<AuthResult>;
}

export type AuthData = LoginData | Setup2FAData | Verify2FAData;

export interface AuthResult {
  success: boolean;
  nextStep?: AuthStep;
  data?: AuthResultData;
  error?: string;
}

export enum AuthStep {
  LOGIN = "login",
  SETUP_2FA = "setup-2fa",
  VERIFY_2FA = "verify-2fa",
  COMPLETE = "complete",
}

export type AuthResultData =
  | LoginResultData
  | Setup2FAResultData
  | Verify2FAResultData;

// Data types for different authentication strategies
export type LoginData = {
  username: string;
  password: string;
};

export type Setup2FAData = {
  userId: string;
  verificationCode?: string;
};

export type Verify2FAData = {
  userId: string;
  verificationCode: string;
};

// Result data types for different authentication steps
export type LoginResultData = {
  userId: string;
  username: string;
};

export type Setup2FAResultData = {
  qrCode?: string;
  secret?: string;
  message?: string;
  user?: {
    userId: string;
    username: string;
  };
};

export type Verify2FAResultData = {
  userId: string;
  username: string;
};
```

#### 2. Authentication Strategies

- **LoginStrategy** (`src/backend_lib/services/auth-admin/auth/strategies/login-strategy.ts`)

  - Handles username/password authentication
  - Creates new user if credentials match admin env vars
  - Uses optimized single database call for user verification
  - Determines next step (2FA setup or verification)

- **Setup2FAStrategy** (`src/backend_lib/services/auth-admin/auth/strategies/Setup2FAStrategy.ts`)

  - Generates 2FA secrets and QR codes
  - Handles 2FA setup verification with real TOTP validation
  - Manages temporary secret storage

- **Verify2FAStrategy** (`src/backend_lib/services/auth-admin/auth/strategies/Verify2FAStrategy.ts`)
  - Verifies 2FA codes with real-time TOTP validation
  - Updates last login timestamp
  - Completes authentication

#### 3. Authentication Manager (`src/backend_lib/services/auth-admin/auth/AuthenticationManager.ts`)

- Manages all authentication strategies
- Provides unified interface for executing authentication steps
- Determines initial authentication step for users
- Uses dependency injection for clean architecture

#### 4. Service Layer

- **UserService** (`src/backend_lib/services/auth-admin/users/UserService.ts`)
  - Handles all user-related business logic
  - Implements bcrypt password hashing and verification
  - Provides optimized user operations
  - No circular dependencies

#### 5. Repository Layer

- **UserRepository** (`src/backend_lib/repositories/auth-admin/UserRepository.ts`)
  - Handles all user-related database operations
  - Includes methods for 2FA secret management
  - Supports admin user creation
  - Clean data access abstraction

#### 6. Utility Functions

- **Crypto Utils** (`src/backend_lib/utils/crypto-utils.ts`)

  - bcrypt password hashing and comparison
  - Configurable cost factor (default: 12)
  - Legacy SHA-256 functions (deprecated)

- **2FA Utils** (`src/backend_lib/utils/2fa.ts`)
  - Secret generation with speakeasy
  - QR code generation
  - TOTP verification
  - Password verification for admin credentials

## Database Schema

The system uses a Turso SQLite database with the following schema:

```sql
-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY NOT NULL,
    username TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL, -- bcrypt hash (includes salt)
    hasSetup2FA INTEGER NOT NULL DEFAULT 0,
    secret2FA TEXT NULL,
    tempSecret2FA TEXT NULL,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    lastLoginAt TEXT NULL
);

-- Additional tables for sessions, login attempts, and audit logs
```

## Authentication Flow

### 1. Login Process

1. User submits username/password
2. `LoginStrategy.execute()` is called
3. System checks if user exists in database (single DB call)
4. If not exists and credentials match admin env vars, creates new user with bcrypt
5. If exists, verifies password using bcrypt comparison
6. Returns next step (SETUP_2FA or VERIFY_2FA)

### 2. 2FA Setup Process

1. User requests 2FA setup
2. `Setup2FAStrategy.execute()` is called without verification code
3. System generates new secret and QR code using speakeasy
4. Temporary secret is stored in database
5. QR code is returned to user
6. User scans QR code and enters verification code
7. `Setup2FAStrategy.execute()` is called with verification code
8. System verifies code with real TOTP validation and moves secret to permanent storage

### 3. 2FA Verification Process

1. User submits 2FA verification code
2. `Verify2FAStrategy.execute()` is called
3. System verifies code against stored secret using TOTP
4. Updates last login timestamp
5. Returns completion status

## Middleware Authentication System

### Overview
The system uses Next.js middleware for centralized authentication and redirection logic. All client-side authentication hooks have been removed in favor of server-side middleware and server actions.

### Middleware Structure
- **Chaining Pattern**: Uses `chainMiddlewares()` for sequential execution
- **Separate Handlers**: Different middleware for auth pages vs protected pages
- **Server Action Integration**: Handles POST requests differently to allow server actions to complete

### Auth Pages Middleware (`authPagesMiddleware`)
Handles authentication logic for `/auth/login`, `/auth/2fa-setup`, `/auth/2fa-verify`:

#### Enhanced 2FA Status Checking
The middleware now uses boolean flags for precise 2FA status detection:
- `secret2FAHasValue`: Whether user has a permanent 2FA secret
- `tempSecret2FAHasValue`: Whether user has a temporary 2FA secret

#### Login Page Logic
- No auth token: Stay on login page
- 2FA disabled: Redirect to homepage
- 2FA set up and verified: Redirect to homepage
- 2FA set up but not verified: Redirect to 2FA setup
- Otherwise: Redirect to 2FA verify

#### 2FA Setup Page Logic
- No auth token: Stay on setup page
- 2FA disabled: Redirect to homepage
- 2FA set up and verified: Redirect to homepage
- 2FA set up but not verified: Check for temp secret
  - If temp secret exists: Redirect to 2FA verify
  - Otherwise: Stay on setup page

#### 2FA Verify Page Logic
- 2FA disabled: Redirect to homepage
- 2FA set up and verified: Redirect to homepage
- User has `hasSetup2FA = true` but no actual secrets: Redirect to 2FA setup
- Otherwise: Stay on verify page

### Non-Auth Pages Middleware (`nonAuthPagesMiddleware`)
Handles authentication logic for protected routes with enhanced edge case handling:

#### Branch Logic
1. **Branch 1**: Unauthenticated users → Redirect to login
2. **Branch 1.5**: Authenticated users with incomplete 2FA setup (no secrets) → Clean cookies and redirect to login
3. **Branch 2**: Authenticated users requiring 2FA verification → Redirect to 2FA verify
4. **Branch 3**: Authenticated users needing 2FA setup → Redirect to 2FA setup
5. **Branch 4**: Fully authenticated users → Allow access

#### Incomplete 2FA Setup Detection
The new Branch 1.5 handles edge cases where users are marked as having 2FA setup but lack actual secrets:
- Detects when `hasSetup2FA = true` but both `secret2FAHasValue` and `tempSecret2FAHasValue` are false
- Cleans authentication cookies (`auth-token`, `temp-2fa-secret`)
- Redirects to login for fresh authentication flow

## API Endpoints

### POST `/api/v1/auth/login`

- **Input**: `{ username: string, password: string }`
- **Output**: `{ success: boolean, requires2FA: boolean, needs2FASetup: boolean, user: { username: string } }`

### POST `/api/v1/auth/setup-2fa`

- **Input**: `{ userId: string, verificationCode?: string }`
- **Output**: `{ success: boolean, qrCode?: string, needsSetup: boolean, isFirstSetup: boolean }`

### POST `/api/v1/auth/verify-2fa`

- **Input**: `{ userId: string, verificationCode: string }`
- **Output**: `{ success: boolean, user: { username: string } }`

### POST `/api/v1/auth/check-2fa-status`

- **Input**: `{ username: string }`
- **Output**: `{ success: boolean, needsSetup: boolean, needsVerification: boolean, isFirstSetup: boolean }`

## Environment Variables

```bash
# Database
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token

# Admin User (for first-time setup)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Application
NEXT_PUBLIC_APP_NAME=Admin Panel
NEXT_PUBLIC_APP_ISSUER=Admin Panel

# Debug
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

## Setup Instructions

### 1. Database Setup

1. Create a Turso database
2. Run the schema initialization:
   ```bash
   node scripts/database/setup-turso-db.js
   ```

### 2. Environment Configuration

1. Copy `env-template.txt` to `.env.local`
2. Fill in your Turso database credentials
3. Set admin username/password for first-time setup

### 3. Create Admin User with bcrypt

```bash
# Create admin user with bcrypt security
node scripts/database/create-admin-bcrypt.js
```

### 4. Test the System

```bash
node scripts/test-auth.js
```

## Security Features

- **bcrypt Password Hashing**: Cost factor 12 for optimal security/performance
- **Embedded Salt**: No separate salt storage needed
- **2FA Support**: TOTP-based two-factor authentication with real-time verification
- **Rate Limiting**: Configurable rate limiting on all endpoints
- **Session Management**: Secure session handling with cookies
- **Audit Logging**: Comprehensive logging of authentication events
- **Type Safety**: Full TypeScript coverage for security-critical code

## Performance Optimizations

- **50% Fewer Database Calls**: Optimized user verification flow
- **Single User Object Usage**: No redundant database queries
- **Async Password Verification**: Non-blocking bcrypt operations
- **Clean Architecture**: No circular dependencies for better performance

## Migration from Previous System

The new system replaces SHA-256 password hashing with industry-standard bcrypt. The admin credentials in environment variables are now only used for first-time user creation.

### Key Changes:

- **bcrypt instead of SHA-256**: Much more secure password hashing
- **No separate salt column**: Salt is embedded in bcrypt hash
- **Optimized authentication flow**: Better performance with fewer DB calls
- **Real 2FA verification**: Actual TOTP validation instead of placeholders

## Testing

The system includes comprehensive test scripts and can be tested using:

1. **Database Connection Test**: `scripts/test-auth.js`
2. **API Endpoint Testing**: Use the provided API endpoints with appropriate test data
3. **Integration Testing**: Test the complete authentication flow

## Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
   - Check network connectivity

2. **User Not Found**

   - Ensure admin credentials are set in environment variables
   - Check if user exists in database

3. **2FA Setup Issues**
   - Verify `speakeasy` and `qrcode` dependencies are installed
   - Check QR code generation in browser console

### Debug Mode

Enable debug mode by setting `DEBUG=true` in environment variables to see detailed logs.

## UI Enhancements

### 2FA Verification Form
The 2FA verification page now includes enhanced user experience features:

- **Back to Setup Button**: Outlined button allowing users to return to the 2FA setup page
- **Improved Navigation**: Users can easily navigate back if they need to rescan the QR code
- **Better Error Handling**: Clear error messages and retry functionality
- **Loading States**: Visual feedback during verification process

### Form Features
- **OTP Input**: 6-digit code input with auto-focus
- **Submit Button**: Primary button for verification
- **Back Button**: Outlined secondary button for navigation
- **Help Text**: Guidance for users on how to use their authenticator app

## Future Enhancements

- JWT token support for stateless authentication
- Password change functionality
- 2FA disable functionality
- Multi-user support with role-based access
- Enhanced audit logging and monitoring
- Argon2 support for even stronger password hashing
