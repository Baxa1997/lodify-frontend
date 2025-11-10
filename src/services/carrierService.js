import httpRequest from "../utils/httpRequest";

const carrierService = {
  addCarrier: (data) => {
    return httpRequest.post(`v2/items/broker_carriers`, {data});
  },
};

export default carrierService;
