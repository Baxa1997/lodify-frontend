import {useEffect, useRef} from "react";
import {io} from "socket.io-client";

const SOCKET_URL = "https://chat-service.u-code.io";

export const useSocket = () => {
  const socketRef = useRef(null);

  if (!socketRef.current) {
    socketRef.current = io(SOCKET_URL, {
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

  const socket = socketRef.current;

  useEffect(() => {
    const s = socketRef.current;

    s.on("connect", () => {
      console.log("✅ Connected to socket:", s.id);
    });

    s.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
    });

    s.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    return () => {
      s.off("connect");
      s.off("disconnect");
      s.off("connect_error");
    };
  }, [socket]);

  return socket;
};
