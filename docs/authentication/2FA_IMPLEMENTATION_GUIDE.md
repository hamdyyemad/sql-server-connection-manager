# 2FA Implementation Guide

## Overview

This guide covers the implementation of Two-Factor Authentication (2FA) using TOTP (Time-based One-Time Password) in your Next.js application. The implementation uses **environment variables** for storing 2FA secrets and user status, making it simple to set up and manage.

## Features

- ✅ QR code generation for authenticator apps
- ✅ TOTP verification
- ✅ Environment variable-based storage (no database changes needed)
- ✅ User-friendly setup and verification flows
- ✅ Integration with existing authentication system
- ✅ Management script for easy user administration

## Quick Start

### 1. Install Dependencies

```bash
npm install speakeasy qrcode @types/qrcode
```

### 2. Initialize Environment Configuration

```bash
node scripts/manage-2fa.js init
```

### 3. Add Your First User

```bash
node scripts/manage-2fa.js add admin
```

### 4. Start the Application

```bash
npm run dev
```

### 5. Test the Flow

1. Go to `http://localhost:3000/Login`
2. Log in with your credentials
3. You'll be redirected to `/2fa-setup`
4. Scan the QR code with your authenticator app
5. Enter the 6-digit code and complete setup

## Environment Variables

The 2FA system uses the following environment variables in `.env.local`:

```env
# 2FA Configuration
NEXT_PUBLIC_APP_NAME=YourApp
NEXT_PUBLIC_APP_ISSUER=YourApp

# User 2FA Secrets (auto-generated)
ADMIN_2FA_SECRET=JBSWY3DPEHPK3PXP
TEST_USER_2FA_SECRET=JBSWY3DPEHPK3PXP

# 2FA Enabled Users (comma-separated)
ENABLED_2FA_USERS=admin,test_user

# 2FA Setup Dates
ADMIN_2FA_SETUP_DATE=2024-01-01
TEST_USER_2FA_SETUP_DATE=2024-01-01

# Existing login credentials
NEXT_ADMIN_USERNAME=admin
NEXT_ADMIN_PASSWORD_HASH=your_password_hash_here
```

## Management Script

Use the included management script to easily manage 2FA users:

```bash
# Initialize environment file
node scripts/manage-2fa.js init

# Add a new user
node scripts/manage-2fa.js add username

# Enable 2FA for a user
node scripts/manage-2fa.js enable username

# Disable 2FA for a user
node scripts/manage-2fa.js disable username

# List all users and their status
node scripts/manage-2fa.js list
```

## How It Works

### 1. Login Flow

1. User enters username/password
2. System validates credentials
3. System checks if user has 2FA enabled (from environment variables)
4. If not enabled: redirect to `/2fa-setup`
5. If enabled: redirect to `/2fa-verify`

### 2. 2FA Setup Flow (`/2fa-setup`)

1. System generates QR code with user's secret
2. User scans QR code with authenticator app
3. User enters 6-digit code from app
4. System verifies code and enables 2FA
5. User is redirected to main application

### 3. 2FA Verification Flow (`/2fa-verify`)

1. User enters 6-digit code from authenticator app
2. System verifies code against stored secret
3. If valid: user is redirected to main application
4. If invalid: error message displayed

## API Endpoints

### POST `/api/v1/setup-2fa`

**Purpose**: Generate QR code and secret for 2FA setup

**Request Body**:

```json
{
  "username": "admin"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=...",
    "otpauthUrl": "otpauth://totp/YourApp:user@example.com?secret=...&issuer=YourApp",
    "message": "Scan the QR code with your authenticator app"
  }
}
```

### POST `/api/v1/verify-2fa`

**Purpose**: Verify OTP and complete 2FA setup/verification

**Request Body**:

```json
{
  "username": "admin",
  "otp": "123456"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "message": "2FA verification successful",
    "user": {
      "id": "user-id",
      "username": "admin",
      "email": "user@example.com"
    }
  }
}
```

## State Management

The authentication state is managed using Zustand store (`useAuthStore`):

