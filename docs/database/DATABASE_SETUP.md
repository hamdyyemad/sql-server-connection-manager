# Turso Database Setup Guide

This guide will help you set up the Turso SQLite database for the authentication system.

## Prerequisites

1. **Turso Account**: Sign up at [turso.tech](https://turso.tech)
2. **Turso CLI**: Install the Turso CLI tool
3. **Node.js**: Ensure you have Node.js installed

## Step 1: Install Turso CLI

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Or using npm
npm install -g @turso/cli
```

## Step 2: Create Turso Database

```bash
# Login to Turso
turso auth login

# Create a new database
turso db create admin-auth-db

# Get the database URL
turso db show admin-auth-db --url

# Create an auth token
turso db tokens create admin-auth-db
```

## Step 3: Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Turso Database Configuration
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here

# Admin User Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Application Configuration
NEXT_PUBLIC_APP_NAME=Admin Panel
NEXT_PUBLIC_APP_ISSUER=Admin Panel

# Debug Configuration
DEBUG=true
NEXT_PUBLIC_DEBUG=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Session Configuration
SESSION_EXPIRY_HOURS=24
MAX_LOGIN_ATTEMPTS=5
RATE_LIMIT_WINDOW_HOURS=1
```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Run Database Setup

```bash
# Test the connection first
node scripts/test-turso-connection.js

# Run the full setup (creates tables and admin user)
node scripts/setup-turso-db.js
```

## Step 6: Verify Setup

The setup script will:
- ✅ Connect to your Turso database
- ✅ Create all required tables (users, auth_sessions, login_attempts, audit_logs)
- ✅ Create indexes for better performance
- ✅ Set up triggers for automatic timestamp updates
- ✅ Create views for easier querying
- ✅ Create the admin user with the credentials from your .env file
- ✅ Verify the setup and show you the results

## Database Schema

The setup creates the following tables:

### Users Table
- `id`: Unique user identifier (UUID)
- `username`: Unique username
- `passwordHash`: SHA-256 hashed password
- `passwordSalt`: Random salt for password hashing
- `hasSetup2FA`: Boolean flag for 2FA setup status
- `secret2FA`: Encrypted 2FA secret (when setup is complete)
- `tempSecret2FA`: Temporary 2FA secret (during setup)
- `isActive`: Soft delete flag
- `createdAt`, `updatedAt`, `lastLoginAt`: Timestamps

### Auth Sessions Table
- `id`: Session identifier (UUID)
- `userId`: Reference to user
- `sessionToken`: Unique session token
- `step`: Current authentication step
- `isCompleted`: Session completion flag
- `expiresAt`: Session expiration timestamp

### Login Attempts Table
- Tracks login attempts for rate limiting and security
- Includes IP address and user agent information

### Audit Logs Table
- Comprehensive logging of all authentication events
- Useful for compliance and debugging

## Troubleshooting

### Connection Issues
```bash
# Test connection
node scripts/test-turso-connection.js

# Check if your environment variables are loaded
echo $TURSO_DATABASE_URL
echo $TURSO_AUTH_TOKEN
```

### Database URL Format
Your database URL should look like:
```
libsql://your-database-name-your-username.turso.io
```

### Auth Token Issues
- Generate a new token: `turso db tokens create your-database-name`
- Ensure the token has the correct permissions
- Check if the token is expired

### Common Errors

1. **"Database not found"**
   - Verify the database URL is correct
   - Ensure the database exists in your Turso account

2. **"Authentication failed"**
   - Check your auth token
   - Generate a new token if needed

3. **"Permission denied"**
   - Ensure your auth token has write permissions
   - Check if the database is in the correct organization

## Next Steps

After successful setup:

1. Start your Next.js application: `npm run dev`
2. Navigate to `/auth/login`
3. Login with the admin credentials from your .env file
4. Complete the 2FA setup process
5. You'll be redirected to the main application

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- Use strong passwords for the admin user
- Generate a secure JWT_SECRET
- Consider using environment-specific databases for development/staging/production

## Useful Turso Commands

```bash
# List your databases
turso db list

# Show database details
turso db show your-database-name

# Create a new database
turso db create your-database-name

# Delete a database
turso db destroy your-database-name

# List tokens
turso db tokens list your-database-name

# Create a new token
turso db tokens create your-database-name

# Revoke a token
turso db tokens revoke your-database-name your-token-id
```
