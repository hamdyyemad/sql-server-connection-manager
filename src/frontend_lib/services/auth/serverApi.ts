import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// API base configuration - for server-side, we need to use the full URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window === "undefined" ? "http://localhost:3000/api/v1" : "/api/v1");

// Create axios instance for server-side use (no localStorage, no browser APIs)
const serverApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120 seconds (2 minutes)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for server-side
serverApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Server Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for server-side
serverApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response
    console.log("✅ Server API Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });

    // Handle API response format
    if (response.data && typeof response.data === "object") {
      if (response.data.success === false) {
        // API returned an error
        interface ApiError extends Error {
          isApiError: boolean;
          apiError: unknown;
        }
        const error = new Error(response.data.error || "API Error") as ApiError;
        error.isApiError = true;
        error.apiError = response.data;
        return Promise.reject(error);
      }
    }

    return response;
  },
  (error: AxiosError) => {
    console.error("❌ Server Response Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      isNetworkError: !error.response && error.request,
      requestData: error.config?.data,
    });

    return Promise.reject(error);
  }
);

// Export the server axios instance
export { serverApiClient };

// Export types
export type { AxiosInstance, AxiosResponse, AxiosError };
