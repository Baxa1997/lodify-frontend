import React, {useState, useEffect, useMemo, useRef, useCallback} from "react";
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

const Chat = () => {
  const {state: locationState} = useLocation();
  const socket = useSocket();
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const {isConnected, connectionError} = useSocketConnection();
  const [rooms, setRooms] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [presence, setPresence] = useState({});
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasProcessedTripId, setHasProcessedTripId] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [roomTypeFilter, setRoomTypeFilter] = useState("group");
  const lastRequestedRoomsTypeRef = useRef(null);
  const ignoreRoomsListRef = useRef(false);
  const roomsListIgnoreTimeoutRef = useRef(null);
  const expectingRoomsListRef = useRef(false);
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
    return () => {
      if (roomsListIgnoreTimeoutRef.current) {
        clearTimeout(roomsListIgnoreTimeoutRef.current);
      }
    };
  }, []);

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

  const emitRoomsList = useCallback(
    (typeOverride = null) => {
      if (!socket || !isConnected || !userId) {
        return;
      }
      const effectiveType = typeOverride ?? roomTypeFilter ?? undefined;
      ignoreRoomsListRef.current = false;
      if (roomsListIgnoreTimeoutRef.current) {
        clearTimeout(roomsListIgnoreTimeoutRef.current);
        roomsListIgnoreTimeoutRef.current = null;
      }
      expectingRoomsListRef.current = true;
      lastRequestedRoomsTypeRef.current = effectiveType;
      socket.emit("rooms list", {
        row_id: userId,
        project_id: projectId,
        type: effectiveType,
      });
    },
    [socket, isConnected, userId, projectId, roomTypeFilter]
  );

  const createTripRoom = useCallback(() => {
    if (
      !tripId ||
      !tripName ||
      !socket ||
      !userId ||
      !isConnected ||
      isInitializing
    ) {
      return;
    }

    setIsInitializing(true);

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
        attributes: {
          broker: locationState?.broker,
          carrier: locationState?.carrier,
        },
      },
      (response) => {
        if (response && response.room) {
          setConversation(response.room);
          setRooms((prevRooms) => [...prevRooms, response.room]);
          setHasProcessedTripId(true);
          setIsInitializing(false);
          // Fetch updated rooms list after creating room to ensure it's in the list
          emitRoomsList("group");
        } else if (response && response.error) {
          console.error("Error creating room:", response.error);
          setIsInitializing(false);
          setHasProcessedTripId(false);
        } else {
          setIsInitializing(false);
          setHasProcessedTripId(false);
        }
      }
    );
  }, [
    tripId,
    tripName,
    socket,
    userId,
    isConnected,
    isInitializing,
    loginName,
    projectId,
    locationState,
    emitRoomsList,
  ]);

  // Refs to avoid stale closures
  const conversationRef = useRef(conversation);
  const tripIdRef = useRef(tripId);
  const hasProcessedTripIdRef = useRef(hasProcessedTripId);
  const isInitializingRef = useRef(isInitializing);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  useEffect(() => {
    tripIdRef.current = tripId;
  }, [tripId]);

  useEffect(() => {
    hasProcessedTripIdRef.current = hasProcessedTripId;
  }, [hasProcessedTripId]);

  useEffect(() => {
    isInitializingRef.current = isInitializing;
  }, [isInitializing]);

  useEffect(() => {
    if (!socket || !isConnected || !userId) return;

    emitRoomsList();

    const handleRoomsList = (data) => {
      // Only process rooms list events that we explicitly requested
      // Ignore unsolicited updates (e.g., those emitted after receiving messages)
      if (!expectingRoomsListRef.current) {
        return;
      }
      expectingRoomsListRef.current = false;

      // Also respect the ignore flag from message sending
      if (ignoreRoomsListRef.current) {
        return;
      }

      const roomsData = Array.isArray(data) ? data : [];
      const currentConversation = conversationRef.current;
      const currentRoomTypeFilter = roomTypeFilter;

      setRooms((prevRooms) => {
        const sanitizedRooms = dedupeRooms(roomsData);
        if (!currentRoomTypeFilter) {
          return sanitizedRooms;
        }

        const otherRooms = prevRooms.filter(
          (room) => room.type !== currentRoomTypeFilter
        );

        const mergedRooms = dedupeRooms([...sanitizedRooms, ...otherRooms]);

        if (currentConversation?.id) {
          return mergedRooms.map((room) => {
            if (room.id === currentConversation.id) {
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

      const currentType = lastRequestedRoomsTypeRef.current;
      const currentTripId = tripIdRef.current;
      const currentHasProcessedTripId = hasProcessedTripIdRef.current;
      const currentIsInitializing = isInitializingRef.current;

      if (
        currentTripId &&
        currentType === "group" &&
        socket &&
        isConnected &&
        userId
      ) {
        const existingTripRoom = roomsData.find(
          (room) => room.item_id === currentTripId
        );

        if (existingTripRoom?.id) {
          setConversation(existingTripRoom);
          setHasProcessedTripId(true);
          setIsInitializing(false);
        } else if (!currentHasProcessedTripId && !currentIsInitializing) {
          createTripRoom();
        }
      }
    };

    const handleError = (error) => {
      console.error("Socket error received:", error);
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
    };
  }, [
    socket,
    isConnected,
    userId,
    projectId,
    roomTypeFilter,
    emitRoomsList,
    createTripRoom,
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
    if (!tripId || hasProcessedTripId) {
      return;
    }

    const existingRoom = rooms.find((room) => room.item_id === tripId);

    if (existingRoom?.id) {
      setConversation(existingRoom);
      setHasProcessedTripId(true);
      setIsInitializing(false);
    }
  }, [tripId, rooms, hasProcessedTripId]);

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

    if (roomsListIgnoreTimeoutRef.current) {
      clearTimeout(roomsListIgnoreTimeoutRef.current);
    }
    ignoreRoomsListRef.current = true;
    roomsListIgnoreTimeoutRef.current = setTimeout(() => {
      ignoreRoomsListRef.current = false;
      roomsListIgnoreTimeoutRef.current = null;
    }, 1500);

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
    if (!selectedConversation || !selectedConversation.id) {
      return;
    }

    // Set the conversation - this will trigger MessagesList to load messages
    setConversation(selectedConversation);

    // Update rooms list to mark this room as read
    setRooms((prevRooms) => {
      const roomIndex = prevRooms.findIndex(
        (room) => room.id === selectedConversation.id
      );
      if (roomIndex !== -1) {
        const updatedRooms = [...prevRooms];
        updatedRooms[roomIndex] = {
          ...updatedRooms[roomIndex],
          unread_message_count: 0,
        };
        return updatedRooms;
      }
      return prevRooms;
    });
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
  }, [tripId]);

  useEffect(() => {
    if (!tripId || !socket || !isConnected || !userId) {
      return;
    }
    emitRoomsList("group");
  }, [tripId, socket, isConnected, userId, projectId, emitRoomsList]);

  return (
    <ChatProvider>
      <div className={styles.chatContainer}>
        <ConversationList
          setIsAddRoomOpen={setIsAddRoomOpen}
          rooms={filteredRooms}
          setConversation={handleConversationSelect}
          isConnected={isConnected}
          onTabChange={handleTabChange}
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
