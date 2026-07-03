import { useEffect, useRef } from "react";
import { socketService } from "../services/socket.js";
import { useAuthContext } from "../context/AuthContext.jsx";
import { useChatContext } from "../context/ChatContext.jsx";

const SOCKET_URL = import.meta.env.VITE_API_URL || "";

export const useSocketEvents = () => {
  const { user } = useAuthContext();
  const {
    selectedChat,
    setMessages,
    setChats,
    setUnreadCounts,
    setTypingInfo,
    setOnlineUsers,
    setDeliveredMessages,
  } = useChatContext();

  const selectedChatRef = useRef(null);

  // Keep ref synchronized with context state
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (!user?._id) return;

    socketService.connect(SOCKET_URL, user._id);

    const handleConnected = () => {};

    const handleMessageReceived = (newMessage) => {
      const currentChat = selectedChatRef.current;
      if (currentChat?._id === newMessage.chat?._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
      setChats((prev) =>
        prev.map((c) =>
          c._id === newMessage.chat?._id ? { ...c, latestMessage: newMessage } : c
        )
      );
    };

    const handleNotificationReceived = (newMessage) => {
      const currentChat = selectedChatRef.current;
      const chatId = newMessage.chat?._id;
      if (currentChat?._id !== chatId) {
        setUnreadCounts((prev) => ({ ...prev, [chatId]: (prev[chatId] || 0) + 1 }));
      }
      setChats((prev) =>
        prev.map((c) => c._id === chatId ? { ...c, latestMessage: newMessage } : c)
      );
    };

    const handleTyping = ({ chatId, username }) => {
      if (selectedChatRef.current?._id === chatId) {
        setTypingInfo({ chatId, username });
      }
    };

    const handleStopTyping = ({ chatId }) => {
      if (selectedChatRef.current?._id === chatId) setTypingInfo(null);
    };

    const handleUserOnline = ({ userId }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: { isOnline: true, lastSeen: null } }));
    };

    const handleUserOffline = ({ userId, lastSeen }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: { isOnline: false, lastSeen } }));
    };

    const handleMessagesRead = ({ chatId, userId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.chat?._id === chatId || m.chat === chatId
            ? { ...m, readBy: [...new Set([...(m.readBy || []), userId])] }
            : m
        )
      );
    };

    const handleMessageDeleted = ({ message }) => {
      setMessages((prev) => prev.map((m) => m._id === message._id ? message : m));
      setChats((prev) =>
        prev.map((c) =>
          c._id === message.chat?._id ? { ...c, latestMessage: message } : c
        )
      );
    };

    const handleMessageEdited = ({ message }) => {
      setMessages((prev) => prev.map((m) => m._id === message._id ? message : m));
      setChats((prev) =>
        prev.map((c) =>
          c._id === (message.chat?._id || message.chat) ? { ...c, latestMessage: message } : c
        )
      );
    };

    const handleMessageDelivered = ({ messageId }) => {
      setDeliveredMessages((prev) => {
        const next = new Set(prev);
        next.add(messageId);
        return next;
      });
    };

    // Attach listeners
    socketService.on("connected", handleConnected);
    socketService.on("message received", handleMessageReceived);
    socketService.on("notification received", handleNotificationReceived);
    socketService.on("typing", handleTyping);
    socketService.on("stop typing", handleStopTyping);
    socketService.on("user online", handleUserOnline);
    socketService.on("user offline", handleUserOffline);
    socketService.on("messages read", handleMessagesRead);
    socketService.on("message deleted", handleMessageDeleted);
    socketService.on("message edited", handleMessageEdited);
    socketService.on("message delivered", handleMessageDelivered);

    return () => {
      // Detach listeners
      socketService.off("connected", handleConnected);
      socketService.off("message received", handleMessageReceived);
      socketService.off("notification received", handleNotificationReceived);
      socketService.off("typing", handleTyping);
      socketService.off("stop typing", handleStopTyping);
      socketService.off("user online", handleUserOnline);
      socketService.off("user offline", handleUserOffline);
      socketService.off("messages read", handleMessagesRead);
      socketService.off("message deleted", handleMessageDeleted);
      socketService.off("message edited", handleMessageEdited);
      socketService.off("message delivered", handleMessageDelivered);

      socketService.disconnect();
    };
  }, [user?._id, setMessages, setChats, setUnreadCounts, setTypingInfo, setOnlineUsers, setDeliveredMessages]);
};
