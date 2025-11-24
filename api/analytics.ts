import { apiCall, API_BASE_URL } from "./utils";

// Analytics APIs
export const analyticsApi = {
  getUserAnalytics: async () => {
    return apiCall(`${API_BASE_URL}/user_analytics_api/`, {
      method: "GET",
    });
  },
};
