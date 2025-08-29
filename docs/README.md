# Documentation Index

Welcome to the project documentation! This folder contains all the detailed guides and references organized by category.

## 📁 Documentation Structure

### 🗄️ [Database](./database/)
Database setup, configuration, and management guides.

- **[TURSO_CONNECTION_GUIDE.md](./database/TURSO_CONNECTION_GUIDE.md)** - Complete Turso database setup guide
- **[DATABASE_SETUP.md](./database/DATABASE_SETUP.md)** - Database schema and configuration
- **[DASHBOARD_DATABASE_SETUP.md](./database/DASHBOARD_DATABASE_SETUP.md)** - Dashboard-specific database setup
- **SQL Files** - Database schema files for reference

### 🔐 [Authentication](./authentication/)
Authentication system guides and implementation details.

- **[AUTHENTICATION_SYSTEM.md](./authentication/AUTHENTICATION_SYSTEM.md)** - Complete authentication architecture
- **[NEW_AUTHENTICATION_SYSTEM.md](./authentication/NEW_AUTHENTICATION_SYSTEM.md)** - Updated authentication implementation
- **[2FA_IMPLEMENTATION_GUIDE.md](./authentication/2FA_IMPLEMENTATION_GUIDE.md)** - Two-Factor Authentication setup
- **[CORRECTED_2FA_FLOW.md](./authentication/CORRECTED_2FA_FLOW.md)** - Fixed 2FA authentication flow
- **[LOGIN_SETUP.md](./authentication/LOGIN_SETUP.md)** - Login system configuration
- **[DEBUG_2FA_QR.md](./authentication/DEBUG_2FA_QR.md)** - 2FA QR code debugging

### ⚙️ [Setup & Configuration](./setup/)
Project setup, environment configuration, and structure guides.

- **[DASHBOARD_SETUP.md](./setup/DASHBOARD_SETUP.md)** - Dashboard configuration
- **[SETUP_ENV.md](./setup/SETUP_ENV.md)** - Environment variables configuration
- **[SETUP_2FA_ENV.md](./setup/SETUP_2FA_ENV.md)** - 2FA-specific environment setup
- **[REFACTORED_STRUCTURE.md](./setup/REFACTORED_STRUCTURE.md)** - Project structure overview
- **Environment Templates** - Template files for `.env` configuration

### 🐛 [Debugging & Troubleshooting](./debugging/)
Debugging guides, troubleshooting, and common issues.

- **[DEBUG_CONFIGURATION.md](./debugging/DEBUG_CONFIGURATION.md)** - Debug system setup
- **[DEBUG_GUIDE.md](./debugging/DEBUG_GUIDE.md)** - Comprehensive debugging guide
- **[QUICK_DEBUG_START.md](./debugging/QUICK_DEBUG_START.md)** - Quick debugging reference
- **[TROUBLESHOOTING.md](./debugging/TROUBLESHOOTING.md)** - Common issues and solutions

### 🔌 [API & Security](./api/)
API documentation, security guides, and testing.

- **[API_STRUCTURE.md](./api/API_STRUCTURE.md)** - API endpoints and structure
- **[SQL_INJECTION_PREVENTION_GUIDE.md](./api/SQL_INJECTION_PREVENTION_GUIDE.md)** - Security best practices
- **test-sql-injection.ts** - SQL injection testing utilities

## 🚀 Quick Navigation

### For New Users
1. Start with **[Database Setup](./database/TURSO_CONNECTION_GUIDE.md)**
2. Configure **[Environment Variables](./setup/SETUP_ENV.md)**
3. Read **[Authentication System](./authentication/AUTHENTICATION_SYSTEM.md)**

### For Developers
1. Review **[Project Structure](./setup/REFACTORED_STRUCTURE.md)**
2. Check **[API Structure](./api/API_STRUCTURE.md)**
3. Read **[Security Guidelines](./api/SQL_INJECTION_PREVENTION_GUIDE.md)**

### For Troubleshooting
1. Check **[Troubleshooting Guide](./debugging/TROUBLESHOOTING.md)**
2. Review **[Debug Configuration](./debugging/DEBUG_CONFIGURATION.md)**
3. Use **[Quick Debug Start](./debugging/QUICK_DEBUG_START.md)**

## 📝 Contributing to Documentation

When adding new documentation:

1. **Choose the right category** based on the content
2. **Use clear, descriptive filenames** in UPPERCASE with underscores
3. **Include a brief description** in this index
4. **Update the main README.md** if it's a major feature
5. **Use consistent formatting** and structure

## 🔍 Search Tips

- **Database issues**: Check the `database/` folder
- **Authentication problems**: Look in `authentication/` folder
- **Setup questions**: Review `setup/` folder
- **Debugging help**: Check `debugging/` folder
- **API questions**: See `api/` folder

---

**Note**: All documentation is organized by topic for easy navigation. Use the main [README.md](../README.md) for a quick overview of the project.
