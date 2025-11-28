import { useQuery } from "@tanstack/react-query";
import { notificationApi } from "../api/notification";
import { queryKeys } from "../config/queryClient";

// Custom hook for getting notifications
export const useNotifications = () => {
  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: notificationApi.getNotifications,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook for getting notification count
export const useNotificationCount = () => {
  return useQuery({
    queryKey: [...queryKeys.notifications.all, "count"],
    queryFn: notificationApi.getNotificationCount,
    staleTime: 0,
    gcTime: 5 * 60 * 1000, // keep cache memory modest
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
  });
};
