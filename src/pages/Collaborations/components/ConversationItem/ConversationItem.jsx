import React, {useEffect} from "react";
import styles from "./ConversationItem.module.scss";
import {checkValidUrl} from "@utils/checkValidUrl";
import {useSocket} from "@context/SocketProvider";
import {useSelector} from "react-redux";
import {Badge, Box, Flex, Text} from "@chakra-ui/react";

const ConversationItem = ({conversation, isSelected, onClick}) => {
  const {
    name,
    to_name,
    last_message,
    timestamp,
    isOnline,
    type,
    last_message_created_at,
    last_message_from,
    unread_message_count = 0,
    attributes,
  } = conversation;

  const broker = attributes?.broker;
  const carrier = attributes?.carrier;

  const socket = useSocket();
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const isBroker = Boolean(brokersId);
  const loginUser = useSelector((state) => state.auth.user_data?.login);

  const getSenderName = () => {
    if (!last_message_from) return null;

    if (
      loginUser &&
      String(last_message_from).trim().toLowerCase() ===
        String(loginUser).trim().toLowerCase()
    ) {
      return "You";
    }

    return last_message_from;
  };
  const getMessagePreview = () => {
    if (checkValidUrl(last_message)) {
      return "📎 File";
    }
    return last_message || "No messages yet";
  };

  // const getTimeDisplay = () => {
  //   const time = calculateTimeHoursDifferenceInTimeZone(
  //     last_message_created_at
  //   );
  //   if (time === "Online") return "online";
  //   return time || "now";
  // };

  const getInitials = () => {
    if (Boolean(type === "group")) {
      const orName = isBroker
        ? `${carrier?.legal_name ?? ""} `
        : `${broker?.legal_name ?? ""} `;
      return orName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 1);
    } else {
      return to_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 1);
    }
    return "U";
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("rooms update", {row_id: conversation.id}, (response) => {});
    return () => {
      socket.off("rooms update");
    };
  }, [socket, conversation?.id]);

  return (
    <>
      {type === "group" ? (
        <div
          className={`${styles.conversationItemGroup} ${
            isSelected ? styles.selected : ""
          }`}
          onClick={onClick}>
          <Flex pt="10px">
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>{getInitials()}</div>
              {isOnline && <div className={styles.onlineIndicator}></div>}
            </div>

            <div className={styles.content}>
              <div className={styles.header}>
                <div className={styles.nameContainer}>
                  <span style={{color: "#181D27"}} className={styles.name}>
                    Load {to_name}{" "}
                    {unread_message_count > 0 && (
                      <Badge
                        bg="#EF6820"
                        color="white"
                        borderRadius="full"
                        px="8px"
                        py="2px"
                        mb="5px"
                        ml="8px"
                        fontSize="12px"
                        fontWeight="600">
                        {unread_message_count > 99
                          ? "99+"
                          : unread_message_count}
                      </Badge>
                    )}
                  </span>
                </div>
              </div>

              <Text fontSize="14px" fontWeight="400" color="#535862">
                {type === "group"
                  ? isBroker
                    ? `${carrier?.legal_name ?? ""} `
                    : `${broker?.legal_name ?? ""}  `
                  : to_name}
              </Text>
            </div>
          </Flex>
          <Box
            mt="16px"
            mb="6px"
            ml="6px"
            w="100%"
            className={styles.messagePreview}>
            {getSenderName() && (
              <span style={{color: "#535862", fontWeight: "600"}}>
                {getSenderName()}:
              </span>
            )}{" "}
            {getMessagePreview()}
          </Box>
        </div>
      ) : (
        <div
          className={`${styles.conversationItemGroup} ${
            isSelected ? styles.selected : ""
          }`}
          onClick={onClick}>
          <Flex pt="10px">
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>{getInitials()}</div>
              {isOnline && <div className={styles.onlineIndicator}></div>}
            </div>

            <div className={styles.content}>
              <div className={styles.header}>
                <div className={styles.nameContainer}>
                  <span style={{color: "#181D27"}} className={styles.name}>
                    {to_name}
                  </span>
                </div>
              </div>

              <Text fontSize="14px" fontWeight="400" color="#535862">
                {to_name}
              </Text>
            </div>
          </Flex>
          <Box
            mt="16px"
            mb="6px"
            ml="6px"
            w="100%"
            className={styles.messagePreview}>
            {getSenderName() && (
              <span style={{color: "#535862", fontWeight: "600"}}>
                {getSenderName()}:
              </span>
            )}{" "}
            {getMessagePreview()}
          </Box>
        </div>
      )}
    </>
  );
};

export default ConversationItem;
