import httpRequest from "../utils/httpRequest";

const assetsService = {
  getList: (params = {}) => {
    const dataParam = JSON.stringify(params);
    return httpRequest.get(
      `v2/items/assets?data=${encodeURIComponent(dataParam)}`,
    );
  },
  getAssetById: (id) =>
    httpRequest.get(`v1/object-slim/assets/${id}?from-ofs=true`),
  createAsset: (data) => httpRequest.post("v2/items/assets", data),
  updateAsset: (id, data) => httpRequest.put(`v2/items/assets/${id}`, data),
  mapInovke: (data) =>
    httpRequest.post(
      "v2/invoke_function/lodify-gateway/assets/latest_status",
      data,
    ),
  getFuelTypes: () => httpRequest.get("v1/fuel-types"),
};

export default assetsService;
