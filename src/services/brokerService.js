import httpRequest from "../utils/httpRequest";

const brokerService = {
  getAllBrokers: (params = {}) => {
    const dataParam = JSON.stringify(params);
    return httpRequest.get(
      `v2/items/broker_carriers?data=${encodeURIComponent(dataParam)}`
    );
  },
  getCarrierReviews: (data) =>
    httpRequest.post("v2/invoke_function/lodify-drivers-gateway", data),
};

export default brokerService;
