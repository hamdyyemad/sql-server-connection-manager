// Auth Admin Services - Authentication and User Management (Turso Database)
// This folder contains services for authentication and admin user management
// Database-agnostic: Can work with Turso, PostgreSQL, MySQL, etc.

// User Management Services
export { UserService } from "./users";

// Auth services
export { AuthenticationManager } from "./auth/strategies/authentication-manager";
export { LoginStrategy } from "./auth/strategies/login-strategy";
export { Setup2FAStrategy } from "./auth/strategies/setup-2FA-strategy";
export { Verify2FAStrategy } from "./auth/strategies/verify-2FA-strategy";
