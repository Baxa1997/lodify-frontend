import React, {useState, useEffect, useRef, useCallback, useMemo} from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  InputGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import {MdReply, MdMoreVert} from "react-icons/md";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useSocket, useSocketConnection} from "@context/SocketProvider";
import TextMessage from "../../../Collaborations/components/MessageBubble/TextMessage";
import chatService from "@services/chatService";
import styles from "./ChatMessage.module.scss";
import {IoIosMore} from "react-icons/io";

function ChatMessage({tripId: propTripId, tripName: propTripName}) {
  const {id} = useParams();
  const tripId = propTripId || id;
  const tripName = propTripName || `Trip ${tripId || ""}`;
  const socket = useSocket();
  const {isConnected} = useSocketConnection();
  const userId = useSelector((state) => state.auth.userInfo?.id);
  const projectId = useSelector((state) => state.auth.projectId);
  const loginUser = useSelector((state) => state.auth.user_data?.login);
  const loginName = useSelector((state) => state.auth.user_data?.login);

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [presence, setPresence] = useState({});
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [hasProcessedTripId, setHasProcessedTripId] = useState(false);
  const [roomIdFromApi, setRoomIdFromApi] = useState(null);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({behavior});
    });
  }, []);

  useEffect(() => {
    setHasProcessedTripId(false);
    setRoomIdFromApi(null);
    setConversation(null);
    setMessages([]);
  }, [tripId]);

  // Get roomId from API first
  const {
    data: roomData,
    isLoading: isLoadingRoom,
    isError: isRoomError,
  } = useQuery({
    queryKey: ["chatRoomId", tripId],
    queryFn: () => chatService.getChatRoomId(tripId),
    enabled: !!tripId && !!isConnected,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });

  // Extract roomId from API response
  useEffect(() => {
    if (roomData?.data) {
      const roomId =
        roomData.data?.id ||
        roomData.data?.room_id ||
        roomData.data?.response?.id;
      if (roomId) {
        setRoomIdFromApi(roomId);
      } else {
        setRoomIdFromApi(null);
      }
    } else if (isRoomError || (!isLoadingRoom && !roomData)) {
      setRoomIdFromApi(null);
    }
  }, [roomData, isRoomError, isLoadingRoom]);

  // Handle room creation or joining based on API response
  useEffect(() => {
    if (!socket || !isConnected || !userId || !tripId || isLoadingRoom) return;
    if (hasProcessedTripId) return; // Already processed

    // If we got roomId from API, use it
    if (roomIdFromApi) {
      setIsInitializing(true);
      setHasProcessedTripId(true);

      // Get room details from rooms list
      socket.emit("rooms list", {row_id: userId, project_id: projectId});

      const handleRoomsList = (data) => {
        const roomsData = data || [];
        const existingRoom = roomsData.find(
          (room) => room.id === roomIdFromApi || room.item_id === tripId
        );

        if (existingRoom?.id) {
          setConversation(existingRoom);
          setIsInitializing(false);
        } else {
          // Room exists but not in our list, create conversation object
          setConversation({
            id: roomIdFromApi,
            item_id: tripId,
            to_name: tripName || `Trip ${tripId}`,
          });
          setIsInitializing(false);
        }
      };

      socket.on("rooms list", handleRoomsList);

      return () => {
        socket.off("rooms list", handleRoomsList);
      };
    } else if (
      roomIdFromApi === null &&
      !isLoadingRoom &&
      tripId &&
      tripName &&
      !conversation?.id
    ) {
      // No roomId from API, create a new room
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
          to_name: tripName || `Trip ${tripId}`,
        },
        (response) => {
          if (response && response.room) {
            setConversation(response.room);
            setIsInitializing(false);
          } else if (response && response.error) {
            console.error("Error creating room:", response.error);
            setIsInitializing(false);
          }
        }
      );
    }
  }, [
    socket,
    isConnected,
    userId,
    tripId,
    tripName,
    conversation?.id,
    hasProcessedTripId,
    loginName,
    projectId,
    roomIdFromApi,
    isLoadingRoom,
    isRoomError,
  ]);

  useEffect(() => {
    if (!socket || !conversation?.id || !userId) return;

    setMessages([]);

    socket.emit("join room", {
      room_id: conversation.id,
      row_id: userId,
      limit: 50,
      offset: 0,
    });

    socket.emit("presence:get", {
      row_id: conversation.to_row_id,
      project_id: projectId,
    });
  }, [socket, conversation?.id, userId, projectId]);

  useEffect(() => {
    if (!socket) return;

    const handleRoomHistory = (messagesData) => {
      const messagesToSet = Array.isArray(messagesData)
        ? messagesData
        : messagesData?.data && Array.isArray(messagesData.data)
        ? messagesData.data
        : [];

      if (messagesToSet.length > 0) {
        setMessages(messagesToSet);
        setTimeout(() => scrollToBottom("auto"), 100);
      }
    };

    const handleReceiveMessage = (message) => {
      if (message.room_id === conversation?.id) {
        setMessages((prevMessages) => {
          const existingMessage = prevMessages.find(
            (msg) => (msg.id || msg._id) === (message.id || message._id)
          );
          if (existingMessage) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });

        if (
          socket &&
          socket.connected &&
          userId &&
          message.from !== loginUser
        ) {
          socket.emit("message:read", {
            row_id: userId,
            room_id: conversation.id,
            project_id: projectId,
          });
        }
      }
    };

    socket.on("room history", handleRoomHistory);
    socket.on("chat message", handleReceiveMessage);

    return () => {
      socket.off("room history", handleRoomHistory);
      socket.off("chat message", handleReceiveMessage);
    };
  }, [socket, conversation?.id, userId, loginUser, projectId, scrollToBottom]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom("smooth");
    }
  }, [messages.length, scrollToBottom]);

  useEffect(() => {
    if (!socket || !conversation?.id || !userId || !isConnected) return;

    const sendMessageRead = () => {
      if (socket && socket.connected && conversation?.id && userId) {
        socket.emit("message:read", {
          row_id: userId,
          room_id: conversation.id,
        });
      }
    };

    sendMessageRead();
    const messageReadInterval = setInterval(sendMessageRead, 30000);

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
      }
    });

    return () => {
      socket.off("presence.updated");
    };
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!conversation?.id || !loginUser || !message.trim() || !isConnected) {
      return;
    }

    const messageData = {
      room_id: conversation.id,
      content: message.trim(),
      from: loginUser,
      type: "text",
      author_row_id: userId,
      project_id: projectId,
      file: "",
    };

    socket.emit("chat message", messageData, (response) => {
      if (response && response.error) {
        console.error("❌ Server error response:", response.error);
      } else {
        setMessage("");
      }
    });
  };

  const groupMessagesByDate = (messagesList) => {
    const groups = [];
    let currentGroup = [];
    let currentDate = null;

    messagesList.forEach((msg) => {
      const messageDate = new Date(
        msg.created_at || msg.timestamp
      ).toDateString();

      if (currentDate !== messageDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: currentGroup,
          });
        }
        currentGroup = [msg];
        currentDate = messageDate;
      } else {
        currentGroup.push(msg);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        messages: currentGroup,
      });
    }

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return (
    <Box className={styles.chatContainer}>
      <Flex
        className={styles.chatHeader}
        justifyContent="space-between"
        alignItems="center"
        p="16px">
        <Text fontSize="18px" fontWeight="600" color="#181D27">
          Collobration
        </Text>
        <Button bg="none" _hover={{bg: "none"}} p="0">
          <img src="/img/fullScreenChat.svg" alt="Fullscreen" />
        </Button>
      </Flex>

      <Box className={styles.messagesList} ref={messagesContainerRef}>
        {!isConnected && (
          <Box className={styles.emptyState}>
            <Text>Connecting to chat server...</Text>
          </Box>
        )}

        {isConnected && isInitializing && (
          <Box className={styles.emptyState}>
            <Text>Initializing chat...</Text>
          </Box>
        )}

        {isConnected &&
          !isInitializing &&
          conversation?.id &&
          messages.length === 0 && (
            <Box className={styles.emptyState}>
              <Text>No messages yet. Start the conversation!</Text>
            </Box>
          )}

        {isConnected &&
          !isInitializing &&
          conversation?.id &&
          messages.length > 0 && (
            <Box className={styles.messagesContainer}>
              {messageGroups.map((group, groupIndex) => (
                <Box key={`${group.date}-${groupIndex}`}>
                  <Box className={styles.dateSeparator}>
                    <Text fontSize="12px" color="#6B7280" fontWeight="500">
                      {formatDate(group.date)}
                    </Text>
                  </Box>

                  {group.messages.map((msg, msgIndex) => {
                    const isOwn = msg.from === loginUser;
                    const showTime =
                      msgIndex === group.messages.length - 1 ||
                      group.messages[msgIndex + 1]?.from !== msg.from;

                    const messageTime = formatTime(
                      msg.created_at || msg.timestamp
                    );
                    const isRead = isOwn && !!msg.read_at;

                    const normalizedType = msg.type
                      ? String(msg.type).toLowerCase().trim()
                      : "text";
                    const messageWidth =
                      normalizedType === "text" ? "fit-content" : "500px";

                    return isOwn ? (
                      <Flex
                        key={msg.id || msg._id || msgIndex}
                        ml="auto"
                        justifyContent="flex-end"
                        p="6px 0"
                        gap="12px">
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<MdMoreVert />}
                            variant="ghost"
                            size="sm"
                            aria-label="Message options"
                            opacity={0}
                            _hover={{opacity: 1, bg: "gray.100"}}
                            alignSelf="center"
                            sx={{
                              ".message-wrapper-own:hover &": {
                                opacity: 1,
                              },
                            }}
                          />
                          <MenuList
                            minW="150px"
                            boxShadow="lg"
                            borderRadius="12px"
                            p="4px">
                            <MenuItem
                              icon={<MdReply size={18} />}
                              borderRadius="8px"
                              fontSize="14px"
                              _hover={{bg: "gray.100"}}>
                              Reply
                            </MenuItem>
                          </MenuList>
                        </Menu>

                        <Box
                          maxW="500px"
                          w={messageWidth}
                          className="message-wrapper-own">
                          <Box
                            bg="#E0F0FF"
                            color="#080707"
                            borderRadius="25px"
                            borderBottomRightRadius="0"
                            w="100%"
                            py="6px">
                            <Box flex="1">
                              <TextMessage
                                isOwn={isOwn}
                                content={msg.message || msg.content || ""}
                              />
                            </Box>
                          </Box>
                          {showTime && (
                            <Flex
                              width="100%"
                              justifyContent="flex-end"
                              alignItems="center"
                              gap="4px">
                              {isRead && (
                                <img src="/img/doublecheck.svg" alt="read" />
                              )}
                              <Text
                                fontWeight="400"
                                color="#535862"
                                fontSize="12px">
                                {messageTime}
                              </Text>
                            </Flex>
                          )}
                        </Box>
                      </Flex>
                    ) : (
                      <Flex
                        key={msg.id || msg._id || msgIndex}
                        p="6px 0"
                        gap="12px">
                        <Box
                          w="40px"
                          h="40px"
                          borderRadius="50%"
                          border="1px solid #E9EAEB"
                          color="#fff"
                          bg="#F79009"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontWeight="600"
                          fontSize="16px"
                          flexShrink={0}>
                          {msg.from?.[0]?.toUpperCase() || "U"}
                        </Box>

                        <Box
                          alignItems="center"
                          gap="6px"
                          maxW="500px"
                          w={messageWidth}
                          className="message-wrapper">
                          <Flex alignItems="center" gap="6px">
                            <Box
                              bg="#E9EAED"
                              color="#181D27"
                              borderRadius="20px"
                              borderBottomLeftRadius="4px"
                              border="1px solid #E9EAEB"
                              w="100%">
                              <TextMessage
                                isOwn={isOwn}
                                content={msg.message || msg.content || ""}
                              />
                            </Box>

                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<MdMoreVert />}
                                variant="ghost"
                                size="sm"
                                aria-label="Message options"
                                opacity={0}
                                _hover={{opacity: 1, bg: "gray.100"}}
                                sx={{
                                  ".message-wrapper:hover &": {
                                    opacity: 1,
                                  },
                                }}
                              />
                              <MenuList
                                minW="150px"
                                boxShadow="lg"
                                borderRadius="12px"
                                p="4px">
                                <MenuItem
                                  icon={<MdReply size={18} />}
                                  borderRadius="8px"
                                  fontSize="14px"
                                  _hover={{bg: "gray.100"}}>
                                  Reply
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Flex>
                          <Box>
                            {showTime && (
                              <Text
                                mt="2px"
                                fontWeight="400"
                                color="#535862"
                                fontSize="12px">
                                {messageTime}
                              </Text>
                            )}
                          </Box>
                        </Box>
                      </Flex>
                    );
                  })}
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
          )}
      </Box>

      <Box className={styles.messageInput}>
        <form onSubmit={handleSendMessage}>
          <Flex
            p="16px 10px"
            gap="12px"
            alignItems="center"
            borderTop="1px solid #E9EAEB">
            <InputGroup flex="1">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a message"
                border="1px solid #D1D5DB"
                borderRadius="8px"
                h="50px"
                disabled={!isConnected || !conversation?.id}
                _focus={{
                  outline: "none",
                  boxShadow: "none",
                }}
              />
            </InputGroup>

            <Button bg="none" _hover={{bg: "none"}} p="0" type="button">
              <IoIosMore style={{fontSize: "24px", color: "#181D27"}} />
            </Button>

            <Button
              type="submit"
              bg="#F79009"
              color="#FFFFFF"
              borderRadius="8px"
              px="24px"
              h="40px"
              disabled={!isConnected || !conversation?.id || !message.trim()}
              _hover={{bg: "#D97706"}}
              _disabled={{bg: "#D1D5DB", cursor: "not-allowed"}}>
              Send
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
}

export default ChatMessage;
