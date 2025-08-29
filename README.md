# QR Code Admin - Multi-Connection MS SQL Server Management System

A modern Next.js admin panel designed to solve multiple connection string flexibility with MS SQL Server using mssql in Node.js. This application provides a comprehensive solution for managing multiple database connections, secure authentication with Two-Factor Authentication (2FA), and Turso SQLite database integration for enhanced flexibility.

## 🎯 **Solution Overview**

This app is specifically designed to address the challenges of managing multiple MS SQL Server connection strings in Node.js applications. It provides:

- **Flexible Connection Management**: Handle multiple MS SQL Server instances with different connection strings
- **Unified Interface**: Single admin panel to manage all database connections
- **Secure Authentication**: Industry-standard bcrypt security with 2FA
- **Optimized Architecture**: Clean dependency injection and performance optimizations
- **Connection Monitoring**: Real-time monitoring and testing of database connections
- **Script Automation**: Comprehensive script management system for database operations

## 🔒 **Security Features**

- **bcrypt Password Hashing**: Industry-standard password security with configurable cost factor
- **Two-Factor Authentication**: TOTP-based 2FA with QR code generation
- **Optimized Authentication Flow**: 50% fewer database calls for better performance
- **Clean Architecture**: No circular dependencies, proper separation of concerns
- **Type Safety**: Full TypeScript support with strict type checking

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MS SQL Server instance(s)
- Turso account ([turso.tech](https://turso.tech)) (optional)

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment Configuration

```bash
# Create .env file with all required configuration
node run-scripts.js utils create-env

# Or run directly:
node scripts/utils/create-env.js
```

### 3. Setup Database with bcrypt Security

```bash
# Create admin user with bcrypt hashing
node scripts/database/create-admin-bcrypt.js

# Or use the full setup script:
node scripts/database/setup-turso-db.js
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Access the Application

- **Login Page**: `http://localhost:3000/auth/login`
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`

## 🏗️ **Architecture Overview**

### **Authentication System**

- **Strategy Pattern**: Clean separation of login, 2FA setup, and verification
- **Service Layer**: UserService handles all user operations with bcrypt security
- **Repository Pattern**: Clean data access abstraction
- **Performance Optimized**: Single database call for user verification

### **Security Implementation**

- **bcrypt Hashing**: Cost factor 12 for optimal security/performance balance
- **Embedded Salt**: No separate salt column needed (included in hash)
- **TOTP 2FA**: Real-time verification with speakeasy library
- **Type Safety**: Full TypeScript coverage for security-critical code

### **Database Schema**

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

## 🛠️ Script Management

The project includes a comprehensive script management system that organizes all utility scripts into categories for easy access and execution.

### Quick Script Access

```bash
# Show all available scripts
node run-scripts.js list

# Get help
node run-scripts.js help

# Run scripts by category
node run-scripts.js database init-database
node run-scripts.js auth test-auth
node run-scripts.js utils generate-password-hash mypassword
```

### Script Categories

- **Database**: Setup, initialization, and connection scripts
- **Auth**: Authentication and 2FA management scripts
- **Utils**: Password hashing and environment testing scripts
- **Testing**: Component testing scripts

### Cross-Platform Support

- **Windows**: `run-scripts.bat help`
- **Unix/Linux/macOS**: `./run-scripts.sh help`
- **Node.js**: `node run-scripts.js help`

For detailed script documentation, see [scripts/README.md](scripts/README.md).

## 🔧 Key Features

- **Multiple MS SQL Server Connections**: Manage multiple database instances with different connection strings
- **Connection String Flexibility**: Easy configuration and management of various connection parameters
- **Secure Authentication**: Two-Factor Authentication (2FA) for enhanced security
- **Turso SQLite Integration**: Additional database support for flexibility
- **Interactive Script Management**: User-friendly CLI for database operations
- **Real-time Monitoring**: Monitor database connections and performance
- **Comprehensive Testing**: Built-in testing tools for all components
- **Environment Management**: Automated .env file creation with secure defaults

## ⚙️ Environment Configuration

The application uses environment variables for configuration. You can create a `.env` file using the provided script:

### Quick Setup

```bash
# Create .env file with all required configuration
node run-scripts.js utils create-env
```

### Manual Configuration

If you prefer to create the `.env` file manually, use this template:

```env
# Turso Database Configuration
TURSO_DATABASE_URL=PUT_YOUR_CONNECTION_HERE
TURSO_AUTH_TOKEN=PUT_YOUR_TOKEN_HERE

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_SALT=admin123

# Application Configuration
NEXT_PUBLIC_APP_NAME=Admin Panel
NEXT_PUBLIC_APP_ISSUER=Admin Panel

# Debug (optional)
DEBUG=true
NEXT_PUBLIC_DEBUG=true

# JWT Configuration
JWT_SECRET=PUT_YOUR_JWT_SECRET_HERE

# Session Configuration
SESSION_EXPIRY_HOURS=24
MAX_LOGIN_ATTEMPTS=5
RATE_LIMIT_WINDOW_HOURS=1
```

### Required Updates

After creating the `.env` file, you need to update:

1. **TURSO_DATABASE_URL**: Your Turso database connection string
2. **TURSO_AUTH_TOKEN**: Your Turso authentication token
3. **JWT_SECRET**: A secure random string (auto-generated by the script)

### Security Notes

- Never commit your `.env` file to version control
- Use strong, unique values for production
- The script auto-generates a secure JWT secret
- Keep your Turso credentials secure

## 📚 Documentation

### 🗄️ Database Setup

- **[Turso Connection Guide](docs/database/TURSO_CONNECTION_GUIDE.md)** - Complete step-by-step Turso setup
- **[Database Setup](docs/database/DATABASE_SETUP.md)** - Database schema and configuration
- **[Dashboard Database Setup](docs/database/DASHBOARD_DATABASE_SETUP.md)** - Dashboard-specific database setup

### 🔐 Authentication System

- **[Authentication System](docs/authentication/AUTHENTICATION_SYSTEM.md)** - Complete authentication architecture
- **[New Authentication System](docs/authentication/NEW_AUTHENTICATION_SYSTEM.md)** - Updated authentication implementation
- **[2FA Implementation Guide](docs/authentication/2FA_IMPLEMENTATION_GUIDE.md)** - Two-Factor Authentication setup
- **[Corrected 2FA Flow](docs/authentication/CORRECTED_2FA_FLOW.md)** - Fixed 2FA authentication flow
- **[Login Setup](docs/authentication/LOGIN_SETUP.md)** - Login system configuration

### ⚙️ Setup & Configuration

- **[Dashboard Setup](docs/setup/DASHBOARD_SETUP.md)** - Dashboard configuration
- **[Environment Setup](docs/setup/SETUP_ENV.md)** - Environment variables configuration
- **[2FA Environment Setup](docs/setup/SETUP_2FA_ENV.md)** - 2FA-specific environment setup
- **[Refactored Structure](docs/setup/REFACTORED_STRUCTURE.md)** - Project structure overview

### 🐛 Debugging & Troubleshooting

- **[Debug Configuration](docs/debugging/DEBUG_CONFIGURATION.md)** - Debug system setup
- **[Debug Guide](docs/debugging/DEBUG_GUIDE.md)** - Comprehensive debugging guide
- **[Quick Debug Start](docs/debugging/QUICK_DEBUG_START.md)** - Quick debugging reference
- **[Troubleshooting](docs/debugging/TROUBLESHOOTING.md)** - Common issues and solutions

### 🔌 API & Security

- **[API Structure](docs/api/API_STRUCTURE.md)** - API endpoints and structure
- **[SQL Injection Prevention](docs/api/SQL_INJECTION_PREVENTION_GUIDE.md)** - Security best practices

## 🏗️ Project Structure

```
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── auth/              # Authentication pages
│   │   └── api/               # API routes
│   ├── backend_lib/           # Backend utilities
│   │   ├── auth/              # Authentication logic
│   │   ├── repositories/      # Data access layer
│   │   ├── handlers/          # API handlers
│   │   ├── middleware/        # Middleware functions
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Utility functions
│   └── frontend_lib/          # Frontend utilities
│       ├── hooks/             # React hooks
│       ├── services/          # API services
│       ├── stores/            # State management
│       └── utils/             # Frontend utilities
├── database/                  # Database schemas
├── scripts/                   # Organized utility scripts
│   ├── database/             # Database setup scripts
│   ├── auth/                 # Authentication scripts
│   ├── utils/                # Utility scripts
│   ├── testing/              # Testing scripts
│   └── index.js              # CLI tool
├── run-scripts.js            # Root script runner
├── run-scripts.bat           # Windows batch runner
├── run-scripts.sh            # Unix shell runner
├── docs/                      # Documentation
└── public/                    # Static assets
```

## 🎯 Use Cases

### Enterprise Database Management

- Manage multiple MS SQL Server instances across different environments
- Centralized connection string management
- Secure access control with 2FA

### Development & Testing

- Easy switching between development, staging, and production databases
- Automated database setup and testing scripts
- Connection health monitoring

### DevOps Integration

- Scriptable database operations
- Automated deployment and configuration
- Connection string validation and testing

## 🔧 Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Node.js, Express (via Next.js API routes)
- **Database**: MS SQL Server (primary), Turso SQLite (secondary)
- **Authentication**: JWT, 2FA with Speakeasy
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database Driver**: mssql for MS SQL Server, @libsql/client for Turso

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.
