import { apiCall, API_BASE_URL } from "./utils";

// Notification APIs
export const notificationApi = {
  getNotifications: async () => {
    return apiCall(`${API_BASE_URL}/notification_api/`, {
      method: "GET",
    });
  },

  getNotificationCount: async () => {
    return apiCall(`${API_BASE_URL}/count_notification_api/`, {
      method: "GET",
    });
  },

  // Reminder APIs
  getReminderSettings: async () => {
    return apiCall(`${API_BASE_URL}/reminder_set_api/`, {
      method: "GET",
    });
  },

  saveReminderSettings: async (reminderTime: string) => {
    return apiCall(`${API_BASE_URL}/reminder_set_api/`, {
      method: "POST",
      body: JSON.stringify({ reminder_time: reminderTime }),
    });
  },
};
