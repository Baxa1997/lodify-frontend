import React, {useState, useEffect, useMemo, useRef} from "react";
import {ChatProvider} from "../../context/ChatContext";
import ConversationList from "../ConversationList/ConversationList";
import ChatArea from "../ChatArea/ChatArea";
import styles from "./Chat.module.scss";
import {useSelector} from "react-redux";
import {useSocket, useSocketConnection} from "@context/SocketProvider";
import AddRoom from "../AddRoom";
import {useLocation} from "react-router-dom";

const dedupeRooms = (roomsArray = []) => {
  const map = new Map();
  roomsArray.forEach((room) => {
    if (room?.id) {
      map.set(room.id, room);
    }
  });
  return Array.from(map.values());
};

const MIN_ROOMS_LOADING_DURATION = 500;

const Chat = () => {
  const {state: locationState} = useLocation();
  const socket = useSocket();
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const {isConnected, connectionError} = useSocketConnection();
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const roomsLoadStartRef = useRef(null);
  const roomsLoadTimeoutRef = useRef(null);
  const [conversation, setConversation] = useState(null);
  const [presence, setPresence] = useState({});
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasProcessedTripId, setHasProcessedTripId] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [roomTypeFilter, setRoomTypeFilter] = useState("group");
  const loginName = useSelector((state) => state.auth.user_data?.login);
  const projectId = useSelector((state) => state.auth.projectId);

  const userId = useSelector((state) => state.auth.userInfo?.id);
  const loginUser = useSelector((state) => state.auth.user_data?.login);
  const tripId = locationState?.tripId;
  const tripName = locationState?.tripName;
  useEffect(() => {
    setHasProcessedTripId(false);
  }, [tripId]);

  useEffect(() => {
    if (!socket || !userId || !isConnected) return;
    socket.emit("presence:ping", {row_id: userId, project_id: projectId});

    const pingInterval = setInterval(() => {
      if (socket && socket.connected) {
        socket.emit("presence:ping", {row_id: userId, project_id: projectId});
      }
    }, 10000);

    const handleBeforeUnload = () => {
      clearInterval(pingInterval);
      if (socket && socket.connected) {
        socket.emit("disconnected", {
          row_id: userId,
          project_id: projectId,
        });
      }
    };

    const cleanup = () => {
      clearInterval(pingInterval);
      if (socket && socket.connected) {
        socket.emit("disconnected", {
          row_id: userId,
          project_id: projectId,
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const handleSocketDisconnect = (reason) => {
      console.log("🔴 Socket disconnected:", reason);
    };

    socket.on("disconnect", handleSocketDisconnect);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off("disconnect", handleSocketDisconnect);
      cleanup();
    };
  }, [socket, userId, isConnected, projectId]);

  const beginRoomsLoading = () => {
    roomsLoadStartRef.current = Date.now();
    setRoomsLoading(true);
    if (roomsLoadTimeoutRef.current) {
      clearTimeout(roomsLoadTimeoutRef.current);
      roomsLoadTimeoutRef.current = null;
    }
  };

  const completeRoomsLoading = () => {
    const startTime = roomsLoadStartRef.current;
    const elapsed = startTime
      ? Date.now() - startTime
      : MIN_ROOMS_LOADING_DURATION;
    const remaining = Math.max(MIN_ROOMS_LOADING_DURATION - elapsed, 0);

    if (roomsLoadTimeoutRef.current) {
      clearTimeout(roomsLoadTimeoutRef.current);
      roomsLoadTimeoutRef.current = null;
    }

    if (remaining === 0) {
      setRoomsLoading(false);
      roomsLoadStartRef.current = null;
    } else {
      roomsLoadTimeoutRef.current = setTimeout(() => {
        setRoomsLoading(false);
        roomsLoadTimeoutRef.current = null;
        roomsLoadStartRef.current = null;
      }, remaining);
    }
  };

  useEffect(() => {
    if (!socket || !isConnected || !userId) return;

    beginRoomsLoading();

    socket.emit("rooms list", {
      row_id: userId,
      project_id: projectId,
      type: roomTypeFilter,
    });

    const handleRoomsList = (data) => {
      const roomsData = Array.isArray(data) ? data : [];
      setRooms((prevRooms) => {
        const sanitizedRooms = dedupeRooms(roomsData);
        if (!roomTypeFilter) {
          return sanitizedRooms;
        }

        const otherRooms = prevRooms.filter(
          (room) => room.type !== roomTypeFilter
        );

        const mergedRooms = dedupeRooms([...sanitizedRooms, ...otherRooms]);

        if (conversation?.id) {
          return mergedRooms.map((room) => {
            if (room.id === conversation.id) {
              return {
                ...room,
                unread_message_count: 0,
              };
            }
            return room;
          });
        }

        return mergedRooms;
      });
      completeRoomsLoading();
    };

    const handleError = (error) => {
      console.error("Socket error received:", error);
      completeRoomsLoading();
    };

    const handleMessageSent = (data) => {
      console.log("Message sent confirmation:", data);
    };

    socket.on("rooms list", handleRoomsList);
    socket.on("error", handleError);
    socket.on("message sent", handleMessageSent);

    return () => {
      socket.off("rooms list", handleRoomsList);
      socket.off("error", handleError);
      socket.off("message sent", handleMessageSent);
      if (roomsLoadTimeoutRef.current) {
        clearTimeout(roomsLoadTimeoutRef.current);
        roomsLoadTimeoutRef.current = null;
      }
    };
  }, [
    socket,
    isConnected,
    userId,
    projectId,
    roomTypeFilter,
    conversation?.id,
  ]);

  const handleTabChange = (type) => {
    setRoomTypeFilter(type);
  };

  const filteredRooms = useMemo(() => {
    if (!roomTypeFilter) {
      return rooms;
    }
    return rooms.filter((room) => room.type === roomTypeFilter);
  }, [rooms, roomTypeFilter]);

  useEffect(() => {
    const existingRoom = rooms.find((room) => room.item_id === tripId);

    if (Boolean(existingRoom?.id)) {
      setConversation(existingRoom);
      setHasProcessedTripId(true);
    } else if (
      Boolean(tripId && tripName) &&
      Boolean(socket) &&
      Boolean(!conversation?.id)
    ) {
      setIsInitializing(true);
      setHasProcessedTripId(true);

      socket.emit(
        "create room",
        {
          name: "",
          type: "group",
          row_id: userId,
          item_id: tripId,
          from_name: loginName,
          project_id: projectId,
          to_name: tripName,
        },
        (response) => {
          if (response && response.room) {
            setConversation(response.room);
            setRooms((prevRooms) => [...prevRooms, response.room]);
            setIsInitializing(false);
          } else if (response && response.error) {
            console.error("Error creating room:", response.error);
            setIsInitializing(false);
          }
        }
      );
    } else {
      setIsInitializing(false);
      setConversation(existingRoom);
    }
  }, [
    rooms.length,
    socket,
    userId,
    isInitializing,
    loginName,
    projectId,
    hasProcessedTripId,
  ]);

  const sendMessage = (content, type = "text", fileInfo = null) => {
    if (!conversation?.id || !loginUser) {
      return;
    }
    if (!isConnected) {
      return;
    }

    const messageData = {
      room_id: conversation.id,
      content: content,
      from: loginUser,
      type: type,
      author_row_id: userId,
      project_id: projectId,
      file: fileInfo?.url || "",
    };

    if (replyingTo) {
      messageData.parent_id = replyingTo.id || replyingTo._id;
    }

    socket.emit("chat message", messageData, (response) => {
      if (response && response.error) {
        console.error("❌ Server error response:", response.error);
      } else {
        console.log("✅ Server success response:", response);

        setReplyingTo(null);
      }
    });
  };

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleConversationSelect = (selectedConversation) => {
    setConversation(selectedConversation);
    if (selectedConversation && selectedConversation.id) {
      setRooms((prevRooms) => {
        const roomIndex = prevRooms.findIndex(
          (room) => room.id === selectedConversation.id
        );
        if (roomIndex !== -1) {
          const updatedRooms = [...prevRooms];
          updatedRooms[roomIndex] = {
            ...updatedRooms[roomIndex],
          };
          return updatedRooms;
        }
        return prevRooms;
      });
    }
  };

  useEffect(() => {
    if (!socket || !conversation?.id || !userId || !isConnected) {
      return;
    }

    const sendMessageRead = () => {
      if (socket && socket.connected && conversation?.id && userId) {
        socket.emit("message:read", {
          row_id: userId,
          room_id: conversation.id,
        });
      }
    };

    sendMessageRead();

    const messageReadInterval = setInterval(() => {
      sendMessageRead();
    }, 1000);

    return () => {
      clearInterval(messageReadInterval);
    };
  }, [socket, conversation?.id, userId, isConnected]);

  useEffect(() => {
    if (!socket) return;

    socket.on("presence.updated", (response) => {
      if (response && response.row_id) {
        setPresence((prevPresence) => ({
          ...prevPresence,
          [response.row_id]: {
            status: response.status,
            last_seen_at: response.last_seen_at,
            updated_at: response.updated_at || new Date().toISOString(),
          },
        }));
      } else if (Array.isArray(response)) {
        setPresence((prevPresence) => {
          const updatedPresence = {...prevPresence};
          response.forEach((presenceUpdate) => {
            if (presenceUpdate.row_id) {
              updatedPresence[presenceUpdate.row_id] = {
                status: presenceUpdate.status,
                last_seen_at: presenceUpdate.last_seen_at,
                updated_at:
                  presenceUpdate.updated_at || new Date().toISOString(),
              };
            }
          });
          return updatedPresence;
        });
      } else if (response && typeof response === "object") {
        setPresence((prevPresence) => {
          const updatedPresence = {...prevPresence};
          Object.keys(response).forEach((userId) => {
            const presenceData = response[userId];
            updatedPresence[userId] = {
              status: presenceData.status,
              last_seen_at: presenceData.last_seen_at,
              updated_at: presenceData.updated_at || new Date().toISOString(),
            };
          });
          return updatedPresence;
        });
      }
    });

    return () => {
      socket.off("presence.updated");
    };
  }, [socket, conversation?.id]);

  useEffect(() => {
    if (Boolean(tripId)) {
      setRoomTypeFilter("group");
    } else {
      setRoomTypeFilter("single");
    }
  }, []);

  return (
    <ChatProvider>
      <div className={styles.chatContainer}>
        <ConversationList
          setIsAddRoomOpen={setIsAddRoomOpen}
          rooms={filteredRooms}
          setConversation={handleConversationSelect}
          isConnected={isConnected}
          onTabChange={handleTabChange}
          isLoading={roomsLoading}
        />
        <ChatArea
          rooms={rooms}
          setIsAddRoomOpen={setIsAddRoomOpen}
          conversation={conversation}
          onSendMessage={sendMessage}
          isConnected={isConnected}
          isInitializing={isInitializing}
          tripId={tripId}
          presence={presence}
          setConversation={setConversation}
          onReply={handleReply}
          replyingTo={replyingTo}
          onCancelReply={handleCancelReply}
        />

        <AddRoom
          isOpen={isAddRoomOpen}
          onClose={() => setIsAddRoomOpen(false)}
          text="Add Chat"
        />
      </div>
    </ChatProvider>
  );
};

export default Chat;
