# Debugging 2FA QR Code Issue

## Problem: QR code doesn't appear after login

### Step 1: Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Log in and navigate to the 2FA setup page
4. Look for any error messages or logs

### Step 2: Test the API Directly

Try accessing the test endpoint to see if QR code generation works:

```
http://localhost:3000/api/v1/test-2fa
```

This should return a JSON response with a QR code URL.

### Step 3: Check Environment Variables

Make sure you have a `.env.local` file in your project root with:

```env
# 2FA Configuration
NEXT_PUBLIC_APP_NAME=YourApp
NEXT_PUBLIC_APP_ISSUER=YourApp

# User 2FA Secrets (will be auto-generated)
ADMIN_2FA_SECRET=JBSWY3DPEHPK3PXP

# 2FA Enabled Users (leave empty for new setup)
ENABLED_2FA_USERS=

# 2FA Setup Date
ADMIN_2FA_SETUP_DATE=2024-01-01

# Your existing login credentials
NEXT_ADMIN_USERNAME=admin
NEXT_ADMIN_PASSWORD_HASH=your_existing_password_hash
```

### Step 4: Manual API Test

Test the setup-2fa API directly:

```bash
curl -X POST http://localhost:3000/api/v1/setup-2fa \
  -H "Content-Type: application/json" \
  -d '{"username": "admin"}'
```

### Step 5: Common Issues and Solutions

#### Issue 1: "User not found" error

**Solution**: The API no longer requires database validation, so this shouldn't happen.

#### Issue 2: "2FA is already enabled" error

**Solution**: Clear the `ENABLED_2FA_USERS` in your `.env.local` file:

```env
ENABLED_2FA_USERS=
```

#### Issue 3: Network error

**Solution**: Make sure your development server is running:

```bash
npm run dev
```

#### Issue 4: CORS error

**Solution**: This shouldn't happen in development, but check if there are any CORS headers missing.

### Step 6: Debug the Setup Page

The setup page now includes detailed logging. Check the browser console for:

- `🔍 Generating QR code for user: [username]`
- `🔍 API Response status: [status]`
- `🔍 API Response data: [data]`
- `✅ QR code generated successfully` or `❌ QR code generation failed: [error]`

### Step 7: Quick Fix

If nothing else works, try this simple fix:

1. Create `.env.local` file with the content above
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Clear browser cache and cookies
4. Try logging in again

### Step 8: Alternative Test

If the main setup page still doesn't work, you can test the QR code generation directly by visiting:

```
http://localhost:3000/api/v1/test-2fa
```

This should show you a JSON response with a QR code URL that you can copy and paste into your browser to see if the QR code appears.

### Expected Flow

1. Login with credentials
2. Redirected to `/2fa-setup`
3. Page automatically calls `/api/v1/setup-2fa`
4. API returns QR code URL
5. QR code displays on page
6. User scans QR code and enters OTP
7. User completes 2FA setup

### If Still Not Working

1. Check the server logs for any errors
2. Verify all environment variables are set correctly
3. Make sure the database connection isn't blocking the API
4. Try the test endpoint first to isolate the issue

The updated handlers should work without database validation, so the QR code should appear immediately after login.
