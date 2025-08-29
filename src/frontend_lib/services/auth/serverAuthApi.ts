import { serverApiClient } from "./serverApi";
import { ApiResponse } from "../../types/api";
import {
  LoginRequest,
  LoginResponse,
  TwoFactorSetupResponse,
  TwoFactorVerifyResponse,
  TwoFactorStatusResponse,
} from "../../types/auth";

export const serverAuthApi = {
  login: async (
    credentials: LoginRequest
  ): Promise<ApiResponse<LoginResponse>> => {
    const response = await serverApiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    return response.data as ApiResponse<LoginResponse>;
  },

  setup2FA: async (
    userId: string
  ): Promise<ApiResponse<TwoFactorSetupResponse>> => {
    const response = await serverApiClient.post<TwoFactorSetupResponse>(
      "/auth/setup-2fa",
      { userId }
    );
    return response.data as ApiResponse<TwoFactorSetupResponse>;
  },

  verify2FA: async (
    userId: string,
    verificationCode: string
  ): Promise<ApiResponse<TwoFactorVerifyResponse>> => {
    const response = await serverApiClient.post<TwoFactorVerifyResponse>(
      "/auth/verify-2fa",
      { userId, verificationCode }
    );
    return response.data as ApiResponse<TwoFactorVerifyResponse>;
  },

  check2FAStatus: async (
    userId: string
  ): Promise<ApiResponse<TwoFactorStatusResponse>> => {
    const response = await serverApiClient.post<TwoFactorStatusResponse>(
      "/auth/check-2fa-status",
      { userId }
    );
    return response.data as ApiResponse<TwoFactorStatusResponse>;
  },
};
