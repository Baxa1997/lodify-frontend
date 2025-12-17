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
};

export default carrierService;
