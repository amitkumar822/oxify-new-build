import { apiCall, API_BASE_URL } from "./utils";

export interface CreateSessionData {
  chamber: number;
  protocol: number;
  ata_level: number;
  duration_minutes: string;
  status: string;
  description: string;
  session_status: string;
  notes: string;
  completed: string;
}

// Session APIs
export const sessionApi = {
  getSessions: async ({ page, perPage }: { page: number; perPage: number }) => {
    return apiCall(
      `${API_BASE_URL}/user_session/?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
      }
    );
  },
  getSessionsFiltered: async (params: {
    ata_level?: string | number;
    protocol?: string | number;
    duration_start_time?: number;
    duration_end_time?: number;
    created_at?: string;
  }) => {
    const search = new URLSearchParams();
    if (
      params.ata_level !== undefined &&
      params.ata_level !== "All ATA Levels"
    ) {
      search.set("ata_level", String(params.ata_level));
    }
    if (params.protocol !== undefined && params.protocol !== "All Protocols") {
      search.set("protocol", String(params.protocol));
    }
    if (
      typeof params.duration_start_time === "number" &&
      typeof params.duration_end_time === "number"
    ) {
      search.set("duration_start_time", String(params.duration_start_time));
      search.set("duration_end_time", String(params.duration_end_time));
    }
    if (params.created_at !== undefined && params.created_at !== null) {
      search.set("created_at", String(params.created_at));
    }
    const url = search.toString()
      ? `${API_BASE_URL}/user_session/?${search.toString()}`
      : `${API_BASE_URL}/user_session/`;
    return apiCall(url, { method: "GET" });
  },
  createSession: async (sessionData: CreateSessionData) => {
    return apiCall(`${API_BASE_URL}/user_session/`, {
      method: "POST",
      body: JSON.stringify(sessionData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  getLongestStreak: async () => {
    return apiCall(`${API_BASE_URL}/user_longest_streak_api/`, {
      method: "GET",
    });
  },
  getStreakFreeze: async () => {
    return apiCall(`${API_BASE_URL}/streak_freeze_api/`, {
      method: "GET",
    });
  },
  useStreakFreeze: async () => {
    return apiCall(`${API_BASE_URL}/streak_freeze_api/`, {
      method: "POST",
    });
  },
  getCurrentMonthSessionDates: async (year: number, month: number) => {
    const searchParams = new URLSearchParams({
      year: year.toString(),
      month: month.toString(),
    });
    return apiCall(
      `${API_BASE_URL}/current_month_user_session_date_api/?${searchParams.toString()}`,
      {
        method: "GET",
      }
    );
  },
  getUserAtaHistory: async () => {
    return apiCall(
      `${API_BASE_URL}/user_ata_history_using_session_of_current_week_api/`,
      {
        method: "GET",
      }
    );
  },
  getUserMilestoneBadges: async () => {
    return apiCall(`${API_BASE_URL}/user_milestone_badges_history_api/`, {
      method: "GET",
    });
  },
  getQuote: async (date?: string) => {
    const url = date
      ? `${API_BASE_URL}/get_quote_api/?created_date=${date}`
      : `${API_BASE_URL}/get_quote_api/`;
    return apiCall(url, {
      method: "GET",
    });
  },
  updateProfile: async (imageUri: string) => {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    } as any);

    return apiCall(`${API_BASE_URL}/update_profile/`, {
      method: "PATCH",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getUserDailyWeeklySessions: async () => {
    return apiCall(
      `${API_BASE_URL}/user_daily_weekly_session_current_month_api/`,
      {
        method: "GET",
      }
    );
  },
};
