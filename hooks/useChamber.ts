import { useQuery } from "@tanstack/react-query";
import { chamberApi } from "../api/chamber";
import { queryKeys } from "../config/queryClient";
import { useAuthReady } from "./useAuthReady";

// Custom hook for getting chamber models
export const useChamberModels = () => {
  const authReady = useAuthReady();
  return useQuery({
    queryKey: queryKeys.chambers.all,
    queryFn: chamberApi.getChamberModels,
    // staleTime: 24 * 60 * 60 * 1000, // 24 hours (temporarily disabled caching)
    // gcTime: 48 * 60 * 60 * 1000, // 48 hours (temporarily disabled caching)
    enabled: authReady,
  });
};
