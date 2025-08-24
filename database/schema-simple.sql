-- Turso Cloud SQLite Database Schema for Authentication System (Simplified)

-- Users table for authentication management
CREATE TABLE users (
    id TEXT PRIMARY KEY NOT NULL,
    username TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    passwordSalt TEXT NOT NULL, -- Separate salt for additional security
    hasSetup2FA INTEGER NOT NULL DEFAULT 0,
    is2FAVerified INTEGER NOT NULL DEFAULT 0,
    is2FAEnabled INTEGER NOT NULL DEFAULT 1,
    secret2FA TEXT NULL,
    tempSecret2FA TEXT NULL,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    lastLoginAt TEXT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_users_username ON users(username) WHERE isActive = 1;
CREATE INDEX idx_users_active ON users(isActive);
CREATE INDEX idx_users_last_login ON users(lastLoginAt);
CREATE INDEX idx_users_2fa_verified ON users(is2FAVerified);
CREATE INDEX idx_users_2fa_enabled ON users(is2FAEnabled);

-- Authentication sessions table
CREATE TABLE auth_sessions (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL,
    sessionToken TEXT NOT NULL UNIQUE,
    step TEXT NOT NULL,
    isCompleted INTEGER NOT NULL DEFAULT 0,
    expiresAt TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for sessions
CREATE INDEX idx_sessions_token ON auth_sessions(sessionToken);
CREATE INDEX idx_sessions_user ON auth_sessions(userId);
CREATE INDEX idx_sessions_expires ON auth_sessions(expiresAt);

-- Login attempts table for security
CREATE TABLE login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    success INTEGER NOT NULL DEFAULT 0,
    attemptedAt TEXT NOT NULL DEFAULT (datetime('now')),
    step TEXT NOT NULL
);

-- Index for login attempts
CREATE INDEX idx_login_attempts_username ON login_attempts(username, attemptedAt);
CREATE INDEX idx_login_attempts_ip ON login_attempts(ipAddress, attemptedAt);

-- Audit log table
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    action TEXT NOT NULL,
    details TEXT,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- Index for audit logs
CREATE INDEX idx_audit_logs_user ON audit_logs(userId, createdAt);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, createdAt);

-- Views for easier querying
CREATE VIEW active_users AS
SELECT 
    id,
    username,
    hasSetup2FA,
    is2FAVerified,
    is2FAEnabled,
    secret2FA IS NOT NULL as hasSecret,
    createdAt,
    lastLoginAt
FROM users 
WHERE isActive = 1;

CREATE VIEW recent_login_attempts AS
SELECT 
    username,
    COUNT(*) as attempt_count,
    MAX(attemptedAt) as last_attempt,
    SUM(success) as successful_attempts
FROM login_attempts 
WHERE attemptedAt > datetime('now', '-1 hour')
GROUP BY username;
