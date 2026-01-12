import httpRequest from "../utils/httpRequest";

const dashboardService = {
  getTripsCount: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", {data}),
  getPerformanceData: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", {data}),
  getSafetyData: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", {data}),
  getBrokerSafetyData: (data) =>
    httpRequest.post("v2/invoke_function/lodify-dashboard", {data}),
  getNationalAverage: () =>
    httpRequest.get("v2/invoke_function/lodify-dashboard"),
};

export default dashboardService;
