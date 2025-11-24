import { apiCall, API_BASE_URL } from "./utils";

// Health Goal APIs
export const healthGoalApi = {
  getHealthGoalTags: async () => {
    return apiCall(`${API_BASE_URL}/list_health_goal_tag_api/`, {
      method: "GET",
    });
  },
};
