import httpRequest from "../utils/httpRequest";

const chatService = {
  getList: (data) => {
    return httpRequest.post("v2/invoke_function/lodify-chat-gateway", {data});
  },
  getUsersList: (data) => {
    return httpRequest.post("v2/invoke_function/lodify-drivers-gateway", {
      data,
    });
  },
  getChatRoomId: (id) => {
    return httpRequest.get(`v1/room/${id}`);
  },
};

export default chatService;
