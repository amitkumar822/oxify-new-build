import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sessionApi } from "../api/session";
import { queryKeys } from "../config/queryClient";
import { showToast } from "../config";
import { useAuthGate } from "./useAuthGate";

const useAuthEnabled = () => {
  const { authReady } = useAuthGate();
  return authReady;
};

// Custom hook for getting user sessions
export const useUserSessions = () => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: queryKeys.sessions.lists(),
    queryFn: sessionApi.getSessions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: authReady,
  });
};

// Filtered sessions query
export const useFilteredSessions = (params: {
  ata_level?: string | number;
  protocol?: string | number;
  duration_start_time?: number;
  duration_end_time?: number;
  created_at?: string;
}) => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [...queryKeys.sessions.lists(), "filtered", params],
    queryFn: () => sessionApi.getSessionsFiltered(params),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: authReady && false,
  });
};

// Custom hook for getting longest streak
export const useLongestStreak = () => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [...queryKeys.sessions.all, "longest-streak"],
    queryFn: sessionApi.getLongestStreak,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: authReady,
  });
};

// Custom hook for getting streak freeze count
export const useStreakFreeze = () => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [...queryKeys.sessions.all, "streak-freeze"],
    queryFn: sessionApi.getStreakFreeze,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: authReady,
  });
};

// Custom hook for using streak freeze
export const useUseStreakFreeze = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sessionApi.useStreakFreeze(),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Streak freeze activated!");
        // Invalidate streak freeze queries to refresh the count
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.sessions.all, "streak-freeze"],
        });
      } else {
        showToast.error(data.error || "Failed to activate streak freeze");
      }
    },
    onError: (error) => {
      showToast.error("Failed to activate streak freeze. Please try again.");
      console.error("Use streak freeze failed:", error);
    },
  });
};

// Custom hook for getting current month session dates
export const useCurrentMonthSessionDates = (year: number, month: number) => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [...queryKeys.sessions.all, "current-month-dates", year, month],
    queryFn: () => sessionApi.getCurrentMonthSessionDates(year, month),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: authReady,
  });
};

// Custom hook for getting user ATA history
export const useUserAtaHistory = () => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [...queryKeys.sessions.all, "ata-history"],
    queryFn: sessionApi.getUserAtaHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: authReady,
  });
};

// Custom hook for getting user milestone badges
export const useUserMilestoneBadges = () => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [...queryKeys.sessions.all, "milestone-badges"],
    queryFn: sessionApi.getUserMilestoneBadges,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: authReady,
  });
};

// Quote image
export const useQuote = (date?: string) => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: ["quote", date],
    queryFn: () => sessionApi.getQuote(date),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: authReady,
  });
};

// Update profile with image
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionApi.updateProfile,
    onSuccess: () => {
      // Invalidate profile queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

// Get daily and weekly sessions for current month
export const useUserDailyWeeklySessions = () => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [...queryKeys.sessions.all, "daily-weekly"],
    queryFn: sessionApi.getUserDailyWeeklySessions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: authReady,
  });
};

// Custom hook for creating user session
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionData: any) => sessionApi.createSession(sessionData),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Session created successfully!");
        // Invalidate session queries
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      } else {
        showToast.error(data.error || "Failed to create session");
      }
    },
    onError: (error) => {
      showToast.error("Failed to create session. Please try again.");
      console.error("Session creation failed:", error);
    },
  });
};
