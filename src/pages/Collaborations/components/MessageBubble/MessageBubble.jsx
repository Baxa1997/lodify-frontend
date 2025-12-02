import React, {useMemo} from "react";
import {
  Flex,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import {MdReply, MdDelete, MdMoreVert} from "react-icons/md";
import TextMessage from "./TextMessage";
import FileMessage from "./FileMessage";
import ImageMessage from "./ImageMessage";
import AudioMessage from "./AudioMessage";
import VideoMessage from "./VideoMessage";

const MessageBubble = ({
  rooms = [],
  message,
  isOwn,
  conversation,
  showTime = true,
  onReply,
  allMessages = [],
  onDelete,
}) => {
  const {
    message: content,
    created_at,
    type,
    fileInfo,
    read_at,
    parent_id,
    parent_message,
  } = message;

  const isRead = useMemo(() => {
    if (!isOwn) return false;
    return !!read_at;
  }, [isOwn, read_at]);

  const normalizedType = type ? String(type).toLowerCase().trim() : "text";
  const sender = useMemo(
    () =>
      rooms?.find((room) => room.id === message?.room_id) || {
        to_name: "Unknown",
      },
    [rooms, message?.room_id]
  );

  const messageTime = useMemo(
    () =>
      new Date(created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [created_at]
  );

  const messageComponents = {
    text: TextMessage,
    file: FileMessage,
    image: ImageMessage,
    voice: AudioMessage,
    video: VideoMessage,
  };

  const MessageComponent = messageComponents[normalizedType] || TextMessage;

  const getMessageWidth = () => {
    if (normalizedType === "text") {
      return "fit-content";
    } else {
      return "500px";
    }
  };

  const messageWidth = getMessageWidth();

  const parentMsg = useMemo(() => {
    if (parent_message) return parent_message;
    if (parent_id && allMessages.length > 0) {
      return allMessages.find(
        (msg) => msg.id === parent_id || msg._id === parent_id
      );
    }
    return null;
  }, [parent_id, parent_message, allMessages]);

  return isOwn ? (
    <Flex ml="auto" justifyContent="flex-end" p="6px 0" gap="12px">
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
        <MenuList minW="150px" boxShadow="lg" borderRadius="12px" p="4px">
          <MenuItem
            icon={<MdReply size={18} />}
            onClick={() => onReply && onReply(message)}
            borderRadius="8px"
            fontSize="14px"
            _hover={{bg: "gray.100"}}>
            Reply
          </MenuItem>
          {onDelete && (
            <MenuItem
              icon={<MdDelete size={18} />}
              onClick={() => onDelete(message)}
              borderRadius="8px"
              fontSize="14px"
              color="red.500"
              _hover={{bg: "red.50"}}>
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <Box maxW="500px" w={messageWidth} className="message-wrapper-own">
        <Box
          bg="#E0F0FF"
          color="#080707"
          borderRadius="25px"
          borderBottomRightRadius="0"
          w="100%"
          py="6px">
          {parentMsg && (
            <Box
              p="8px 12px"
              mb="8px"
              mx="12px"
              mt="12px"
              bg="rgba(255, 255, 255, 0.7)"
              borderRadius="8px"
              borderLeft="3px solid #3B82F6">
              <Text fontSize="12px" fontWeight="600" color="#3B82F6" mb="4px">
                {parentMsg.from || "User"}
              </Text>
              <Text fontSize="13px" color="#374151" noOfLines={2}>
                {parentMsg.message || "File message"}
              </Text>
            </Box>
          )}
          <Box flex="1">
            <MessageComponent
              isOwn={isOwn}
              content={content}
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
            {isRead && <img src="/img/doublecheck.svg" alt="read" />}
            <Text fontWeight="400" color="#535862" fontSize="12px">
              {messageTime}
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  ) : (
    <Flex p="6px 0" gap="12px">
      <Box
        w="40px"
        h="40px"
        borderRadius="50%"
        border="1px solid #E9EAEB"
        color="#fff"
        bg="#F79009"
        display="flex"
        alignItems="center"
        justifyContent="center">
        {conversation?.type === "group"
          ? message?.from?.[0]
          : sender?.to_name?.[0]}
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
            {parentMsg && (
              <Box
                p="8px 12px"
                mb="8px"
                mx="12px"
                mt="12px"
                bg="rgba(255, 255, 255, 0.8)"
                borderRadius="8px"
                borderLeft="3px solid #6B7280">
                <Text fontSize="12px" fontWeight="600" color="#6B7280" mb="4px">
                  {parentMsg.from || "User"}
                </Text>
                <Text fontSize="13px" color="#374151" noOfLines={2}>
                  {parentMsg.message || "File message"}
                </Text>
              </Box>
            )}
            <MessageComponent content={content} fileInfo={fileInfo} />
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
              _groupHover={{opacity: 1}}
              sx={{
                ".message-wrapper:hover &": {
                  opacity: 1,
                },
              }}
            />
            <MenuList minW="150px" boxShadow="lg" borderRadius="12px" p="4px">
              <MenuItem
                icon={<MdReply size={18} />}
                onClick={() => onReply && onReply(message)}
                borderRadius="8px"
                fontSize="14px"
                _hover={{bg: "gray.100"}}>
                Reply
              </MenuItem>
              {onDelete && (
                <MenuItem
                  icon={<MdDelete size={18} />}
                  onClick={() => onDelete(message)}
                  borderRadius="8px"
                  fontSize="14px"
                  color="red.500"
                  _hover={{bg: "red.50"}}>
                  Delete
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Flex>
        <Box>
          {showTime && (
            <Text mt="2px" fontWeight="400" color="#535862" fontSize="12px">
              {conversation?.type === "group" && (
                <span style={{fontWeight: "600"}}>{message?.from}</span>
              )}{" "}
              {messageTime}
            </Text>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default React.memo(MessageBubble, (prevProps, nextProps) => {
  const isSame =
    prevProps.message?.type === nextProps.message?.type &&
    prevProps.message?.message === nextProps.message?.message &&
    prevProps.message?.id === nextProps.message?.id &&
    prevProps.message?.created_at === nextProps.message?.created_at &&
    prevProps.message?.read_at === nextProps.message?.read_at &&
    prevProps.message?.parent_id === nextProps.message?.parent_id &&
    prevProps.isOwn === nextProps.isOwn &&
    prevProps.showTime === nextProps.showTime &&
    prevProps.onReply === nextProps.onReply &&
    prevProps.onDelete === nextProps.onDelete &&
    JSON.stringify(prevProps.message?.fileInfo) ===
      JSON.stringify(nextProps.message?.fileInfo) &&
    JSON.stringify(prevProps.message?.parent_message) ===
      JSON.stringify(nextProps.message?.parent_message);

  return isSame;
});
