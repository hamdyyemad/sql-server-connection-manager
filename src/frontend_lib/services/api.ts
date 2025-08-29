import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { createEnhancedError } from "./errorHandler";

// API base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120 seconds (2 minutes) - increased from 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authentication token if available
    let token: string | null = null;

    // Check if we're in a browser environment (client-side)
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      token = localStorage.getItem("authToken");
    }

    // If no token from localStorage and we're in a server environment, try to get from cookies
    if (!token && typeof window === "undefined") {
      // This will be handled by the server-side API calls that pass cookies directly
      // The token will be passed via the Cookie header in the request
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging
    console.log("🚀 API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    });

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response
    console.log("✅ API Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });

    // Handle API response format
    if (response.data && typeof response.data === "object") {
      if (response.data.success === false) {
        // API returned an error
        const error = new Error(response.data.error || "API Error");
        (error as any).isApiError = true;
        (error as any).apiError = response.data;
        return Promise.reject(error);
      }
    }

    return response;
  },
  (error: AxiosError) => {
    console.error("❌ Response Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      isNetworkError: !error.response && error.request,
      requestData: error.config?.data,
    });

    // Use the new error handler
    return Promise.reject(createEnhancedError(error));
  }
);

// Export the axios instance for custom requests
export { apiClient };

// Export types
export type { AxiosInstance, AxiosResponse, AxiosError };
