import { apiCall, API_BASE_URL } from "./utils";

// Profile update data interface
export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string; // Fixed: changed from Last_name to last_name
  email?: string;
  gender?: string;
  date_of_birth?: string;
  image?: File | null;
}

// Change password data interface
export interface ChangePasswordData {
  email: string;
  old_password: string;
  new_password: string;
  confirm_password: string;
}

// Profile APIs
export const profileApi = {
  getProfile: async () => {
    // console.log("🔍 Fetching profile from:", `${API_BASE_URL}/get_profile/`);
    const result = await apiCall(`${API_BASE_URL}/get_profile/`, {
      method: "GET",
    });
    // console.log("📱 Profile API response:", result);
    return result;
  },

  updateProfile: async (profileData: ProfileUpdateData) => {
    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Add text fields
    if (profileData.first_name) {
      formData.append("first_name", profileData.first_name);
    }
    if (profileData.last_name) {
      formData.append("last_name", profileData.last_name); // Fixed: changed from Last_name to last_name
    }
    if (profileData.email) {
      formData.append("email", profileData.email);
    }
    if (profileData.gender) {
      formData.append("gender", profileData.gender);
    }
    if (profileData.date_of_birth) {
      formData.append("date_of_birth", profileData.date_of_birth);
    }
    if (profileData.image) {
      formData.append("image", profileData.image);
    }

    return apiCall(`${API_BASE_URL}/update_profile/`, {
      method: "PATCH",
      body: formData,
    });
  },

  changePassword: async (passwordData: ChangePasswordData) => {
    return apiCall(`${API_BASE_URL}/user_change_password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    });
  },
};
