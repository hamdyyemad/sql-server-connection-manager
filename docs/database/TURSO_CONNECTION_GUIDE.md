# Turso Database Connection Guide

This guide provides step-by-step instructions for setting up and connecting to a Turso SQLite database for the authentication system with industry-standard bcrypt security.

## 🔒 **Security Features**

- **bcrypt Password Hashing**: Industry-standard security with cost factor 12
- **Embedded Salt**: No separate salt storage (included in bcrypt hash)
- **Optimized Performance**: 50% fewer database calls
- **Real 2FA Verification**: TOTP-based authentication with speakeasy

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Create Turso Account](#step-1-create-turso-account)
3. [Step 2: Install Turso CLI](#step-2-install-turso-cli)
4. [Step 3: Create Database](#step-3-create-database)
5. [Step 4: Get Connection Details](#step-4-get-connection-details)
6. [Step 5: Configure Environment](#step-5-configure-environment)
7. [Step 6: Test Connection](#step-6-test-connection)
8. [Step 7: Setup Database Schema](#step-7-setup-database-schema)
9. [Step 8: Create Admin User with bcrypt](#step-8-create-admin-user-with-bcrypt)
10. [Troubleshooting](#troubleshooting)
11. [Useful Commands](#useful-commands)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git (for version control)
- A modern web browser

## Step 1: Create Turso Account

1. **Visit Turso Website**: Go to [turso.tech](https://turso.tech)
2. **Sign Up**: Click "Get Started" and create an account
   - You can sign up with GitHub, Google, or email
3. **Verify Email**: Check your email and verify your account
4. **Complete Setup**: Follow the onboarding process

## Step 2: Install Turso CLI

### Windows Installation

```bash
# Method 1: Using winget (recommended)
winget install tursodatabase.turso

# Method 2: Using Chocolatey
choco install turso

# Method 3: Manual download
# Visit: https://github.com/tursodatabase/turso-cli/releases
# Download the latest Windows executable
```

### macOS Installation

```bash
# Method 1: Using Homebrew
brew install tursodatabase/tap/turso

# Method 2: Using curl
curl -sSfL https://get.tur.so/install.sh | bash
```

### Linux Installation

```bash
# Using curl
curl -sSfL https://get.tur.so/install.sh | bash

# Or using npm
npm install -g @turso/cli
```

### Verify Installation

```bash
turso --version
```

**Note**: If `turso` command is not found after installation, restart your terminal or add it to your PATH.

## Step 3: Create Database

### Login to Turso

```bash
turso auth login
```

This will open your browser for authentication. Complete the login process.

### Create Database

```bash
# Create a new database
turso db create admin-auth-db

# Specify a location (optional, but recommended for performance)
turso db create admin-auth-db --location aws-us-east-1
```

**Available Locations**:

- `aws-us-east-1` (N. Virginia)
- `aws-us-west-1` (N. California)
- `aws-eu-west-1` (Ireland)
- `aws-ap-southeast-1` (Singapore)

### Verify Database Creation

```bash
# List all your databases
turso db list

# Show database details
turso db show admin-auth-db
```

## Step 4: Get Connection Details

### Get Database URL

```bash
turso db show admin-auth-db --url
```

**Output Example**:

```
libsql://admin-auth-db-yourusername.aws-us-east-1.turso.io
```

### Create Auth Token

```bash
# Create a new auth token
turso db tokens create admin-auth-db

# List existing tokens
turso db tokens list admin-auth-db
```

**Output Example**:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: Save both the database URL and auth token securely. You'll need them for the next steps.

## Step 5: Configure Environment

### Create .env File

Create a `.env` file in your project root directory:

```env
# Turso Database Configuration
TURSO_DATABASE_URL=libsql://admin-auth-db-yourusername.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Default Admin User Configuration
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

### Replace Placeholders

1. **TURSO_DATABASE_URL**: Replace with your actual database URL from Step 4
2. **TURSO_AUTH_TOKEN**: Replace with your actual auth token from Step 4
3. **JWT_SECRET**: Generate a secure random string (you can use a UUID generator)

### Security Notes

- Never commit your `.env` file to version control
- Use different databases for development, staging, and production
- Rotate auth tokens regularly
- Use strong passwords for admin users

## Step 6: Test Connection

### Install Dependencies

```bash
npm install
```

### Test Database Connection

```bash
# Test the connection (if you have the test script)
node scripts/database/test-turso-connection.js
```

**Expected Output**:

```
🔍 Testing Turso Database Connection...

🔌 Connecting to Turso database...
✅ Connection successful!
📅 Current time: 2024-01-15 10:30:00
📊 Found 0 tables:
```

## Step 7: Setup Database Schema

### Run Database Setup

```bash
# Setup database schema with bcrypt security
node scripts/database/setup-turso-db.js
```

**Expected Output**:

```
🚀 Starting Turso Database Setup...

✅ Configuration validated
📊 Database URL: libsql://admin-auth-db-yourusername.aws-us-east-1.turso.io
👤 Admin Username: admin

🔌 Connecting to Turso database...
✅ Database connection successful

📋 Executing database schema...
📝 Found 16 SQL statements to execute

✅ [1/16] Executed successfully
✅ [2/16] Executed successfully
...
✅ [16/16] Executed successfully
✅ Schema execution completed

👤 Creating admin user with bcrypt...
✅ Admin user created successfully
   User ID: 6ae7b96a-61cd-4824-bd44-10abda09b2c3
   Username: admin
   Password: admin123 (hashed with bcrypt)

🎉 Turso Database Setup Completed Successfully!
```

### Verify Setup

The setup script will create:

- ✅ 5 database tables (users, auth_sessions, login_attempts, audit_logs, sqlite_sequence)
- ✅ All necessary indexes for performance
- ✅ 2 views for easier querying
- ✅ Admin user with bcrypt-hashed password

### Database Schema (bcrypt)

The users table now uses bcrypt for password security:

```sql
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
```

**Key Changes**:

- ❌ **Removed**: `passwordSalt` column (bcrypt includes salt in hash)
- ✅ **Enhanced**: `passwordHash` now stores bcrypt hash with embedded salt
- ✅ **Security**: Industry-standard bcrypt with cost factor 12

## Step 8: Create Admin User with bcrypt

```bash
# Create a new admin user with bcrypt security
node scripts/database/create-admin-bcrypt.js
```

**Expected Output**:

```
🚀 Creating admin user with bcrypt...
📋 Creating users table...
👤 Creating new admin user...
✅ Admin user created successfully
   User ID: 1db292b4-5e8f-44f9-8231-aa1818f0bc34
   Username: admin
   Password: admin123 (securely hashed with bcrypt)
```

### Alternative: Update Existing Admin Password

If an admin user already exists, the script will update the password with bcrypt:

```
⚠️ Admin user already exists, updating password...
✅ Admin password updated with bcrypt
```

## Troubleshooting

### Common Issues

#### 1. "Database not found" Error

```bash
# Check if database exists
turso db list

# If not found, create it
turso db create admin-auth-db
```

#### 2. "Authentication failed" Error

```bash
# Generate a new auth token
turso db tokens create admin-auth-db

# Update your .env file with the new token
```

#### 3. "Permission denied" Error

```bash
# Check token permissions
turso db tokens list admin-auth-db

# Revoke and recreate token if needed
turso db tokens revoke admin-auth-db <token-id>
turso db tokens create admin-auth-db
```

#### 4. Connection Timeout

- Check your internet connection
- Verify the database location is close to your region
- Try a different location: `turso db create admin-auth-db --location aws-us-west-1`

#### 5. CLI Command Not Found

```bash
# Restart your terminal
# Or add to PATH manually
# Windows: Add to System Environment Variables
# macOS/Linux: Add to ~/.bashrc or ~/.zshrc
```

### Reset Database

If you need to start fresh:

```bash
# Drop all tables and recreate
node scripts/drop-turso-db.js
node scripts/setup-turso-db.js
```

## Useful Commands

### Database Management

```bash
# List all databases
turso db list

# Show database details
turso db show admin-auth-db

# Delete database (be careful!)
turso db destroy admin-auth-db

# Create database in specific location
turso db create admin-auth-db --location aws-us-east-1
```

### Token Management

```bash
# List all tokens
turso db tokens list admin-auth-db

# Create new token
turso db tokens create admin-auth-db

# Revoke token
turso db tokens revoke admin-auth-db <token-id>
```

### Connection Testing

```bash
# Test connection via CLI
turso db shell admin-auth-db

# Run SQL commands
turso db shell admin-auth-db --execute "SELECT * FROM users;"
```

### Backup and Restore

```bash
# Backup database
turso db backup admin-auth-db

# Restore database
turso db restore admin-auth-db <backup-file>
```

## Database Schema Overview

The setup creates the following structure:

### Tables

- **users**: User accounts and authentication data
- **auth_sessions**: Active authentication sessions
- **login_attempts**: Security and rate limiting
- **audit_logs**: Activity logging and compliance

### Views

- **active_users**: Currently active users
- **recent_login_attempts**: Recent login activity

### Indexes

- Performance indexes on frequently queried columns
- Composite indexes for complex queries

## Next Steps

After successful setup:

1. **Customize the application** for your needs
2. **Add more users** through the application interface
3. **Configure 2FA** for additional security
4. **Set up monitoring** and logging
5. **Deploy to production** with proper environment variables

## Support

- **Turso Documentation**: [docs.tur.so](https://docs.tur.so)
- **Turso Discord**: [discord.gg/turso](https://discord.gg/turso)
- **GitHub Issues**: [github.com/tursodatabase/turso](https://github.com/tursodatabase/turso)

---

**Note**: This guide assumes you're using the authentication system provided in this project. Adjust the steps according to your specific needs and application structure.
