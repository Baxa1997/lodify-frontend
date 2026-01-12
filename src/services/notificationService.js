import httpRequest from "../utils/httpRequest";

const notificationService = {
  getList: (params = {}) => {
    const dataParam = JSON.stringify(params);
    return httpRequest.get(
      `v2/items/user_notifications?data=${encodeURIComponent(dataParam)}`
    );
  },
  markAsRead: (guid) => {
    return httpRequest.put("v2/items/user_notifications", {
      data: {
        is_read: true,
        guid: guid,
      },
    });
  },
  markAllAsRead: (clientType) => {
    return httpRequest.post("v2/invoke_function/lodify-drivers-gateway", {
      data: {
        method: "read_all",
        object_data: {
          client_type: clientType,
        },
        table: "notifications",
      },
    });
  },
  getUnreadCount: (clientType) => {
    return httpRequest.post("v2/invoke_function/lodify-drivers-gateway", {
      data: {
        method: "count",
        object_data: {
          client_type: clientType,
        },
        table: "notifications",
      },
    });
  },

  getNotificationList: (data) => {
    return httpRequest.post(`v2/invoke_function/lodify-integrations`, data);
  },
};

export default notificationService;
