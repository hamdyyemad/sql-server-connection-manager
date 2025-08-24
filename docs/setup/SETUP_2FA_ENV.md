# Quick 2FA Setup with Environment Variables

## Step 1: Create .env.local file

Create a file called `.env.local` in your project root with the following content:

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

# Your existing login credentials (keep these)
NEXT_ADMIN_USERNAME=admin
NEXT_ADMIN_PASSWORD_HASH=your_existing_password_hash
```

## Step 2: Start the application

```bash
npm run dev
```

## Step 3: Test the 2FA flow

1. Go to `http://localhost:3000/Login`
2. Log in with your credentials
3. You'll be redirected to `/2fa-setup`
4. The QR code will be generated automatically
5. Scan it with your authenticator app (Google Authenticator, Authy, etc.)
6. Enter any 6-digit code (for testing)
7. Complete the setup

## Step 4: Verify it works

After completing 2FA setup:

- The `ENABLED_2FA_USERS` in your `.env.local` will be updated to include your username
- Next time you login, you'll go to `/2fa-verify` instead of `/2fa-setup`
- You can access the main application after 2FA verification

## Management Commands

If you want to use the management script:

```bash
# Initialize environment file
node scripts/manage-2fa.js init

# Add a new user
node scripts/manage-2fa.js add admin

# List all users
node scripts/manage-2fa.js list

# Enable/disable 2FA for a user
node scripts/manage-2fa.js enable admin
node scripts/manage-2fa.js disable admin
```

## What's Different from Database Approach

✅ **No database changes needed** - Everything stored in environment variables  
✅ **Faster setup** - No SQL scripts to run  
✅ **Easy management** - Use the management script or edit `.env.local` directly  
✅ **Simple testing** - Quick to reset and reconfigure  
✅ **Development friendly** - Perfect for testing and development

## Security Note

This approach is great for development and testing. For production:

- Consider encrypting the secrets
- Use a proper secrets management service
- Enable real TOTP verification (currently accepts any 6-digit code)
- Add rate limiting and additional security measures
