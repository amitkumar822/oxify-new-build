import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { learningApi } from "../api/learning";
import { queryKeys } from "../config/queryClient";
import { showToast } from "../config";
import { useAuthGate } from "./useAuthGate";

const useAuthEnabled = () => {
  const { authReady } = useAuthGate();
  return authReady;
};

// Custom hook for getting learning categories
export const useLearningCategories = () => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [...queryKeys.learning.all, "categories"],
    queryFn: learningApi.getLearningCategories,
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: authReady,
  });
};

// Custom hook for getting learning content
export const useLearningContent = (
  search?: string,
  categoryId?: number,
  page?: number,
  perPage?: number
) => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [
      ...queryKeys.learning.lists(),
      "content",
      { search, categoryId, page, perPage },
    ],
    queryFn: async () => {
      const result = await learningApi.getLearningContent(
        search,
        categoryId,
        page,
        perPage
      );
      return result;
    },
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
    gcTime: 12 * 60 * 60 * 1000, // 12 hours
    enabled: authReady,
  });
};

// Custom hook for getting category-based content
export const useCategoryContent = (categoryId: number) => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [...queryKeys.learning.lists(), "category", categoryId],
    queryFn: () => learningApi.getCategoryBasedContent(categoryId),
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
    gcTime: 12 * 60 * 60 * 1000, // 12 hours
    enabled: authReady && !!categoryId,
  });
};

// Custom hook for updating learning content status
export const useUpdateContentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: number) =>
      learningApi.updateLearningContentStatus(contentId),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Content status updated!");
        // Invalidate learning content queries
        queryClient.invalidateQueries({ queryKey: queryKeys.learning.all });
      } else {
        showToast.error(data.error || "Failed to update content status");
      }
    },
    onError: (error) => {
      showToast.error("Failed to update content status. Please try again.");
      console.error("Content status update failed:", error);
    },
  });
};

// Custom hook for adding learning reaction
export const useAddReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contentId,
      reactionType,
    }: {
      contentId: number;
      reactionType: string;
    }) => learningApi.addLearningReaction(contentId, reactionType),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Reaction added!");
        // Invalidate learning content and reaction counts so UI updates
        queryClient.invalidateQueries({ queryKey: queryKeys.learning.all });
      } else {
        showToast.error(data.error || "Failed to add reaction");
      }
    },
    onError: (error) => {
      showToast.error("Failed to add reaction. Please try again.");
      console.error("Add reaction failed:", error);
    },
  });
};

// Custom hook for getting reaction count
export const useReactionCount = (contentId: number) => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [...queryKeys.learning.all, "reactions", contentId],
    queryFn: () => learningApi.getReactionCount(contentId),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: authReady && !!contentId,
  });
};

// Custom hook for adding comment
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contentId,
      comment,
      parent,
      tag,
    }: {
      contentId: number;
      comment: string;
      parent?: number | null;
      tag?: number | null;
    }) => learningApi.addComment(contentId, comment, parent, tag),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Comment added!");
        // Invalidate learning content queries
        queryClient.invalidateQueries({ queryKey: queryKeys.learning.all });
      } else {
        showToast.error(data.error || "Failed to add comment");
      }
    },
    onError: (error) => {
      showToast.error("Failed to add comment. Please try again.");
      console.error("Add comment failed:", error);
    },
  });
};

// Custom hook for liking comment
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => learningApi.likeComment(commentId),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Comment liked!");
        // Invalidate learning content queries
        queryClient.invalidateQueries({ queryKey: queryKeys.learning.all });
      } else {
        showToast.error(data.error || "Failed to like comment");
      }
    },
    onError: (error) => {
      showToast.error("Failed to like comment. Please try again.");
      console.error("Like comment failed:", error);
    },
  });
};

// Custom hook for deleting comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => learningApi.deleteComment(commentId),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Comment deleted");
        queryClient.invalidateQueries({ queryKey: queryKeys.learning.all });
      } else {
        showToast.error(data.error || "Failed to delete comment");
      }
    },
    onError: (error) => {
      showToast.error("Failed to delete comment. Please try again.");
      console.error("Delete comment failed:", error);
    },
  });
};

// Custom hook for toggling favorite learning content
export const useToggleFavoriteLearningContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: number) =>
      learningApi.toggleFavoriteLearningContent(contentId),
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate learning content queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: queryKeys.learning.all });
      } else {
        showToast.error(data.error || "Failed to update bookmark status");
      }
    },
    onError: (error) => {
      showToast.error("Failed to update bookmark status. Please try again.");
      console.error("Toggle favorite learning content failed:", error);
    },
  });
};

// Custom hook for getting saved articles
export const useSavedArticles = ({
  page,
  perPage,
}: {
  page: number;
  perPage: number;
}) => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [...queryKeys.learning.all, "saved", page, perPage],
    queryFn: () => learningApi.getSavedArticles(page, perPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: authReady,
  });
};

// Custom hook for posting articles
export const usePostArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      categories,
      content,
    }: {
      title: string;
      categories: number[];
      content: string;
    }) => learningApi.postArticle(title, categories, content),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Article posted successfully!");
        // Invalidate learning content queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: queryKeys.learning.all });
      } else {
        showToast.error(data.error || "Failed to post article");
      }
    },
    onError: (error) => {
      showToast.error("Failed to post article. Please try again.");
      console.error("Post article failed:", error);
    },
  });
};

// Custom hook for getting user's own articles
export const useUserArticles = ({
  page,
  perPage,
}: {
  page: number;
  perPage: number;
}) => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [...queryKeys.learning.all, "user-articles", page, perPage],
    queryFn: () => learningApi.getUserArticles(page, perPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: authReady,
  });
};

// Custom hook for deleting articles
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: number) => learningApi.deleteArticle(contentId),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Article deleted successfully!");
        // Invalidate learning content queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: queryKeys.learning.all });
      } else {
        showToast.error(data.error || "Failed to delete article");
      }
    },
    onError: (error) => {
      showToast.error("Failed to delete article. Please try again.");
      console.error("Delete article failed:", error);
    },
  });
};

// Custom hook for getting comments
export const useComments = (contentId: number, enabled: boolean = true) => {
  const authReady = useAuthEnabled();
  return useQuery({
    queryKey: [...queryKeys.learning.all, "comments", contentId],
    queryFn: () => learningApi.getComments(contentId),
    staleTime: 1 * 60 * 1000, // 1 minutes
    enabled: authReady && !!contentId && enabled,
  });
};
