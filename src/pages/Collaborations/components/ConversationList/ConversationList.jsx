import React, {useState, useEffect} from "react";
import {useChat} from "../../context/ChatContext";
import ConversationItem from "../ConversationItem/ConversationItem";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./ConversationList.module.scss";
import {
  Button,
  Flex,
  Box,
  Text,
  Badge,
  Tabs,
  TabList,
  Tab,
  Spinner,
} from "@chakra-ui/react";
import {useLocation} from "react-router-dom";

const ConversationList = ({
  rooms = [],
  setConversation,
  isConnected,
  setIsAddRoomOpen = () => {},
  onTabChange = () => {},
  isLoading = false,
}) => {
  const {
    selectedConversationId,
    selectConversation,
    searchQuery,
    setSearchQuery,
    isEditing,
  } = useChat();

  const [activeTab, setActiveTab] = useState(0);
  const {state: locationState} = useLocation();
  useEffect(() => {
    if (locationState?.tab) {
      setActiveTab(locationState?.tab);
    }
  }, [locationState?.tab]);

  const totalUnreadCount = rooms.reduce((sum, room) => {
    return sum + (room?.unread_message_count || 0);
  }, 0);

  const getFilteredRooms = () => {
    let filtered = rooms || [];

    if (searchQuery) {
      filtered = filtered.filter((room) =>
        room?.to_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredRooms = getFilteredRooms();

  const handleTabChange = (index) => {
    setActiveTab(index);
    let type = null;

    if (index === 0) {
      type = "single";
    } else if (index === 1) {
      type = "group";
    }

    if (onTabChange) {
      onTabChange(type);
    }
  };

  return (
    <div className={styles.conversationList}>
      <Box className={styles.header}>
        <Flex
          p="16px 20px 12px"
          justifyContent="space-between"
          alignItems="center">
          <Flex alignItems="center" gap="8px">
            <Text fontSize="20px" fontWeight="600" color="#000000">
              Collaboration
            </Text>
            {totalUnreadCount > 0 && (
              <Badge
                bg="#EF6820"
                color="white"
                borderRadius="full"
                px="8px"
                py="2px"
                fontSize="12px"
                fontWeight="600">
                {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
              </Badge>
            )}
          </Flex>
          <Button
            variant="ghost"
            p="8px"
            minW="auto"
            border="1px solid #E9EAED"
            h="auto"
            borderRadius="8px"
            _hover={{bg: "#F8F9FA"}}
            onClick={() => setIsAddRoomOpen(true)}>
            <img src="/img/chatNewChat.svg" alt="add" />
          </Button>
        </Flex>

        <Box p="12px 20px 0px" bg="#fff">
          <SearchBar
            p="0"
            width="100%"
            value={searchQuery}
            onSearch={setSearchQuery}
            inputBorderRadius="8px"
            showKeyboardShortcut={true}
          />
        </Box>

        <Tabs index={activeTab} onChange={handleTabChange} variant="unstyled">
          <TabList px="20px" gap="0">
            <Tab
              _selected={{
                color: "#EF6820",
                borderBottom: "2px solid #EF6820",
              }}
              color="#6B7280"
              fontWeight="600"
              fontSize="12px"
              px="0"
              py="12px"
              mr="24px">
              Direct Messages
            </Tab>
            <Tab
              _selected={{
                color: "#EF6820",
                borderBottom: "2px solid #EF6820",
              }}
              color="#6B7280"
              fontWeight="600"
              fontSize="12px"
              px="0"
              py="12px"
              mr="24px">
              Load Messages
            </Tab>
          </TabList>
        </Tabs>
      </Box>

      {isLoading ? (
        <Flex
          className={styles.conversations}
          align="center"
          justify="center"
          direction="column"
          gap="8px"
          color="#6B7280">
          <Spinner size="md" color="#EF6820" thickness="4px" />
          <Text fontWeight="500" fontSize="14px">
            Refreshing conversations...
          </Text>
        </Flex>
      ) : (
        <div className={styles.conversations}>
          {filteredRooms?.length > 0 ? (
            filteredRooms.map((conversation, index) => (
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
      )}
    </div>
  );
};

export default ConversationList;
