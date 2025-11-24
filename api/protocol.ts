import { apiCall, API_BASE_URL } from "./utils";

// Protocol APIs
export const protocolApi = {
  getProtocols: async () => {
    return apiCall(`${API_BASE_URL}/protocol_api/`, {
      method: "GET",
    });
  },

  getSuggestedProtocols: async () => {
    return apiCall(`${API_BASE_URL}/suggested_protocol_api/`, {
      method: "GET",
    });
  },

  getSuggestedProtocolsFiltered: async (
    protocolCategoryId?: number,
    search?: string,
    page: number = 1,
    perPage: number = 10
  ) => {
    const params = new URLSearchParams();
    if (protocolCategoryId !== undefined) {
      params.set("protocol_category", String(protocolCategoryId));
    }
    if (search && search.trim()) {
      params.set("search", search.trim());
    }
    params.set("page", String(page));
    params.set("per_page", String(perPage));
    const url = params.toString()
      ? `${API_BASE_URL}/suggested_protocol_api/?${params.toString()}`
      : `${API_BASE_URL}/suggested_protocol_api/`;
    return apiCall(url, {
      method: "GET",
    });
  },

  getFavoriteProtocols: async ({page, perPage}: {page: number, perPage: number}) => {
    return apiCall(`${API_BASE_URL}/favourite_protocol_api/?page=${page}&per_page=${perPage}`, {
      method: "GET",
    });
  },

  addFavoriteProtocol: async (protocolId: number) => {
    return apiCall(`${API_BASE_URL}/favourite_protocol_api/`, {
      method: "POST",
      body: JSON.stringify({ protocol_id: protocolId }),
    });
  },

  toggleFavoriteProtocol: async (protocolId: number) => {
    return apiCall(`${API_BASE_URL}/favourite_protocol_api/`, {
      method: "POST",
      body: JSON.stringify({ protocol_id: protocolId }),
    });
  },

  getProtocolCategories: async () => {
    return apiCall(`${API_BASE_URL}/protocol_category_api/`, {
      method: "GET",
    });
  },

  getProtocolCategoryList: async () => {
    return apiCall(`${API_BASE_URL}/protocol_category_list/`, {
      method: "GET",
    });
  },

  // User's session protocols for analytics filter
  getUserSessionProtocols: async () => {
    return apiCall(`${API_BASE_URL}/get_user_session_protocol_api/`, {
      method: "GET",
    });
  },

  // User's session ATA levels for analytics filter
  getUserSessionAtaLevels: async () => {
    return apiCall(`${API_BASE_URL}/get_user_session_ata_level_api/`, {
      method: "GET",
    });
  },
};
