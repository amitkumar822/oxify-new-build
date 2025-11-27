import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics";
import { queryKeys } from "../config/queryClient";
import { useAuthGate } from "./useAuthGate";

// Custom hook for getting user analytics
export const useUserAnalytics = () => {
  const { authReady } = useAuthGate();
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: analyticsApi.getUserAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: authReady,
  });
};
