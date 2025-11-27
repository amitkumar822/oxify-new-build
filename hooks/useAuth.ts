import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { queryKeys } from "../config/queryClient";
import { showToast } from "../config";

// Custom hook for login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Login successful!");
        // Invalidate and refetch user-related queries
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      } else {
        showToast.error(data.error || "Login failed");
      }
    },
    onError: (error) => {
      showToast.error("Login failed. Please try again.");
      console.error("Login failed:", error);
    },
  });
};

// Custom hook for signup
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: any) => authApi.register(userData),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Registration successful!");
        // Invalidate and refetch user-related queries
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      } else {
        showToast.error(data.error || "Registration failed");
      }
    },
    onError: (error) => {
      showToast.error("Registration failed. Please try again.");
      console.error("Signup failed:", error);
    },
  });
};

// Custom hook for email verification
export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uidb64, token }: { uidb64: string; token: string }) =>
      authApi.verifyEmail(uidb64, token),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Email verified successfully!");
        // Invalidate user data to refetch with verified status
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      } else {
        showToast.error(data.error || "Email verification failed");
      }
    },
    onError: (error) => {
      showToast.error("Email verification failed. Please try again.");
      console.error("Email verification failed:", error);
    },
  });
};

// Custom hook for setting password
export const useSetPassword = () => {
  return useMutation({
    mutationFn: (password: string) => authApi.setPassword(password),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Password set successfully!");
      } else {
        showToast.error(data.error || "Failed to set password");
      }
    },
    onError: (error) => {
      showToast.error("Failed to set password. Please try again.");
      console.error("Set password failed:", error);
    },
  });
};

// Custom hook for changing password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => authApi.changePassword(oldPassword, newPassword),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Password changed successfully!");
      } else {
        showToast.error(data.error || "Failed to change password");
      }
    },
    onError: (error) => {
      showToast.error("Failed to change password. Please try again.");
      console.error("Password change failed:", error);
    },
  });
};
