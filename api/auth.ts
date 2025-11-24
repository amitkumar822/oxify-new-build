import { Platform } from "react-native";
import { apiCall, API_BASE_URL } from "./utils";

// Authentication APIs
export const authApi = {
  login: async (email: string, password: string) => {
    return apiCall(`${API_BASE_URL}/login/`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  googleLoginInfoSave: async (access_token: string) => {
    return apiCall(`${API_BASE_URL}/google_login/`, {
      method: "POST",
      body: JSON.stringify({ access_token }),
    });
  },

  appleLoginInfoSave: async (identity_token: string, givenName?: string, familyName?: string, email?: string) => {
    const body: any = { identity_token };
    if (givenName) body.givenName = givenName;
    if (familyName) body.familyName = familyName;
    if (email) body.email = email;
    return apiCall(`${API_BASE_URL}/apple_login/`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  pushNotificationTokenSave: async (token: string, device_type: string) => {
    return apiCall(`${API_BASE_URL}/device_push_notification/`, {
      method: "POST",
      body: JSON.stringify({ expo_push_token: token, platform: device_type }),
    });
  },

  generateEmailOtp: async (email: string) => {
    return apiCall(`${API_BASE_URL}/email_otp_generate/`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  generateForgotPasswordOtp: async (email: string) => {
    return apiCall(`${API_BASE_URL}/forgot_password_api/`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyEmailOtp: async (email: string, otp: string) => {
    return apiCall(`${API_BASE_URL}/verify_otp/`, {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  register: async (userData: any) => {
    return apiCall(`${API_BASE_URL}/register_api/`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  verifyEmail: async (uidb64: string, token: string) => {
    return apiCall(`${API_BASE_URL}/verify-email/${uidb64}/${token}/`, {
      method: "GET",
    });
  },

  setPassword: async (password: string) => {
    return apiCall(`${API_BASE_URL}/set-password/`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    return apiCall(`${API_BASE_URL}/change_password/`, {
      method: "POST",
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
  },

  forgotPasswordChange: async (newPassword: string, email: string) => {
    return apiCall(`${API_BASE_URL}/set-password/`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: newPassword,
        confirm_password: newPassword,
      }),
    });
  },

  deleteProfile: async () => {
    return apiCall(`${API_BASE_URL}/get_profile/`, {
      method: "DELETE",
    });
  },

  // Username availability check
  checkUsername: async (username: string) => {
    // Expect 200 if exists, 404 if not found
    return apiCall(
      `${API_BASE_URL}/check_username/?username=${encodeURIComponent(
        username
      )}`,
      {
        method: "GET",
      }
    );
  },

  // Google authentication
  googleLogin: async (googleUserData: {
    access_token: string;
    email: string;
    first_name: string;
    last_name: string;
    id: string;
    image?: string;
  }) => {
    return apiCall(`${API_BASE_URL}/google_login/`, {
      method: "POST",
      body: JSON.stringify(googleUserData),
    });
  },
};
