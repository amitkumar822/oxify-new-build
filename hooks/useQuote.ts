import { useQuery } from "@tanstack/react-query";
import { quoteApi } from "../api/quote";
import { queryKeys } from "../config/queryClient";
import { useAuthGate } from "./useAuthGate";

// Custom hook for getting quote
export const useQuote = (date?: string) => {
  const { authReady } = useAuthGate();
  return useQuery({
    queryKey: [queryKeys.quotes.all, date],
    queryFn: () => quoteApi.getQuote(date),
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    enabled: authReady,
  });
};
