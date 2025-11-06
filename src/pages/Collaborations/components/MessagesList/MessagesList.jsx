import React, {useEffect, useRef, useState, useCallback} from "react";
import MessageBubble from "../MessageBubble/MessageBubble";
import styles from "./MessagesList.module.scss";
import {useSocket} from "@context/SocketProvider";
import {useSelector} from "react-redux";

const MessagesList = ({rooms = [], conversation, isConnected, onReply}) => {
  const socket = useSocket();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [localMessages, setLocalMessages] = useState([]);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const loggedInUser = useSelector((state) => state.auth.user_data?.login);
  const userId = useSelector((state) => state.auth.userInfo?.id);
  const prevMessageCountRef = useRef(0);
  const isInitialLoadRef = useRef(false);
  const isLoadingPaginationRef = useRef(false);

  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    hasMoreMessages: true,
    isLoadingMore: false,
  });

  const scrollToBottom = (behavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({behavior});
    });
  };

  const deduplicateMessages = useCallback((existingMessages, newMessages) => {
    const existingIds = new Set(
      existingMessages.map((msg) => msg.id || msg._id)
    );
    const uniqueNewMessages = newMessages.filter(
      (msg) => !existingIds.has(msg.id || msg._id)
    );
    return [...uniqueNewMessages, ...existingMessages];
  }, []);

  const loadMoreMessages = useCallback(() => {
    if (
      !socket ||
      !conversation?.id ||
      pagination.isLoadingMore ||
      !pagination.hasMoreMessages
    )
      setPagination((prev) => ({...prev, isLoadingMore: true}));

    const nextOffset = pagination.offset + pagination.limit;

    socket.emit("room history", {
      room_id: conversation.id,
      limit: pagination.limit,
      offset: nextOffset,
    });
  }, [
    socket,
    conversation?.id,
    pagination.isLoadingMore,
    pagination.hasMoreMessages,
    pagination.offset,
    pagination.limit,
  ]);

  const handleScroll = useCallback(
    (e) => {
      const {scrollTop, scrollHeight, clientHeight} = e.target;

      if (
        scrollTop <= 10 &&
        pagination.hasMoreMessages &&
        !pagination.isLoadingMore
      ) {
        loadMoreMessages();
      }
    },
    [loadMoreMessages, pagination.hasMoreMessages, pagination.isLoadingMore]
  );

  useEffect(() => {
    if (isInitialLoadRef.current) {
      prevMessageCountRef.current = localMessages.length;
      return;
    }

    if (isLoadingPaginationRef.current) {
      prevMessageCountRef.current = localMessages.length;
      isLoadingPaginationRef.current = false;
      return;
    }

    if (localMessages.length > prevMessageCountRef.current) {
      setIsNewMessage(true);
      scrollToBottom("smooth");

      setTimeout(() => setIsNewMessage(false), 1000);
    }
    prevMessageCountRef.current = localMessages.length;
  }, [localMessages]);

  useEffect(() => {
    prevMessageCountRef.current = 0;
    isInitialLoadRef.current = true;
  }, [conversation?.id]);

  useEffect(() => {
    if (isInitialLoadRef.current && localMessages.length > 0) {
      setTimeout(() => {
        scrollToBottom("auto");
        isInitialLoadRef.current = false;
      }, 100);
    }
  }, [localMessages.length]);

  useEffect(() => {
    if (!socket) return;

    const handleRoomHistory = (messages) => {
      const messagesToSet = Array.isArray(messages)
        ? messages
        : messages?.data && Array.isArray(messages.data)
        ? messages.data
        : null;

      if (messagesToSet) {
        if (pagination.isLoadingMore) {
          const container = messagesContainerRef.current;
          const prevScrollHeight = container?.scrollHeight || 0;
          const prevScrollTop = container?.scrollTop || 0;

          if (messagesToSet.length === 0) {
            setPagination((prev) => ({
              ...prev,
              hasMoreMessages: false,
              isLoadingMore: false,
            }));
            return;
          }

          isLoadingPaginationRef.current = true;

          setLocalMessages((prevMessages) => {
            const deduplicatedMessages = deduplicateMessages(
              prevMessages,
              messagesToSet
            );
            return deduplicatedMessages;
          });

          setPagination((prev) => ({
            ...prev,
            offset: prev.offset + prev.limit,
            hasMoreMessages: messagesToSet.length >= prev.limit,
            isLoadingMore: false,
          }));

          requestAnimationFrame(() => {
            if (container) {
              const newScrollHeight = container.scrollHeight;
              container.scrollTop =
                prevScrollTop + (newScrollHeight - prevScrollHeight);
            }
          });
        } else {
          setLocalMessages(messagesToSet);
          isInitialLoadRef.current = true;
        }
      } else {
        console.warn("⚠️ Unexpected room history format:", messages);
      }
    };

    const handleReceiveMessage = (message) => {
      if (message.room_id === conversation?.id) {
        if (
          socket &&
          socket.connected &&
          userId &&
          message.from !== loggedInUser
        ) {
          socket.emit("message:read", {
            row_id: userId,
            room_id: conversation.id,
          });
        }

        setLocalMessages((prevMessages) => {
          const existingMessage = prevMessages.find(
            (msg) => (msg.id || msg._id) === (message.id || message._id)
          );
          if (existingMessage) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });
      }
    };

    const handleMessageRead = (response) => {
      if (response && response.room_id) {
        const roomId = response.room_id;

        setLocalMessages((prevMessages) => {
          return prevMessages.map((msg) => {
            if (msg.room_id === roomId && msg.from === loggedInUser) {
              return {
                ...msg,
                read: Array.isArray(msg.read)
                  ? [...new Set([...msg.read, roomId])]
                  : typeof msg.read === "object" && msg.read !== null
                  ? {...msg.read, [roomId]: true}
                  : [roomId],
                read_at: msg.read_at || new Date().toISOString(),
              };
            }
            return msg;
          });
        });
      }
    };

    socket.on("room history", handleRoomHistory);
    socket.on("chat message", handleReceiveMessage);
    socket.on("message.read", handleMessageRead);

    return () => {
      socket.off("room history", handleRoomHistory);
      socket.off("chat message", handleReceiveMessage);
      socket.off("message.read", handleMessageRead);
    };
  }, [
    socket,
    conversation?.id,
    deduplicateMessages,
    loggedInUser,
    userId,
    pagination.isLoadingMore,
  ]);

  useEffect(() => {
    if (!socket || !conversation?.id || !userId) return;

    setLocalMessages([]);
    prevMessageCountRef.current = 0;
    isInitialLoadRef.current = true;
    isLoadingPaginationRef.current = false;

    setPagination({
      limit: 20,
      offset: 0,
      hasMoreMessages: true,
      isLoadingMore: false,
    });

    socket.emit("join room", {
      room_id: conversation.id,
      row_id: userId,
      limit: 20,
      offset: 0,
    });
    socket.emit("presence:get", {row_id: conversation.to_row_id});
  }, [socket, conversation?.id, userId]);

  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentGroup = [];
    let currentDate = null;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.timestamp).toDateString();

      if (currentDate !== messageDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: currentGroup,
          });
        }
        currentGroup = [message];
        currentDate = messageDate;
      } else {
        currentGroup.push(message);
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

  const messageGroups = groupMessagesByDate(localMessages);

  useEffect(() => {
    if (!socket || !conversation?.id || !userId) {
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
    }, 3000);

    return () => {
      clearInterval(messageReadInterval);
    };
  }, [socket, conversation?.id, userId, isConnected]);

  if (!isConnected) {
    return (
      <div className={styles.messagesList}>
        <div className={styles.connectionStatus}>
          <div className={styles.statusIcon}>⚠️</div>
          <p>Connecting to chat server...</p>
        </div>
      </div>
    );
  }

  if (!conversation?.id) {
    return (
      <div className={styles.messagesList}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💬</div>
          <h3>Select a conversation</h3>
          <p>Choose a room to start chatting</p>
        </div>
      </div>
    );
  }

  if (localMessages.length === 0) {
    return (
      <div className={styles.messagesList}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💬</div>
          <h3>No messages yet</h3>
          <p>Start the conversation by sending a message</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.messagesList}
      ref={messagesContainerRef}
      onScroll={handleScroll}>
      <div className={styles.messagesContainer}>
        {pagination.isLoadingMore && (
          <div className={styles.loadingMore}>
            <div className={styles.loadingSpinner}>⏳</div>
            <span>Loading more messages...</span>
          </div>
        )}

        {messageGroups.map((group, groupIndex) => (
          <div key={`${group.date}-${groupIndex}`}>
            {group.messages.map((message, messageIndex) => {
              const currentTime = new Date(
                message.created_at
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const nextMessage =
                messageIndex < group.messages.length - 1
                  ? group.messages[messageIndex + 1]
                  : null;
              const nextTime = nextMessage
                ? new Date(nextMessage.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : null;

              const showTime =
                messageIndex === group.messages.length - 1 ||
                nextMessage?.from !== message.from ||
                currentTime !== nextTime;

              return (
                <MessageBubble
                  conversation={conversation}
                  rooms={rooms}
                  key={`${message.id || message._id || messageIndex}-${
                    message.type || "text"
                  }-${message.timestamp}`}
                  message={message}
                  isOwn={message.from === loggedInUser}
                  showTime={showTime}
                  showAvatar={
                    messageIndex === 0 ||
                    group.messages[messageIndex - 1].senderId !==
                      message.senderId
                  }
                  onReply={onReply}
                  allMessages={localMessages}
                />
              );
            })}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessagesList;
