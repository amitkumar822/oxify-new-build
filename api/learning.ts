import { apiCall, API_BASE_URL } from "./utils";

// Learning Hub APIs
export const learningApi = {
  getLearningCategories: async () => {
    return apiCall(`${API_BASE_URL}/app_learning_hub_category_api/`, {
      method: "GET",
    });
  },

  getLearningContent: async (search?: string, categoryId?: number, page: number = 1, perPage: number = 10) => {
    let url = `${API_BASE_URL}/app_learning_hub_content_api/`;
    const params = new URLSearchParams();

    if (search && search.trim()) {
      params.append("search", search.trim());
    }
    if (categoryId !== undefined) {
      params.append("category", String(categoryId));
    }
    params.append("page", String(page));
    params.append("per_page", String(perPage));
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return apiCall(url, {
      method: "GET",
    });
  },

  getLearningContentById: async (contentId: number) => {
    return apiCall(`${API_BASE_URL}/app_learning_hub_content_api/${contentId}/`, {
      method: "GET",
    });
  },

  getCategoryBasedContent: async (categoryId: number) => {
    return apiCall(
      `${API_BASE_URL}/category_based_learning_content_api/?category_id=${categoryId}`,
      {
        method: "GET",
      }
    );
  },

  updateLearningContentStatus: async (contentId: number) => {
    return apiCall(
      `${API_BASE_URL}/learning_content_status_api/${contentId}/`,
      {
        method: "POST",
      }
    );
  },

  addLearningReaction: async (contentId: number, reactionType: string) => {
    return apiCall(`${API_BASE_URL}/learning_hub_reaction/`, {
      method: "POST",
      body: JSON.stringify({
        content: contentId,
        reaction: reactionType,
      }),
    });
  },

  getReactionCount: async (contentId: number) => {
    return apiCall(
      `${API_BASE_URL}/reaction_count_api/?learning_hub_content_id=${contentId}`,
      {
        method: "GET",
      }
    );
  },

  addComment: async (
    contentId: number,
    comment: string,
    parent?: number | null,
    tag?: number | null
  ) => {
    const payload: any = { content: contentId, comment };
    if (typeof parent === "number") payload.parent = parent;
    if (typeof tag === "number") payload.tag = tag;

    return apiCall(`${API_BASE_URL}/user_learning_hub_comment_api/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  likeComment: async (commentId: number) => {
    return apiCall(`${API_BASE_URL}/comment_like_api/`, {
      method: "POST",
      body: JSON.stringify({ comment: commentId }),
    });
  },

  toggleFavoriteLearningContent: async (contentId: number) => {
    return apiCall(`${API_BASE_URL}/favourite_learning_hub_content_api/`, {
      method: "POST",
      body: JSON.stringify({ content_id: contentId }),
    });
  },

  getSavedArticles: async (page: number, perPage: number) => {
    return apiCall(`${API_BASE_URL}/favourite_learning_hub_content_api/?page=${page}&per_page=${perPage}`, {
      method: "GET",
    });
  },

  postArticle: async (title: string, categories: number[], content: string) => {
    return apiCall(`${API_BASE_URL}/learning_hub_content_api/`, {
      method: "POST",
      body: JSON.stringify({
        title,
        categories,
        content,
      }),
    });
  },

  getUserArticles: async (page: number, perPage: number) => {
    return apiCall(`${API_BASE_URL}/user_learning_hub_content_api/?page=${page}&per_page=${perPage}`, {
      method: "GET",
    });
  },

  deleteArticle: async (contentId: number) => {
    return apiCall(
      `${API_BASE_URL}/delete_learning_hub_content_api/${contentId}/`,
      {
        method: "DELETE",
      }
    );
  },

  getComments: async (contentId: number) => {
    return apiCall(
      `${API_BASE_URL}/user_learning_hub_comment_api/?content_id=${contentId}`,
      {
        method: "GET",
      }
    );
  },

  deleteComment: async (commentId: number) => {
    return apiCall(`${API_BASE_URL}/comment_delete_api/${commentId}/`, {
      method: "DELETE",
    });
  },
};
