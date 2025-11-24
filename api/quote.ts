import { apiCall, API_BASE_URL } from "./utils";

// Quote APIs
export const quoteApi = {
  getQuote: async (date?: string) => {
    const url = date
      ? `${API_BASE_URL}/get_quote_api/?created_date=${date}`
      : `${API_BASE_URL}/get_quote_api/`;
    return apiCall(url, {
      method: "GET",
    });
  },
};
