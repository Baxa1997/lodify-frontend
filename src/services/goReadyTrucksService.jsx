import httpRequest from "../utils/httpRequest";

const goReadyTrucksService = {
  getTrucks: (data) =>
    httpRequest.post(`v2/invoke_function/lodify-drivers-gateway`, {data}),
};

export default goReadyTrucksService;
