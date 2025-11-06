import {io} from "socket.io-client";

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io("https://chat-service.u-code.io", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      withCredentials: true,
    });
  }
  return socketInstance;
};

export const useSocket = () => {
  return getSocket();
};
