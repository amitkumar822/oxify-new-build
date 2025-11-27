import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global query options
      // staleTime: 5 * 60 * 1000, // 5 minutes
      // gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Global mutation options
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Query keys factory for consistent key management
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
    profile: () => [...queryKeys.auth.all, "profile"] as const,
  },
  profile: {
    all: ["profile"] as const,
  },
  sessions: {
    all: ["sessions"] as const,
    lists: () => [...queryKeys.sessions.all, "list"] as const,
    list: (filters: string) =>
      [...queryKeys.sessions.lists(), { filters }] as const,
    details: () => [...queryKeys.sessions.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.sessions.details(), id] as const,
  },
  protocols: {
    all: ["protocols"] as const,
    lists: () => [...queryKeys.protocols.all, "list"] as const,
    list: (filters: string) =>
      [...queryKeys.protocols.all, "list", { filters }] as const,
    details: () => [...queryKeys.protocols.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.protocols.details(), id] as const,
  },
  learning: {
    all: ["learning"] as const,
    lists: () => [...queryKeys.learning.all, "list"] as const,
    list: (filters: string) =>
      [...queryKeys.learning.all, "list", { filters }] as const,
    details: () => [...queryKeys.learning.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.learning.details(), id] as const,
  },
  chambers: {
    all: ["chambers"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
  },
  analytics: {
    all: ["analytics"] as const,
    dashboard: () => [...queryKeys.analytics.all, "dashboard"] as const,
    streak: () => [...queryKeys.analytics.all, "streak"] as const,
    calendar: () => [...queryKeys.analytics.all, "calendar"] as const,
  },
  quotes: {
    all: ["quotes"] as const,
  },
  healthGoals: {
    all: ["healthGoals"] as const,
  },
} as const;
