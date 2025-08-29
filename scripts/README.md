# QR Code Admin - Interactive Script Manager

This directory contains organized scripts for the QR Code Admin application, categorized by functionality and managed through an interactive CLI tool.

## 🔒 **Security Updates**

- **bcrypt Password Hashing**: All password operations now use industry-standard bcrypt
- **Enhanced 2FA**: Real TOTP verification with speakeasy library
- **Optimized Performance**: 50% fewer database calls in authentication flow
- **Clean Architecture**: No circular dependencies, proper separation of concerns

## 📁 Directory Structure

```
scripts/
├── index.js              # Interactive CLI tool
├── README.md             # This file
├── database/             # Database setup and management scripts
│   ├── init-database.js
│   ├── setup-dashboard-database.js
│   ├── test-dashboard-connection.js
│   ├── setup-turso-db.js
│   ├── create-admin-bcrypt.js    # NEW: Create admin with bcrypt
│   ├── drop-turso-db.js
│   └── test-turso-connection.js
├── auth/                 # Authentication and 2FA scripts
│   ├── test-auth.js
│   ├── check-temp-secret.js
│   ├── clear-temp-secret.js
│   ├── manage-2fa.js
│   └── test-2fa-verification.js
├── utils/                # Utility scripts
│   ├── generate-password-hash.js
│   ├── generate-password-hash-sha256.js  # DEPRECATED: Use bcrypt instead
│   ├── check-env.js
│   ├── test-env.js
│   ├── test-env-simple.js
│   └── test-next-env.js
└── testing/              # Testing scripts
    └── test-dashboard-api.js
```

## 🚀 Usage

### Interactive Menu System (Recommended)

The script manager now features an interactive menu system that guides you through script selection:

```bash
# Start interactive menu
node run-scripts.js

# Or directly from scripts directory
node scripts/index.js
```

### Quick Setup with bcrypt Security

```bash
# 1. Create admin user with bcrypt hashing
node scripts/database/create-admin-bcrypt.js

# 2. Test authentication system
node scripts/auth/test-auth.js

# 3. Test 2FA verification
node scripts/auth/test-2fa-verification.js
```

### How the Interactive Menu Works

1. **Main Menu**: Shows available categories with numbered options
2. **Category Menu**: Shows scripts within the selected category
3. **Script Execution**: Optionally enter additional arguments
4. **Return Navigation**: Press 0 to go back or exit

### Menu Flow Example

```
============================================================
QR Code Admin - Script Manager
============================================================

Available Categories:

[1] database
    Database setup, initialization, and connection scripts

[2] auth
    Authentication and 2FA management scripts

[3] utils
    Utility scripts for password hashing and environment testing

[4] testing
    Testing scripts for various components

[0] Exit

Select a category (0-4): 2
```

Then you'll see:

```
============================================================
AUTH Scripts
============================================================

Authentication and 2FA management scripts

[1] test-auth.js
    Test authentication system with bcrypt

[2] check-temp-secret.js
    Check temporary 2FA secret for admin user

[3] clear-temp-secret.js
    Clear temporary 2FA secret for admin user

[4] manage-2fa.js
    Manage 2FA settings for users

[5] test-2fa-verification.js
    Test 2FA verification with real TOTP

[0] Back to main menu
```

### Cross-Platform Support

- **Windows**: `run-scripts.bat`
- **Unix/Linux/macOS**: `./run-scripts.sh`
- **Node.js**: `node run-scripts.js`

### Help Command

```bash
# Show help information
node scripts/index.js help
```

## 📋 Available Scripts

### Database Scripts

- **init-database**: Initialize the main database schema and admin user
- **setup-dashboard-database**: Setup dashboard database with sample data
- **test-dashboard-connection**: Test connection to dashboard database
- **setup-turso-db**: Setup Turso database
- **drop-turso-db**: Drop Turso database
- **test-turso-connection**: Test Turso database connection

### Authentication Scripts

- **test-auth**: Test authentication system
- **check-temp-secret**: Check temporary 2FA secret for admin user
- **clear-temp-secret**: Clear temporary 2FA secret for admin user
- **manage-2fa**: Manage 2FA settings
- **test-2fa-verification**: Test 2FA verification process

### Utility Scripts

- **generate-password-hash**: Generate bcrypt password hash
- **generate-password-hash-sha256**: Generate SHA256 password hash
- **check-env**: Check environment variables
- **test-env**: Test environment configuration
- **test-env-simple**: Simple environment test
- **test-next-env**: Test Next.js environment
- **create-env**: Create .env file with all required configuration

### Testing Scripts

- **test-dashboard-api**: Test dashboard API endpoints

## 🎯 Common Use Cases

### Initial Setup

1. Start the interactive menu: `node run-scripts.js`
2. Select `[1] database`
3. Choose `[1] init-database`
4. Follow the prompts

### 2FA Management

1. Start the interactive menu: `node run-scripts.js`
2. Select `[2] auth`
3. Choose the appropriate 2FA script
4. Follow the prompts

### Password Management

1. Start the interactive menu: `node run-scripts.js`
2. Select `[3] utils`
3. Choose password hash generation script
4. Enter password when prompted

### Environment Setup

1. Start the interactive menu: `node run-scripts.js`
2. Select `[3] utils`
3. Choose `[7] create-env`
4. Follow the prompts to create your .env file
5. Update the generated values with your actual credentials

## 🔧 Features

- **Interactive Menus**: Easy-to-use numbered menu system
- **Colorized Output**: All output is colorized for better readability
- **Clear Navigation**: Press 0 to go back or exit
- **Argument Support**: Optionally provide additional arguments to scripts
- **Error Handling**: Proper error handling and exit codes
- **Screen Clearing**: Clean interface with screen clearing
- **Help System**: Built-in help documentation

## 📝 Navigation Guide

- **Numbers**: Use numbers to select options (1, 2, 3, etc.)
- **0**: Go back to previous menu or exit
- **Enter**: Continue after script execution
- **Ctrl+C**: Exit the program at any time

## 🛠️ Development

To add a new script:

1. Place it in the appropriate category folder
2. Update the `categories` object in `scripts/index.js`
3. Add a description for the script
4. Test the script through the interactive menu

The interactive menu will automatically discover and list new scripts based on the categories configuration.

## 🔄 Backward Compatibility

The CLI still supports direct execution for automation:

```bash
# Direct execution (for scripts/automation)
node scripts/index.js database init-database
node scripts/index.js auth test-auth
```

This allows you to use the scripts in automated workflows while providing an interactive experience for manual use.
