export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    nextStep: string; // 'setup-2fa' | 'verify-2fa' | 'complete'
    user: {
      userId: string;
      username: string;
    };
  };
  error?: string;
}

// TwoFactorSetupRequest - No body needed, uses auth token from cookies

export interface TwoFactorSetupResponse {
  success: boolean;
  message: string;
  data?: {
    qrCode: string;
    secret: string;
  };
  error?: string;
}

export interface TwoFactorVerifyRequest {
  verificationCode: string;
}

export interface TwoFactorVerifyResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface TwoFactorStatusResponse {
  success: boolean;
  message: string;
  data?: {
    hasSetup2FA: boolean;
    is2FAEnabled?: boolean;
  };
  error?: string;
}
