import React, {useState, useRef, useMemo} from "react";
import {useChat} from "../../context/ChatContext";
import styles from "./MessageInput.module.scss";
import {
  Box,
  Button,
  Flex,
  Input,
  IconButton,
  useToast,
  Text,
  HStack,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import fileService from "@services/fileService";
import {FaMicrophone, FaStop, FaTrash, FaCheck} from "react-icons/fa";
import {MdClose, MdReply} from "react-icons/md";

const waveformStyle = `
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
`;

const MessageInput = ({
  onSendMessage = () => {},
  isConnected = false,
  disabled = false,
  replyingTo = null,
  onCancelReply = () => {},
}) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);

  const {setTyping, currentUser} = useChat();
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const toast = useToast();

  const getFileType = (file) => {
    const mimeType = file.type;

    if (mimeType.startsWith("image/")) {
      return "image";
    } else if (mimeType.startsWith("video/")) {
      return "video";
    } else if (mimeType.startsWith("audio/")) {
      return "voice";
    } else {
      return "file";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (audioUrl) {
      await sendAudioRecording();
    } else if (selectedFile) {
      await handleFileSend();
    } else if (message.trim()) {
      onSendMessage(message.trim(), "text");
      setMessage("");
      setTyping(currentUser?.id, false);
      if (onCancelReply) {
        onCancelReply();
      }
    } else {
      console.warn("No file or message to send");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (value.trim() && isConnected) {
      setTyping(currentUser?.id, true);

      typingTimeoutRef.current = setTimeout(() => {
        setTyping(currentUser?.id, false);
      }, 2000);
    } else {
      setTyping(currentUser?.id, false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
    if (!selectedFile) {
      console.warn("No file selected");
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

      onSendMessage(fileUrl, fileType, {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        url: fileUrl,
      });

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

      if (onCancelReply) {
        onCancelReply();
      }
    } catch (error) {
      console.error("File upload error:", error);
    } finally {
      setIsUploading(false);
      console.log("Upload process completed");
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
    if (!audioBlob) {
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

      const audioUrl = `https://cdn.u-code.io/${response.link}`;

      onSendMessage(audioUrl, "voice", {
        name: `Voice Message (${formatRecordingTime(recordingTime)})`,
        size: audioFile.size,
        type: audioFile.type,
        url: audioUrl,
        duration: recordingTime,
      });

      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);

      if (onCancelReply) {
        onCancelReply();
      }

      toast({
        title: "Voice message sent",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("=== AUDIO UPLOAD ERROR ===");

      toast({
        title: "Upload failed",
        description: `Could not send voice message: ${
          error?.message || "Unknown error"
        }`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      console.log("=== AUDIO UPLOAD COMPLETED ===");
    }
  };

  const currentFileType = useMemo(() => {
    return selectedFile ? getFileType(selectedFile) : null;
  }, [selectedFile]);

  return (
    <Box>
      <style>{waveformStyle}</style>

      {replyingTo && (
        <Box
          p="8px 16px"
          bg="#EFF4FF"
          borderRadius="20px"
          margin="8px"
          borderTop="1px solid #E2E8F0">
          <Flex justifyContent="space-between" alignItems="center" gap="12px">
            <Flex flex="1" alignItems="center" gap="8px">
              <Flex alignItems="center" justifyContent="center" w="24px">
                <img src="/img/replyIcon.svg" alt="" />
              </Flex>
              <Box>
                <Text fontSize="14px" fontWeight="400" color="#141414">
                  Replying for {replyingTo.from}
                </Text>
                <Text fontSize="14px" color="#727272" noOfLines={2}>
                  {replyingTo.message || "File message"}
                </Text>
              </Box>
            </Flex>
            <IconButton
              size="md"
              icon={<MdClose />}
              onClick={onCancelReply}
              variant="ghost"
              aria-label="Cancel reply"
              color="#6B7280"
              _hover={{bg: "#F3F4F6"}}
              minW="auto"
              h="auto"
            />
          </Flex>
        </Box>
      )}

      {(isRecording || audioUrl) && (
        <Box
          mx="20px"
          mb="10px"
          p="4px 10px"
          bg="white"
          borderRadius="12px"
          border="1px solid #E2E8F0"
          boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)">
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
                  {Array.from({length: 120}, (_, i) => {
                    const height = Math.sin(i * 0.5) * 8 + 12;
                    return (
                      <>
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
                      </>
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

      <form onSubmit={handleSubmit} className={styles.form}>
        <Flex p="16px 10px" borderTop="1px solid #E9EAEB">
          <Button
            onClick={() => {
              console.log("attach");
              fileInputRef.current?.click();
            }}
            bg="none"
            _hover={{bg: "none"}}
            p="0">
            <img src="/img/attach.svg" alt="" />
          </Button>
          <InputGroup>
            <Input
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={
                selectedFile
                  ? "File selected - click Send"
                  : isConnected
                  ? "Send a message"
                  : "Connecting..."
              }
              border="1px solid #D1D5DB"
              borderRadius="25px"
              h="40px"
              disabled={
                disabled ||
                !isConnected ||
                selectedFile !== null ||
                isRecording ||
                audioUrl !== null
              }
              _focus={{
                outline: "none",
                boxShadow: "none",
              }}
            />
            {/* <InputRightElement>
              <Button
                onClick={handleSubmit}
                _hover={{bg: "none"}}
                bg="none"
                p="0">
                <img src="/img/smile.svg" alt="" />
              </Button>
            </InputRightElement> */}
          </InputGroup>

          <Button
            onClick={isRecording ? stopRecording : startRecording}
            bg="none"
            _hover={{bg: "none"}}
            p="0">
            <img src="/img/microphone.svg" alt="" />
          </Button>

          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            display="none"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
          />
        </Flex>
      </form>

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
};

export default MessageInput;
