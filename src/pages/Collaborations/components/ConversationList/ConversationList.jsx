import React, {useEffect, useState} from "react";
import {useChat} from "../../context/ChatContext";
import ConversationItem from "../ConversationItem/ConversationItem";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./ConversationList.module.scss";
import {Button, Flex, Box} from "@chakra-ui/react";
import AddingChat from "./AddingChat";

const ConversationList = ({
  rooms = [],
  setConversation,
  isConnected,
  setIsAddRoomOpen = () => {},
}) => {
  const {
    selectedConversationId,
    selectConversation,
    searchQuery,
    setSearchQuery,
    isEditing,
  } = useChat();

  const getFilteredRooms = () => {
    return (
      rooms?.filter((room) =>
        room?.to_name?.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    );
  };

  const filteredRooms = getFilteredRooms();

  return (
    <div className={styles.conversationList}>
      <Flex p="9px 16px 9px 11px" gap="8px">
        <AddingChat setIsAddRoomOpen={setIsAddRoomOpen} />
        <SearchBar
          p="0"
          width="100%"
          value={searchQuery}
          onSearch={setSearchQuery}
          inputBorderRadius="25px"
          showKeyboardShortcut={false}
        />
      </Flex>

      <div className={styles.conversations}>
        {filteredRooms?.length > 0 ? (
          filteredRooms.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={conversation.id === selectedConversationId}
              onClick={() => {
                selectConversation(conversation.id);
                setConversation(conversation);
              }}
              isEditing={isEditing}
              isConnected={isConnected}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <p className={styles.emptyMessage}>
              {searchQuery ? "No chats found" : "No chats yet"}
            </p>
            <p className={styles.emptySubMessage}>
              {searchQuery
                ? "Try a different search term"
                : "Start a new conversation"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
