import httpRequest from "../utils/httpRequest";

const driversService = {
  getList: (params = {}) => {
    const dataParam = JSON.stringify(params);
    return httpRequest.get(
      `v2/items/drivers?data=${encodeURIComponent(dataParam)}`,
    );
  },
  addDrivercode: (data) =>
    httpRequest.post("v2/invoke_function/lodify-trip-gateway", data),
  getDriverById: (id) =>
    httpRequest.get(`v1/object-slim/drivers/${id}?from-ofs=true`),
  createDriver: (data) => httpRequest.post("v2/items/drivers", data),
  updateDriver: (id, data) => httpRequest.put("v2/items/drivers", data),
};

export default driversService;
