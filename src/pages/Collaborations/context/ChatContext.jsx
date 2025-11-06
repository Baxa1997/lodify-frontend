import React, {createContext, useContext, useReducer} from "react";
import {mockConversations, mockMessages} from "../data/mockData";

const ChatContext = createContext();

const initialState = {
  conversations: mockConversations,
  messages: mockMessages,
  selectedConversationId: "katherine-moss",
  currentUser: {
    id: "current-user",
    name: "Olivia",
    avatar: "/img/avatars/olivia.jpg",
    isOnline: true,
  },
  typingUsers: [],
  searchQuery: "",
  isEditing: false,
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case "SELECT_CONVERSATION":
      return {
        ...state,
        selectedConversationId: action.payload.conversationId,
      };

    case "SEND_MESSAGE":
      const newMessage = {
        id: Date.now().toString(),
        conversationId: state.selectedConversationId,
        senderId: state.currentUser.id,
        content: action.payload.content,
        timestamp: new Date().toISOString(),
        type: "text",
        reactions: [],
      };

      return {
        ...state,
        messages: [...state.messages, newMessage],
        conversations: state.conversations.map((conv) =>
          conv.id === state.selectedConversationId
            ? {
                ...conv,
                lastMessage: action.payload.content,
                timestamp: newMessage.timestamp,
              }
            : conv
        ),
      };

    case "SET_TYPING":
      return {
        ...state,
        typingUsers: action.payload.isTyping
          ? [
              ...state.typingUsers.filter((id) => id !== action.payload.userId),
              action.payload.userId,
            ]
          : state.typingUsers.filter((id) => id !== action.payload.userId),
      };

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload.query,
      };

    case "TOGGLE_EDIT_MODE":
      return {
        ...state,
        isEditing: !state.isEditing,
      };

    default:
      return state;
  }
};

export const ChatProvider = ({children}) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const selectConversation = (conversationId) => {
    console.log("conversationIdconversationId", conversationId);
    dispatch({type: "SELECT_CONVERSATION", payload: {conversationId}});
  };

  const sendMessage = (content) => {
    dispatch({type: "SEND_MESSAGE", payload: {content}});
  };

  const addReaction = (messageId, emoji) => {
    dispatch({type: "ADD_REACTION", payload: {messageId, emoji}});
  };

  const setTyping = (userId, isTyping) => {
    dispatch({type: "SET_TYPING", payload: {userId, isTyping}});
  };

  const setSearchQuery = (query) => {
    dispatch({type: "SET_SEARCH_QUERY", payload: {query}});
  };

  const toggleEditMode = () => {
    dispatch({type: "TOGGLE_EDIT_MODE"});
  };

  const getCurrentConversation = () => {
    return state.conversations.find(
      (conv) => conv.id === state.selectedConversationId
    );
  };

  const getCurrentMessages = () => {
    return state.messages.filter(
      (msg) => msg.conversationId === state.selectedConversationId
    );
  };

  const getFilteredConversations = () => {
    if (!state.searchQuery) return state.conversations;

    return state.conversations.filter(
      (conv) =>
        conv.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  };

  const value = {
    ...state,
    selectConversation,
    sendMessage,
    addReaction,
    setTyping,
    setSearchQuery,
    toggleEditMode,
    getCurrentConversation,
    getCurrentMessages,
    getFilteredConversations,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
