import { useQuery } from "@tanstack/react-query";
import { healthGoalApi } from "../api/healthGoal";
import { queryKeys } from "../config/queryClient";
import { useAuthReady } from "./useAuthReady";

// Custom hook for getting health goal tags
export const useHealthGoalTags = () => {
  const authReady = useAuthReady();
  return useQuery({
    queryKey: queryKeys.healthGoals.all,
    queryFn: healthGoalApi.getHealthGoalTags,
    // staleTime: 24 * 60 * 60 * 1000, // 24 hours (temporarily disabled caching)
    // gcTime: 48 * 60 * 60 * 1000, // 48 hours (temporarily disabled caching)
    enabled: authReady,
  });
};
