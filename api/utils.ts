import { getToken } from "../utils/tokenManager";
import { emitUnauthorized } from "../utils/authEvents";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

export const API_BASE_URL = "https://oxify.malspy.com";

export async function getAuthToken(): Promise<string | null> {
  try {
    const token = await getToken();
    return token;
  } catch (error) {
    return null;
  }
}

export async function apiCall<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = await getAuthToken();

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData
    if (options.body instanceof FormData) {
      delete defaultHeaders["Content-Type"];
    }

    const finalOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;

      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        if (errorText) {
          errorMessage = errorText;
        }
      }

      if (response.status === 401) {
        emitUnauthorized();
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}
