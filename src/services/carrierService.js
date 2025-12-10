import httpRequest from "../utils/httpRequest";

const carrierService = {
  addCarrier: (data) => {
    return httpRequest.post(`v2/items/broker_carriers`, {data});
  },
  getCarrierInfo: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", data),
};

export default carrierService;