```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  requires2FA: boolean;
  login: (userData: any) => void;
  logout: () => void;
  setRequires2FA: (requires: boolean) => void;
  complete2FA: (userData: any) => void;
}
```

### Key State Transitions:

1. **Initial Login**: `requires2FA: true` (user needs to complete 2FA)
2. **2FA Complete**: `isAuthenticated: true, requires2FA: false` (user can access app)
3. **Logout**: Reset all state

## Security Considerations

### Current Implementation (Development)

- Uses placeholder verification (accepts any 6-digit code)
- Secrets stored in environment variables (not encrypted)
- QR codes generated via external API

### Production Recommendations

1. **Install and use real libraries**:

   ```bash
   npm install speakeasy qrcode @types/qrcode
   ```

2. **Enable real TOTP verification**:

   ```typescript
   // In verify-2fa.ts
   const verified = speakeasy.totp.verify({
     secret: secret,
     encoding: "base32",
     token: otp,
     window: 2,
   });
   ```

3. **Encrypt secrets**:

   - Use encryption for storing secrets in environment variables
   - Consider using a secrets management service

4. **Generate real QR codes**:

   ```typescript
   // In setup-2fa.ts
   const qrCode = await QRCode.toDataURL(secret.otpauth_url);
   ```

5. **Add rate limiting**:
   - Limit OTP verification attempts
   - Add cooldown periods

## User Experience

### For New Users

1. Login with username/password
2. Automatically redirected to 2FA setup
3. Scan QR code with authenticator app
4. Enter 6-digit code to complete setup
5. Access main application

### For Existing Users

1. Login with username/password
2. Automatically redirected to 2FA verification
3. Enter 6-digit code from authenticator app
4. Access main application

### Error Handling

- Clear error messages for invalid credentials
- Helpful instructions for QR code scanning
- Graceful handling of network errors

## Troubleshooting

### Common Issues

1. **"User not found" error**

   - Ensure user exists in database
   - Check username spelling

2. **"2FA is not set up" error**

   - Run: `node scripts/manage-2fa.js add <username>`
   - Or manually add secret to `.env.local`

3. **QR code not displaying**

   - Check network connection
   - Verify environment variables are set
   - Check browser console for errors

4. **OTP verification failing**
   - Ensure authenticator app is synced
   - Check if using correct secret
   - Verify time settings on device

### Debug Commands

```bash
# Check current 2FA status
node scripts/manage-2fa.js list

# Reset user's 2FA
node scripts/manage-2fa.js disable admin
node scripts/manage-2fa.js add admin

# View environment variables
cat .env.local
```

## Files Modified/Created

### Backend Files

- `src/backend_lib/handlers/setup-2fa.ts` - 2FA setup handler
- `src/backend_lib/handlers/verify-2fa.ts` - 2FA verification handler
- `src/app/api/v1/setup-2fa/route.ts` - Setup API endpoint
- `src/app/api/v1/verify-2fa/route.ts` - Verification API endpoint
- `src/app/api/v1/login/route.ts` - Updated login handler

### Frontend Files

- `src/app/2fa-setup/page.tsx` - 2FA setup page
- `src/app/2fa-verify/page.tsx` - 2FA verification page
- `src/frontend_lib/store/useAuthStore.ts` - Updated auth store
- `src/app/Login/page.tsx` - Updated login page
- `src/middleware.ts` - Updated middleware

### Configuration Files

- `scripts/manage-2fa.js` - Management script
- `env-example.txt` - Environment configuration example
- `.env.local` - Your environment variables (create this)

### Documentation

- `2FA_IMPLEMENTATION_GUIDE.md` - This guide

## Next Steps

1. **Test the implementation** with the provided management script
2. **Install real libraries** for production use
3. **Configure environment variables** for your specific setup
4. **Add rate limiting** and additional security measures
5. **Test with real authenticator apps** (Google Authenticator, Authy, etc.)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify environment variables are correctly set
3. Check browser console and server logs for errors
4. Ensure all dependencies are installed
5. Test with the management script to verify configuration
