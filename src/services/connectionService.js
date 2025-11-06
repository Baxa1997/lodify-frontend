import requestAuthV2NoEnv from "../utils/requestConnection";

const connectionService = {
  getList: (params, headers) =>
    requestAuthV2NoEnv.get("v2/connection", {
      params: { limit: 10, offset: 0, ...params },
      headers,
    }),
};

export default connectionService;
