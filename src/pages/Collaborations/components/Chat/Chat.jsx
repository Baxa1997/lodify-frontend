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
  const [roomTypeFilter, setRoomTypeFilter] = useState("single");
  const ignoreRoomsListRef = useRef(false);
  const roomsListIgnoreTimeoutRef = useRef(null);
  const loginName = useSelector((state) => state.auth.user_data?.login);
  const projectId = useSelector((state) => state.auth.projectId);

  const userId = useSelector((state) => state.auth.userInfo?.id);
  const loginUser = useSelector((state) => state.auth.user_data?.login);
  const tripId = locationState?.tripId;
  const tripName = locationState?.tripName;

  const conversationRef = useRef(conversation);
  const tripIdRef = useRef(tripId);
  const hasProcessedTripIdRef = useRef(hasProcessedTripId);
  const roomTypeFilterRef = useRef(roomTypeFilter);
  const loggedInUserRef = useRef(loginUser);
  const roomsRef = useRef(rooms);
  const shouldAutoEnterTripRoomRef = useRef(true);

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
    roomTypeFilterRef.current = roomTypeFilter;
  }, [roomTypeFilter]);

  useEffect(() => {
    loggedInUserRef.current = loginUser;
  }, [loginUser]);

  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);

  useEffect(() => {
    setHasProcessedTripId(false);
    shouldAutoEnterTripRoomRef.current = true; // Reset auto-enter flag when tripId changes
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
    if (!socket) return;

    const handleRoomsList = (data) => {
      const roomsData = Array.isArray(data) ? data : [];

      if (ignoreRoomsListRef.current && roomsData.length > 0) {
        const currentRooms = roomsRef.current;
        const existingRoomIds = new Set(currentRooms.map((r) => r.id));
        const hasNewRooms = roomsData.some(
          (room) => room.id && !existingRoomIds.has(room.id)
        );

        if (!hasNewRooms) {
          return;
        }
      } else if (ignoreRoomsListRef.current) {
        return;
      }
      const currentConversation = conversationRef.current;
      const currentRoomTypeFilter = roomTypeFilterRef.current;

      setRooms((prevRooms) => {
        if (roomsData.length === 0 && prevRooms.length > 0) {
          return prevRooms;
        }

        const sanitizedRooms = dedupeRooms(roomsData);

        if (!currentRoomTypeFilter) {
          return sanitizedRooms.length > 0 ? sanitizedRooms : prevRooms;
        }

        const existingRoomsMap = new Map(
          prevRooms.map((room) => [room.id, room])
        );

        sanitizedRooms.forEach((newRoom) => {
          existingRoomsMap.set(newRoom.id, newRoom);
        });

        const allRooms = dedupeRooms(Array.from(existingRoomsMap.values()));

        const otherRooms = allRooms.filter(
          (room) => room.type !== currentRoomTypeFilter
        );
        const filteredRooms = allRooms.filter(
          (room) => room.type === currentRoomTypeFilter
        );

        const mergedRooms = dedupeRooms([...filteredRooms, ...otherRooms]);

        if (mergedRooms.length === 0 && prevRooms.length > 0) {
          return prevRooms;
        }

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
      completeRoomsLoading();
    };

    const handleError = (error) => {
      console.error("Socket error received:", error);
      completeRoomsLoading();
    };

    const handleMessageSent = (data) => {
      console.log("Message sent confirmation:", data);
    };

    const handleReceiveMessage = (message) => {
      if (message && message.room_id) {
        const currentConversation = conversationRef.current;
        const currentLoggedInUser = loggedInUserRef.current;

        if (message.from !== currentLoggedInUser) {
          setRooms((prevRooms) => {
            const roomExists = prevRooms.some(
              (room) => room.id === message.room_id
            );

            if (roomExists) {
              return prevRooms.map((room) => {
                if (room.id === message.room_id) {
                  if (message.room_id !== currentConversation?.id) {
                    return {
                      ...room,
                      unread_message_count:
                        (room.unread_message_count || 0) + 1,
                    };
                  }
                }
                return room;
              });
            }

            return prevRooms;
          });
        }
      }
    };

    socket.on("rooms list", handleRoomsList);
    socket.on("error", handleError);
    socket.on("message sent", handleMessageSent);
    socket.on("chat message", handleReceiveMessage);

    return () => {
      socket.off("rooms list", handleRoomsList);
      socket.off("error", handleError);
      socket.off("message sent", handleMessageSent);
      socket.off("chat message", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !isConnected || !userId) return;

    beginRoomsLoading();

    const typeToEmit = roomTypeFilter || "single";

    socket.emit("rooms list", {
      row_id: userId,
      project_id: projectId,
      type: typeToEmit,
    });

    return () => {
      if (roomsLoadTimeoutRef.current) {
        clearTimeout(roomsLoadTimeoutRef.current);
        roomsLoadTimeoutRef.current = null;
      }
    };
  }, [socket, isConnected, userId, projectId, roomTypeFilter]);

  const handleTabChange = (type) => {
    setRoomTypeFilter(type);
    shouldAutoEnterTripRoomRef.current = false;
  };

  const filteredRooms = useMemo(() => {
    if (!roomTypeFilter) {
      return rooms;
    }
    return rooms.filter((room) => room.type === roomTypeFilter);
  }, [rooms, roomTypeFilter]);

  useEffect(() => {
    if (!tripId || !tripName || !socket || !isConnected || !userId) {
      return;
    }

    if (!shouldAutoEnterTripRoomRef.current) {
      setHasProcessedTripId(true);
      setIsInitializing(false);
      return;
    }

    const existingRoom = rooms.find((room) => room.item_id === tripId);

    if (existingRoom?.id) {
      setConversation(existingRoom);
      setHasProcessedTripId(true);
      setIsInitializing(false);
    } else {
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
          attributes: {
            broker: locationState?.broker,
            carrier: locationState?.carrier,
          },
        },
        (response) => {
          if (response && response.room) {
            const newRoom = response.room;
            setConversation(newRoom);
            setRooms((prevRooms) => {
              const exists = prevRooms.some((r) => r.id === newRoom.id);
              if (exists) {
                return prevRooms;
              }
              return [...prevRooms, newRoom];
            });
            setIsInitializing(false);

            setTimeout(() => {
              if (socket && isConnected && userId) {
                socket.emit("rooms list", {
                  row_id: userId,
                  project_id: projectId,
                  type: "group",
                });
              }
            }, 300);
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
    }
  }, [
    tripId,
    tripName,
    rooms,
    socket,
    isConnected,
    userId,
    loginName,
    projectId,
    locationState,
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
    setConversation(selectedConversation);

    if (selectedConversation && tripId) {
      const isTripRoom = selectedConversation.item_id === tripId;
      if (!isTripRoom) {
        shouldAutoEnterTripRoomRef.current = false;
      }
    }

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
    if (tripId) {
      setRoomTypeFilter("group");
    }
  }, [tripId]);

  useEffect(() => {
    return () => {
      if (roomsListIgnoreTimeoutRef.current) {
        clearTimeout(roomsListIgnoreTimeoutRef.current);
      }
      if (roomsLoadTimeoutRef.current) {
        clearTimeout(roomsLoadTimeoutRef.current);
      }
    };
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
