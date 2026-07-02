/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  
  const [typingInfo, setTypingInfo] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [deliveredMessages, setDeliveredMessages] = useState(new Set());
  
  const value = {
    chats, setChats,
    loadingChats, setLoadingChats,
    selectedChat, setSelectedChat,
    messages, setMessages,
    loadingMessages, setLoadingMessages,
    unreadCounts, setUnreadCounts,
    typingInfo, setTypingInfo,
    onlineUsers, setOnlineUsers,
    deliveredMessages, setDeliveredMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChatContext must be used within a ChatProvider");
  return context;
};
