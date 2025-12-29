import httpRequest from "../utils/httpRequest";

const notificationService = {
  getList: (params = {}) => {
    const dataParam = JSON.stringify(params);
    return httpRequest.get(
      `v2/items/user_notifications?data=${encodeURIComponent(dataParam)}`
    );
  },
};

export default notificationService;
