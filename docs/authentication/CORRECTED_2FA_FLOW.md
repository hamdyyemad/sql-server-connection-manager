# Corrected 2FA Authentication Flow

## Overview
This document explains the corrected authentication and 2FA flow that follows the proper security sequence.

## Flow Steps

### 1. **Login Phase**
- User enters username and password
- **API**: `POST /api/v1/login`
- **Action**: Verify credentials against `.env` file
- **Result**: If valid, set `auth-token` cookie and redirect to 2FA setup

### 2. **2FA Status Check**
- **API**: `POST /api/v1/check-2fa-status`
- **Requirements**: Username and password (verified again for security)
- **Logic**:
  - If `ENABLED_2FA_USERS` is empty → First setup ever → Show QR code
  - If `ENABLED_2FA_USERS` has users but current user not in list → Show QR code
  - If current user in `ENABLED_2FA_USERS` → Ask for verification code

### 3. **2FA Setup (if needed)**
- **API**: `POST /api/v1/setup-2fa`
- **Requirements**: Username and password (verified again)
- **Action**: Generate QR code and store secret in environment
- **Result**: Return QR code for user to scan

### 4. **2FA Verification**
- **API**: `POST /api/v1/verify-2fa`
- **Requirements**: Username, password, and 6-digit token
- **Action**: Verify TOTP token and set final authentication cookies
- **Result**: User is fully authenticated

## Environment Variables Required

```env
# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$zdTss2LOgewL/5qIdLFDketzL5Htwy1QAG.uONng7lhlgNbV809/e

# 2FA configuration
ENABLED_2FA_USERS=  # Empty for first setup, or comma-separated list
NEXT_PUBLIC_APP_NAME=YourApp
NEXT_PUBLIC_APP_ISSUER=YourApp

# Debug (optional)
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

## API Endpoints

### Login
```typescript
POST /api/v1/login
{
  "username": "admin",
  "password": "admin123"  // Will be compared with bcrypt hash
}
```

### Check 2FA Status
```typescript
POST /api/v1/check-2fa-status
{
  "username": "admin",
  "password": "admin123"  // Will be compared with bcrypt hash
}
```

### Setup 2FA
```typescript
POST /api/v1/setup-2fa
{
  "username": "admin",
  "password": "admin123"  // Will be compared with bcrypt hash
}
```

### Verify 2FA
```typescript
POST /api/v1/verify-2fa
{
  "username": "admin",
  "password": "admin123",  // Will be compared with bcrypt hash
  "token": "123456"
}
```

## Security Features

1. **Credential Verification**: Every API call verifies username/password against `.env` using bcrypt
2. **Password Hashing**: Passwords are stored as bcrypt hashes, never in plain text
3. **Environment Storage**: 2FA secrets stored in environment variables
4. **Cookie-based Auth**: Secure HTTP-only cookies for session management
5. **Console Override**: Debug logging only when `DEBUG=true`

## Helper Functions

### `verifyCredentials()`
- Verifies username/password against `.env` file using bcrypt
- Handles split password hashes for long environment variables
- Used in all authentication endpoints

### `isFirst2FASetup()`
- Checks if `ENABLED_2FA_USERS` is empty
- Determines if this is the first 2FA setup ever

### `is2FAEnabledForUser()`
- Checks if specific user has 2FA enabled
- Uses `ENABLED_2FA_USERS` environment variable

## Frontend Flow

1. **Login Page** → User enters credentials
2. **2FA Setup Page** → Show QR code if needed
3. **2FA Verify Page** → Enter 6-digit code
4. **Dashboard** → Fully authenticated user

## Password Hash Setup

### Generate Password Hash
```bash
# Generate hash for password "admin123"
node scripts/generate-password-hash.js admin123

# Or use default password
node scripts/generate-password-hash.js
```

### Environment Variable Setup
The script will show you exactly what to add to your `.env` file:

```env
# For short hashes (single line)
ADMIN_PASSWORD_HASH=$2b$10$zdTss2LOgewL/5qIdLFDketzL5Htwy1QAG.uONng7lhlgNbV809/e

# For long hashes (split across multiple lines)
ADMIN_PASSWORD_HASH=$2b$10$zdTss2LOgewL/5qIdLFDketzL5Htwy1QAG.uONng7lhlgNbV809/e
ADMIN_PASSWORD_HASH_1=zdTss2LOgewL/5qIdLFDketzL5Htwy1QAG.uONng7lhlgNbV809/e
```

## Testing

### First Time Setup
1. Generate password hash using the script
2. Set `ENABLED_2FA_USERS=` (empty)
3. Login with admin credentials
4. Should see QR code for first setup
5. Scan QR code and verify
6. User added to `ENABLED_2FA_USERS`

### Subsequent Logins
1. Login with admin credentials
2. Should be asked for 6-digit verification code
3. Enter code from authenticator app
4. Access granted to dashboard
