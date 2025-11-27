import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { protocolApi } from "../api/protocol";
import { queryKeys } from "../config/queryClient";
import { showToast } from "../config";

// Custom hook for getting protocols
export const useProtocols = () => {
  return useQuery({
    queryKey: queryKeys.protocols.lists(),
    queryFn: protocolApi.getProtocols,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
  });
};

// Custom hook for getting suggested protocols
export const useSuggestedProtocols = () => {
  return useQuery({
    queryKey: [...queryKeys.protocols.lists(), "suggested"],
    queryFn: protocolApi.getSuggestedProtocols,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSuggestedProtocolsFiltered = ({
  protocolCategoryId,
  search,
  page,
  perPage,
}: {
  protocolCategoryId?: number;
  search?: string;
  page: number;
  perPage: number;
}) => {
  return useQuery({
    queryKey: [
      ...queryKeys.protocols.lists(),
      "suggested",
      { protocolCategoryId, search, page, perPage },
    ],
    queryFn: async () => {
      const result = await protocolApi.getSuggestedProtocolsFiltered(
        protocolCategoryId,
        search,
        page,
        perPage
      );
      return result;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useProtocolCategoryList = () => {
  return useQuery({
    queryKey: [...queryKeys.protocols.lists(), "categoryList"],
    queryFn: protocolApi.getProtocolCategoryList,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
  });
};

// Custom hook to fetch user's session protocols for analytics filter
export const useUserSessionProtocols = () => {
  return useQuery({
    queryKey: [...queryKeys.protocols.lists(), "user-session-protocols"],
    queryFn: () => {
      console.log("Calling useUserSessionProtocols");
      return protocolApi.getUserSessionProtocols();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Custom hook to fetch user's ATA levels for analytics filter
export const useUserSessionAtaLevels = () => {
  return useQuery({
    queryKey: [...queryKeys.protocols.lists(), "user-session-ata-levels"],
    queryFn: protocolApi.getUserSessionAtaLevels,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Custom hook for getting favorite protocols
export const useFavoriteProtocols = ({
  page,
  perPage,
}: {
  page: number;
  perPage: number;
}) => {
  return useQuery({
    queryKey: [...queryKeys.protocols.lists(), "favorites", page, perPage],
    queryFn: () => protocolApi.getFavoriteProtocols({ page, perPage }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Custom hook for adding favorite protocol
export const useAddFavoriteProtocol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (protocolId: number) =>
      protocolApi.addFavoriteProtocol(protocolId),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Protocol added to favorites!");
        // Invalidate favorite protocols
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.protocols.lists(), "favorites"],
        });
      } else {
        showToast.error(data.error || "Failed to add to favorites");
      }
    },
    onError: (error) => {
      showToast.error("Failed to add to favorites. Please try again.");
      console.error("Add favorite failed:", error);
    },
  });
};

// Custom hook for toggling favorite protocol
export const useToggleFavoriteProtocol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (protocolId: number) =>
      protocolApi.toggleFavoriteProtocol(protocolId),
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate both suggested protocols and favorites to refresh the UI
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.protocols.lists(), "suggested"],
        });
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.protocols.lists(), "favorites"],
        });
      } else {
        showToast.error(data.error || "Failed to update favorite status");
      }
    },
    onError: (error) => {
      showToast.error("Failed to update favorite status. Please try again.");
      console.error("Toggle favorite failed:", error);
    },
  });
};

// Custom hook for getting protocol categories
export const useProtocolCategories = () => {
  return useQuery({
    queryKey: [...queryKeys.protocols.lists(), "categories"],
    queryFn: protocolApi.getProtocolCategories,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
  });
};
