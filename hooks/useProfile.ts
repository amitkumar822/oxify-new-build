import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  profileApi,
  ProfileUpdateData,
  ChangePasswordData,
} from "../api/profile";
import { queryKeys } from "../config/queryClient";
import { showToast } from "../config";
import { useAuthReady } from "./useAuthReady";

// Custom hook for getting profile
export const useProfile = () => {
  const authReady = useAuthReady();
  const result = useQuery({
    queryKey: queryKeys.profile.all,
    queryFn: profileApi.getProfile,
    // staleTime: 5 * 60 * 1000, // 5 minutes (temporarily disabled caching)
    // gcTime: 10 * 60 * 1000, // 10 minutes (temporarily disabled caching)
    enabled: authReady,
  });

  return result;
};

// Custom hook for updating profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: ProfileUpdateData) =>
      profileApi.updateProfile(profileData),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Profile updated successfully!");
        // Invalidate profile queries
        queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      } else {
        showToast.error(data.error || "Failed to update profile");
      }
    },
    onError: (error) => {
      showToast.error("Failed to update profile. Please try again.");
      console.error("Profile update failed:", error);
    },
  });
};

// Custom hook for changing password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData: ChangePasswordData) =>
      profileApi.changePassword(passwordData),
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
