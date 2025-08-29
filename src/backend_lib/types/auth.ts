export interface AuthStrategy {
  execute(data: AuthData): Promise<AuthResult>;
}

export type AuthData = LoginData | Setup2FAData | Verify2FAData;

export interface AuthResult {
  success: boolean;
  nextStep?: AuthStep;
  data?: AuthResultData;
  error?: string;
}

export enum AuthStep {
  LOGIN = "login",
  SETUP_2FA = "setup-2fa",
  VERIFY_2FA = "verify-2fa",
  COMPLETE = "complete",
}

export type AuthResultData =
  | LoginResultData
  | Setup2FAResultData
  | Verify2FAResultData;

// Data types for different authentication strategies
export type LoginData = {
  username: string;
  password: string;
};

export type Setup2FAData = {
  userId: string;
};

export type Verify2FAData = {
  userId: string;
  verificationCode: string;
};

////////////////////////////////////////////////////////////////////////////////////////

// Result data types for different authentication steps
export type LoginResultData = {
  userId: string;
  username: string;
};

export type Setup2FAResultData = {
  qrCode?: string;
  secret?: string;
  message?: string;
  user?: {
    userId: string;
    username: string;
  };
};

export type Verify2FAResultData = {
  userId: string;
  username: string;
};

////////////////////////////////////////////////////////////////////////////////////////

// Database Types
export interface User {
  id: string;
  username: string;
  passwordHash: string; // bcrypt hash (includes salt)
  passwordSalt: string; // Separate salt for additional security
  hasSetup2FA: boolean;
  is2FAVerified: boolean; // Tracks if user has completed 2FA verification in current session
  is2FAEnabled: boolean; // Allows users to disable 2FA feature
  secret2FA?: string;
  tempSecret2FA?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// Simple array-based projection type
export type UserProjection = (keyof User)[];

// Specific projection types for different strategies
export type LoginProjection = Pick<
  User,
  "id" | "username" | "passwordHash" | "hasSetup2FA" | "is2FAEnabled"
>;
export type Setup2FAProjection = Pick<User, "id" | "username" | "hasSetup2FA" | "secret2FA">;
export type Verify2FAProjection = Pick<User, "id" | "username" | "secret2FA" | "tempSecret2FA">;
export type UserStatusProjection = Pick<
  User,
  "id" | "hasSetup2FA" | "is2FAEnabled"
>;

export interface AuthSession {
  id: string;
  userId: string;
  sessionToken: string;
  step: AuthStep;
  isCompleted: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginAttempt {
  id: number;
  username: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  attemptedAt: string;
  step: string;
}

export interface AuditLog {
  id: number;
  userId?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Repository Interfaces
export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  findByUsernameWithProjection<T extends Partial<User>>(
    username: string,
    projection: UserProjection
  ): Promise<T | null>;
  findById(id: string): Promise<User | null>;
  findByIdWithProjection<T extends Partial<User>>(
    id: string,
    projection: UserProjection
  ): Promise<T | null>;
  create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  updateLastLogin(id: string): Promise<void>;
  update2FASecret(id: string, secret: string): Promise<void>;
  update2FAStatus(id: string, hasSetup2FA: boolean): Promise<void>;
  updateTempSecret(userId: string, secret: string): Promise<void>;
  complete2FASetup(userId: string, secret: string): Promise<void>;
  update2FAVerificationStatus(
    userId: string,
    isVerified: boolean
  ): Promise<void>;
  update2FAEnablement(userId: string, isEnabled: boolean): Promise<void>;
  reset2FAVerification(userId: string): Promise<void>;
}

export interface SessionRepository {
  create(
    session: Omit<AuthSession, "id" | "createdAt" | "updatedAt">
  ): Promise<AuthSession>;
  findByToken(token: string): Promise<AuthSession | null>;
  findByUserId(userId: string): Promise<AuthSession | null>;
  update(id: string, updates: Partial<AuthSession>): Promise<AuthSession>;
  delete(id: string): Promise<void>;
  deleteExpired(): Promise<void>;
}

// API Response Types
export interface LoginResponse {
  success: boolean;
  error?: string;
  nextStep?: string; // 'setup-2fa' | 'verify-2fa' | 'complete'
  user?: {
    userId: string;
    username: string;
  };
  message?: string;
}

export interface TwoFactorResponse {
  success: boolean;
  error?: string;
  qrCode?: string;
  secret?: string;
  needsSetup?: boolean;
  needsVerification?: boolean;
  isFirstSetup?: boolean;
  user?: {
    username: string;
  };
  message?: string;
}
