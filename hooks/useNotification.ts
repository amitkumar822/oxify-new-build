import { useQuery } from "@tanstack/react-query";
import { notificationApi } from "../api/notification";
import { queryKeys } from "../config/queryClient";
import { useAuthReady } from "./useAuthReady";

// Custom hook for getting notifications
export const useNotifications = () => {
  const authReady = useAuthReady();
  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: notificationApi.getNotifications,
    // staleTime: 1 * 60 * 1000, // 1 minute (temporarily disabled caching)
    // gcTime: 5 * 60 * 1000, // 5 minutes (temporarily disabled caching)
    enabled: authReady,
  });
};

// Custom hook for getting notification count
export const useNotificationCount = () => {
  const authReady = useAuthReady();
  return useQuery({
    queryKey: [...queryKeys.notifications.all, "count"],
    queryFn: notificationApi.getNotificationCount,
    // staleTime: 0,
    // gcTime: 5 * 60 * 1000, // keep cache memory modest (temporarily disabled caching)
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
    enabled: authReady,
  });
};
