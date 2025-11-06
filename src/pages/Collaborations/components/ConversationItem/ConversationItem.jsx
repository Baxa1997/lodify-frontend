import React, {useEffect} from "react";
import styles from "./ConversationItem.module.scss";
import {checkValidUrl} from "@utils/checkValidUrl";
import {calculateTimeHoursDifferenceInTimeZone} from "@utils/dateFormats";
import {useSocket} from "@context/SocketProvider";

const ConversationItem = ({conversation, isSelected, onClick}) => {
  const {
    name,
    to_name,
    last_message,
    timestamp,
    isOnline,
    type,
    last_message_created_at,
    unread_message_count = 0,
  } = conversation;

  const socket = useSocket();
  const getMessagePreview = () => {
    if (checkValidUrl(last_message)) {
      return "📎 File";
    }
    return last_message || "No messages yet";
  };

  const getTimeDisplay = () => {
    const time = calculateTimeHoursDifferenceInTimeZone(
      last_message_created_at
    );
    if (time === "Online") return "online";
    return time || "now";
  };

  const getInitials = () => {
    if (to_name) {
      return to_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
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
    <div
      className={`${styles.conversationItem} ${
        isSelected ? styles.selected : ""
      }`}
      onClick={onClick}>
      <div className={styles.avatarContainer}>
        <div className={styles.avatar}>{getInitials()}</div>
        {isOnline && <div className={styles.onlineIndicator}></div>}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.nameContainer}>
            <span className={styles.name}>{to_name || "Unknown"}</span>
          </div>
          {unread_message_count > 0 && (
            <div className={styles.unreadBadge}>
              {unread_message_count > 99 ? "99+" : unread_message_count}
            </div>
          )}
        </div>

        <div className={styles.messageContainer}>
          <div className={styles.messagePreview}>
            <span>You:</span> {getMessagePreview()}
          </div>

          <div className={styles.timestamp}>{getTimeDisplay()}</div>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
