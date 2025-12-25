import httpRequest from "../utils/httpRequest";

const carrierService = {
  addCarrier: (data) => {
    return httpRequest.post(`v2/items/broker_carriers`, {data});
  },
  getCarrierInfo: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", data),

  getPerformanceData: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", data),

  getAuthorityData: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", data),

  getVirtualAddress: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", data),

  getEquipmentData: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", data),

  getInspectionsData: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", data),

  getMatchedData: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", data),

  assessmentData: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", data),

  getSafetyData: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", data),

  getCarrierAudit: (params = {}) => {
    const dataParam = JSON.stringify(params);
    return httpRequest.get(
      `v2/items/companies_audit?data=${encodeURIComponent(dataParam)}`
    );
  },

  // Carrier Setup

  getCarrierSetupData: (id) =>
    httpRequest.get(`v1/object-slim/companies/${id}`),

  addAgent: (data) => httpRequest.post("v1/object-slim/companies", data),
};

export default carrierService;
