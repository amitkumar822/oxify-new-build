import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { Platform } from "react-native";

// API Configuration
const API_CONFIG = {
  BASE_URL: __DEV__
    ? Platform.OS === "android"
      ? "http://10.0.2.2:3000/api"
      : "http://localhost:3000/api"
    : "https://your-production-api.com/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (__DEV__) {
      // console.log("🚀 API Request:", {
      //   method: config.method?.toUpperCase(),
      //   url: config.url,
      //   data: config.data,
      //   headers: config.headers,
      // });
    }

    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error("❌ Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      console.log("✅ API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      console.error("❌ Response Error:", {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      clearAuthToken();
      // You can add navigation logic here
    }

    if (error.response?.status === 403) {
      // Forbidden - handle accordingly
    }

    if (error.response?.status >= 500) {
      // Server error - could implement retry logic
    }

    return Promise.reject(error);
  }
);

// Auth token management (replace with your actual storage method)
const getAuthToken = (): string | null => {
  // TODO: Implement actual token storage (AsyncStorage, SecureStore, etc.)
  return null;
};

const clearAuthToken = (): void => {
  // TODO: Implement actual token clearing
};

export { apiClient, API_CONFIG };
export default apiClient;
