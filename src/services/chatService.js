import httpRequest from "../utils/httpRequest";
import axios from "axios";

const chatService = {
  getList: (data) => {
    return httpRequest.post("v2/invoke_function/lodify-chat-gateway", {data});
  },
  getUsersList: (data) => {
    return httpRequest.post("v2/invoke_function/lodify-drivers-gateway", {
      data,
    });
  },
  getChatRoomId: (id, projectId) => {
    return axios.get(
      `https://chat-service.u-code.io/v1/room/${id}?project_id=${projectId}`
    );
  },
};

export default chatService;
