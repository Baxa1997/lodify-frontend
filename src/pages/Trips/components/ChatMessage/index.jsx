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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  HStack,
} from "@chakra-ui/react";
import {MdReply, MdMoreVert} from "react-icons/md";
import {FaMicrophone, FaStop, FaTrash, FaCheck} from "react-icons/fa";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useSocket, useSocketConnection} from "@context/SocketProvider";
import TextMessage from "../../../Collaborations/components/MessageBubble/TextMessage";
import ImageMessage from "../../../Collaborations/components/MessageBubble/ImageMessage";
import VideoMessage from "../../../Collaborations/components/MessageBubble/VideoMessage";
import AudioMessage from "../../../Collaborations/components/MessageBubble/AudioMessage";
import FileMessage from "../../../Collaborations/components/MessageBubble/FileMessage";
import chatService from "@services/chatService";
import fileService from "@services/fileService";
import styles from "./ChatMessage.module.scss";

function ChatMessage({tripId: propTripId, tripName: propTripName}) {
  const {id} = useParams();
  const tripId = propTripId || id;
  const tripName = propTripName || `Trip ${tripId || ""}`;
  const socket = useSocket();
  const {isConnected} = useSocketConnection();
  const userId = useSelector((state) => state.auth.userInfo?.id);
  const projectId = useSelector((state) => state.auth.projectId);
  const loginUser = useSelector((state) => state.auth.user_data?.login);

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [hasProcessedTripId, setHasProcessedTripId] = useState(false);
  const [roomIdFromApi, setRoomIdFromApi] = useState(null);

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const toast = useToast();

  const scrollToBottom = useCallback((behavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({behavior});
    });
  }, []);

  const getFileType = (file) => {
    const mimeType = file.type;
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "voice";
    return "file";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFilePreviewUrl(previewUrl);
      const fileType = getFileType(file);
      if (fileType === "image" || fileType === "video" || fileType === "file") {
        setIsPreviewOpen(true);
      }
    }
  };

  const handleFileSend = async () => {
    if (
      !selectedFile ||
      !roomData?.data?.body?.room_id ||
      !loginUser ||
      !isConnected
    ) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fileService.folderUpload(formData, {
        folder_name: "chat",
      });

      if (!response?.link) {
        throw new Error("Invalid response from upload service");
      }

      const fileUrl = `https://cdn.u-code.io/${response.link}`;
      const fileType = getFileType(selectedFile);

      const messageData = {
        room_id: roomData?.data?.body?.room_id,
        content: fileUrl,
        from: loginUser,
        type: fileType,
        author_row_id: userId,
        project_id: projectId,
        file: fileUrl,
      };

      socket.emit("chat message", messageData, (response) => {
        if (response && response.error) {
          console.error("❌ Server error response:", response.error);
          toast({
            title: "Upload failed",
            description: response.error,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          setSelectedFile(null);
          setMessage("");
          setIsPreviewOpen(false);
          if (filePreviewUrl) {
            URL.revokeObjectURL(filePreviewUrl);
            setFilePreviewUrl(null);
          }
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      });
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "Upload failed",
        description: error?.message || "Could not upload file",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setMessage("");
    setIsPreviewOpen(false);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/ogg",
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorderRef.current.mimeType,
        });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording failed",
        description: "Could not access microphone",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    audioChunksRef.current = [];
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const sendAudioRecording = async () => {
    if (
      !audioBlob ||
      !roomData?.data?.body?.room_id ||
      !loginUser ||
      !isConnected
    ) {
      return;
    }

    setIsUploading(true);

    try {
      const audioFile = new File(
        [audioBlob],
        `voice-message-${Date.now()}.webm`,
        {type: audioBlob.type}
      );

      const formData = new FormData();
      formData.append("file", audioFile);
      const response = await fileService.folderUpload(formData, {
        folder_name: "chat",
      });

      if (!response?.link) {
        throw new Error("Invalid response from upload service");
      }

      const uploadedAudioUrl = `https://cdn.u-code.io/${response.link}`;

      const messageData = {
        room_id: roomData?.data?.body?.room_id,
        content: uploadedAudioUrl,
        from: loginUser,
        type: "voice",
        author_row_id: userId,
        project_id: projectId,
        file: uploadedAudioUrl,
      };

      const currentAudioBlob = audioBlob;
      const currentAudioUrl = audioUrl;
      const currentRecordingTime = recordingTime;

      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);
      audioChunksRef.current = [];
      setIsRecording(false);

      socket.emit("chat message", messageData, (response) => {
        if (response && response.error) {
          setAudioBlob(currentAudioBlob);
          setAudioUrl(currentAudioUrl);
          setRecordingTime(currentRecordingTime);
          toast({
            title: "Upload failed",
            description: response.error,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Voice message sent",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        }
        setIsUploading(false);
      });
    } catch (error) {
      console.error("=== AUDIO UPLOAD ERROR ===", error);
      toast({
        title: "Upload failed",
        description: `Could not send voice message: ${
          error?.message || "Unknown error"
        }`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsUploading(false);
    }
  };

  const currentFileType = useMemo(() => {
    return selectedFile ? getFileType(selectedFile) : null;
  }, [selectedFile]);

  useEffect(() => {
    setHasProcessedTripId(false);
    setRoomIdFromApi(null);
    setConversation(null);
    setMessages([]);
  }, [tripId]);

  const {
    data: roomData,
    isLoading: isLoadingRoom,
    isError: isRoomError,
  } = useQuery({
    queryKey: ["chatRoomId", tripId],
    queryFn: () => chatService.getChatRoomId(tripId, projectId),
    enabled: !!tripId && !!isConnected,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });

  useEffect(() => {
    if (roomData?.data) {
      const roomId = roomData?.data?.body?.room_id;
      if (roomId) {
        setRoomIdFromApi(roomId);
      } else {
        setRoomIdFromApi(null);
      }
    } else if (isRoomError || (!isLoadingRoom && !roomData)) {
      setRoomIdFromApi(null);
    }
  }, [roomData, isRoomError, isLoadingRoom]);

  useEffect(() => {
    if (!socket || !isConnected || !userId || !tripId || isLoadingRoom) return;
    if (hasProcessedTripId) return;

    if (roomIdFromApi) {
      setIsInitializing(true);
      setHasProcessedTripId(true);

      socket.emit("rooms list", {row_id: userId, project_id: projectId});

      const handleRoomsList = (data) => {
        const roomsData = data || [];
        const existingRoom = roomsData.find(
          (room) => room.id === roomIdFromApi || room.item_id === tripId
        );

        if (existingRoom?.id) {
          console.log("✅ Found existing room:", existingRoom);
          setConversation(existingRoom);
          setIsInitializing(false);
        } else {
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
      !roomData?.data?.body?.room_id
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
          from_name: loginUser,
          project_id: projectId,
          to_name: tripName || `Trip ${tripId}`,
        },
        (response) => {
          if (response && response.room) {
            setConversation(response.room);
            setIsInitializing(false);
          } else if (response && response.error) {
            console.error("❌ Error creating room:", response.error);
            setIsInitializing(false);
          } else {
            console.warn("⚠️ Unexpected create room response:", response);
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
    roomData?.data?.body?.room_id,
    hasProcessedTripId,
    loginUser,
    projectId,
    roomIdFromApi,
    isLoadingRoom,
    isRoomError,
  ]);

  useEffect(() => {
    setMessages([]);

    if (roomData?.data?.body?.room_id) {
      socket.emit(
        "join room",
        {
          room_id: roomData?.data?.body?.room_id,
          row_id: userId,
          limit: 50,
          offset: 0,
        },
        (response) => {
          setTimeout(() => {
            if (socket && socket.connected) {
              console.log("📥 Requesting room history explicitly");
              socket.emit("room history", {
                room_id: roomData?.data?.body?.room_id,
                row_id: userId,
                limit: 50,
                offset: 0,
              });
            }
          }, 500);
        }
      );
    }
  }, [socket, roomData?.data?.body?.room_id, userId, projectId, isConnected]);

  useEffect(() => {
    if (!socket || !roomData?.data?.body?.room_id) return;

    const handleRoomHistory = (messagesData) => {
      const messagesToSet = Array.isArray(messagesData)
        ? messagesData
        : messagesData?.data && Array.isArray(messagesData.data)
        ? messagesData.data
        : messagesData?.messages && Array.isArray(messagesData.messages)
        ? messagesData.messages
        : [];

      setMessages(messagesToSet);

      if (messagesToSet.length > 0) {
        setTimeout(() => scrollToBottom("auto"), 100);
      }
    };

    const handleReceiveMessage = (message) => {
      if (message.room_id === roomData?.data?.body?.room_id) {
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
            room_id: roomData?.data?.body?.room_id,
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
  }, [
    socket,
    roomData?.data?.body?.room_id,
    userId,
    loginUser,
    projectId,
    scrollToBottom,
  ]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom("smooth");
    }
  }, [messages.length, scrollToBottom]);

  useEffect(() => {
    if (!socket || !roomData?.data?.body?.room_id || !userId || !isConnected)
      return;

    const sendMessageRead = () => {
      if (
        socket &&
        socket.connected &&
        roomData?.data?.body?.room_id &&
        userId
      ) {
        socket.emit("message:read", {
          row_id: userId,
          room_id: roomData?.data?.body?.room_id,
        });
      }
    };

    sendMessageRead();
    const messageReadInterval = setInterval(sendMessageRead, 30000);

    return () => {
      clearInterval(messageReadInterval);
    };
  }, [socket, roomData?.data?.body?.room_id, userId, isConnected]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (audioUrl) {
      sendAudioRecording();
    } else if (selectedFile) {
      handleFileSend();
    } else if (
      roomData?.data?.body?.room_id &&
      loginUser &&
      message.trim() &&
      isConnected
    ) {
      const messageData = {
        room_id: roomData?.data?.body?.room_id,
        content: message.trim(),
        from: loginUser,
        type: "text",
        author_row_id: userId,
        project_id: projectId,
        file: "",
      };
      setMessage("");
      socket.emit("chat message", messageData, (response) => {
        if (response && response.error) {
          console.error("❌ Server error response:", response.error);
        } else {
          setMessage("");
        }
      });
    }
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

  const getMessageComponent = (type) => {
    const normalizedType = type ? String(type).toLowerCase().trim() : "text";
    const messageComponents = {
      text: TextMessage,
      file: FileMessage,
      image: ImageMessage,
      voice: AudioMessage,
      video: VideoMessage,
    };
    return messageComponents[normalizedType] || TextMessage;
  };

  const waveformStyle = `
    @keyframes pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
  `;
  console.log("messageGroupsmessageGroups", messageGroups);
  return (
    <Box className={styles.chatContainer}>
      <style>{waveformStyle}</style>
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
        {/* {!isConnected && (
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
          roomData?.data?.body?.room_id &&
          messages.length === 0 && (
            <Box className={styles.emptyState}>
              <Text>No messages yet. Start the conversation!</Text>
            </Box>
          )} */}

        {roomData?.data?.body?.room_id && messages.length > 0 && (
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
                  const MessageComponent = getMessageComponent(msg.type);
                  const fileInfo = msg.fileInfo || {
                    url: msg.file || msg.content,
                    name: msg.file_name || "File",
                    size: msg.file_size,
                    type: msg.file_type,
                    duration: msg.duration,
                  };

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
                          borderRadius={
                            normalizedType === "text" ? "25px" : "8px"
                          }
                          borderBottomRightRadius={
                            normalizedType === "text" ? "0" : "8px"
                          }
                          w="100%"
                          py="6px">
                          <Box flex="1">
                            <MessageComponent
                              isOwn={isOwn}
                              content={msg.message || msg.content || ""}
                              fileInfo={fileInfo}
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
                            borderRadius={
                              normalizedType === "text" ? "20px" : "8px"
                            }
                            borderBottomLeftRadius={
                              normalizedType === "text" ? "4px" : "8px"
                            }
                            border="1px solid #E9EAEB"
                            w="100%">
                            <MessageComponent
                              isOwn={isOwn}
                              content={msg.message || msg.content || ""}
                              fileInfo={fileInfo}
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

      {(isRecording || audioUrl) && (
        <Box
          mx="20px"
          mb="10px"
          mt="10px"
          p="12px"
          bg="white"
          borderRadius="12px"
          border="1px solid #E2E8F0"
          boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
          position="relative"
          zIndex={10}>
          <Flex alignItems="center" gap="16px">
            <IconButton
              size="sm"
              icon={<FaTrash />}
              onClick={cancelRecording}
              variant="ghost"
              colorScheme="gray"
              aria-label="Delete recording"
              color="#6B7280"
              _hover={{bg: "#F3F4F6"}}
            />

            <Text fontWeight="600" fontSize="16px" color="#181D27" minW="50px">
              {formatRecordingTime(recordingTime)}
            </Text>

            <Box flex="1" position="relative">
              {isRecording ? (
                <Box
                  h="24px"
                  display="flex"
                  alignItems="center"
                  gap="2px"
                  justifyContent="center">
                  {Array.from({length: 20}, (_, i) => {
                    const height = Math.sin(i * 0.5) * 8 + 12;
                    return (
                      <Box
                        key={i}
                        w="3px"
                        h={`${height}px`}
                        bg="#9CA3AF"
                        borderRadius="1.5px"
                        animation="pulse 1s ease-in-out infinite"
                        style={{
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    );
                  })}
                </Box>
              ) : (
                <audio
                  controls
                  src={audioUrl}
                  style={{
                    width: "100%",
                    height: "32px",
                  }}
                />
              )}
            </Box>

            <HStack spacing="8px">
              {isRecording ? (
                <IconButton
                  size="md"
                  icon={<FaStop />}
                  onClick={stopRecording}
                  bg="#EF4444"
                  color="white"
                  borderRadius="50%"
                  w="40px"
                  h="40px"
                  _hover={{bg: "#DC2626"}}
                  aria-label="Stop recording"
                />
              ) : (
                <IconButton
                  size="md"
                  icon={<FaMicrophone />}
                  onClick={startRecording}
                  bg="#3B82F6"
                  color="white"
                  borderRadius="50%"
                  w="40px"
                  h="40px"
                  _hover={{bg: "#2563EB"}}
                  aria-label="Start recording"
                />
              )}

              {audioUrl && !isRecording && (
                <IconButton
                  size="md"
                  icon={<FaCheck />}
                  onClick={sendAudioRecording}
                  bg="#10B981"
                  color="white"
                  borderRadius="50%"
                  w="40px"
                  h="40px"
                  _hover={{bg: "#059669"}}
                  isLoading={isUploading}
                  disabled={isUploading}
                  aria-label="Send recording"
                />
              )}
            </HStack>
          </Flex>
        </Box>
      )}

      <Box className={styles.messageInput}>
        <form onSubmit={handleSendMessage}>
          <Flex
            p="16px 10px"
            gap="12px"
            alignItems="center"
            borderTop="1px solid #E9EAEB">
            <Button
              onClick={() => fileInputRef.current?.click()}
              bg="none"
              _hover={{bg: "none"}}
              p="0"
              type="button">
              <img src="/img/attach.svg" alt="Attach file" />
            </Button>

            <InputGroup flex="1">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  selectedFile
                    ? "File selected - click Send"
                    : isConnected
                    ? "Send a message"
                    : "Connecting..."
                }
                border="1px solid #D1D5DB"
                borderRadius="8px"
                h="50px"
                _focus={{
                  outline: "none",
                  boxShadow: "none",
                }}
              />
            </InputGroup>

            <Button
              onClick={isRecording ? stopRecording : startRecording}
              bg="none"
              _hover={{bg: "none"}}
              p="0"
              type="button">
              <img src="/img/microphone.svg" alt="Record audio" />
            </Button>

            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              display="none"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
            />

            {/* <Button bg="none" _hover={{bg: "none"}} p="0" type="button">
              <IoIosMore style={{fontSize: "24px", color: "#181D27"}} />
            </Button> */}

            <Button
              type="submit"
              bg="#F79009"
              color="#FFFFFF"
              borderRadius="8px"
              px="24px"
              h="40px"
              disabled={
                !isConnected ||
                !roomData?.data?.body?.room_id ||
                (!message.trim() && !selectedFile && !audioUrl) ||
                isUploading
              }
              isLoading={isUploading}
              _hover={{bg: "#D97706"}}
              _disabled={{bg: "#D1D5DB", cursor: "not-allowed"}}>
              Send
            </Button>
          </Flex>
        </form>
      </Box>

      <Modal
        isOpen={isPreviewOpen}
        onClose={handleClearFile}
        size="xl"
        isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
        <ModalContent borderRadius="16px" overflow="hidden" maxW="520px">
          <ModalHeader
            borderBottom="1px solid #E9EAEB"
            pb="0px"
            fontSize="18px"
            fontWeight="600">
            {currentFileType === "image"
              ? "Preview Image"
              : currentFileType === "video"
              ? "Preview Video"
              : "File Preview"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p="6px">
            {selectedFile && (
              <Box>
                {currentFileType === "image" && filePreviewUrl && (
                  <Box mb="20px" display="flex" justifyContent="center">
                    <img
                      src={filePreviewUrl}
                      alt={selectedFile.name}
                      style={{
                        width: "500px",
                        height: "250px",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}

                {currentFileType === "video" && filePreviewUrl && (
                  <Box mb="20px" display="flex" justifyContent="center">
                    <video
                      src={filePreviewUrl}
                      controls
                      style={{
                        width: "500px",
                        height: "250px",
                        borderRadius: "12px",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                )}

                {currentFileType === "file" && (
                  <Flex
                    alignItems="center"
                    gap="16px"
                    p="20px"
                    bg="#F9FAFB"
                    borderRadius="12px"
                    mb="20px">
                    <Box
                      w="60px"
                      h="60px"
                      bg="#E9EAED"
                      borderRadius="12px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center">
                      <img
                        src="/img/attach.svg"
                        alt="file"
                        style={{width: "30px", height: "30px"}}
                      />
                    </Box>
                    <Box flex="1">
                      <Text
                        fontSize="16px"
                        fontWeight="600"
                        color="#181D27"
                        mb="4px"
                        wordBreak="break-word">
                        {selectedFile.name}
                      </Text>
                      <Text fontSize="14px" color="#535862">
                        {formatFileSize(selectedFile.size)}
                      </Text>
                    </Box>
                  </Flex>
                )}

                <Flex gap="12px" justifyContent="flex-end" mx="20px">
                  <Button
                    onClick={handleClearFile}
                    variant="ghost"
                    colorScheme="gray"
                    size="md">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFileSend}
                    bg="#EF6820"
                    color="white"
                    size="md"
                    isLoading={isUploading}
                    disabled={isUploading}
                    _hover={{bg: "#DC5E1C"}}>
                    Send
                  </Button>
                </Flex>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ChatMessage;
