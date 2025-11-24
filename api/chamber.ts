import { apiCall, API_BASE_URL } from "./utils";

// Chamber APIs
export const chamberApi = {
  getChamberModels: async () => {
    return apiCall(`${API_BASE_URL}/chamber_model_api/`, {
      method: "GET",
    });
  },

  // Get protocols and ATA levels based on chamber
  getProtocolsAtaByChamber: async (chamberId: number) => {
    const url = `${API_BASE_URL}/get_protocol_ata_basis_chamber_api/?chamber_id=${encodeURIComponent(
      chamberId
    )}`;
    return apiCall(url, {
      method: "GET",
    });
  },

  // Get list of chambers from the dynamic API (no chamber_id param)
  getChambersList: async ({page, perPage}: {page: number, perPage: number}) => {
    const url = `${API_BASE_URL}/get_protocol_ata_basis_chamber_api/?page=${page}&per_page=${perPage}`;
    return apiCall(url, {
      method: "GET",
    });
  },
};
