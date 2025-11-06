import httpRequest from "../utils/httpRequest";

const tripsService = {
  getList: (data) => {
    return httpRequest.post("v2/invoke_function/lodify-trip-gateway", {data});
  },
  getPackageList: () => {
    return httpRequest.get("v2/items/lodify_fees");
  },
  getTripById: (data) =>
    httpRequest.post("v2/invoke_function/lodify-trip-gateway", {data}),
  getTripDetailsByTripId: (data) =>
    httpRequest.post("v2/invoke_function/lodify-trip-gateway", {data}),
  getTripDetails: (id) => {
    const dataParam = JSON.stringify({id});
    return httpRequest.get(
      `v2/items/orders/${id}?data=${encodeURIComponent(dataParam)}`
    );
  },
  createTrip: (data) =>
    httpRequest.post("v2/invoke_function/lodify-trip-gateway", data),
  updateTrip: (id, data) => httpRequest.put("v2/items/trips", data),
  getSelectOptions: (table_slug) => httpRequest.get(`v2/items/${table_slug}`),
  acceptTrip: (data) => httpRequest.put("v2/items/orders", data),
  rejectTrip: (data) => httpRequest.post("v2/items/rejected_trips", data),
  assignDriver: (data) => httpRequest.put("v2/items/orders", data),
};

export default tripsService;
