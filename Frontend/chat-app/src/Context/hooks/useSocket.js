import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const useSocket = (user, selectedChatRef, setMessages, setChats, setUnreadCounts) => {
  const socketRef = useRef(null);
  const [typingInfo, setTypingInfo] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [deliveredMessages, setDeliveredMessages] = useState(new Set());

  // ── connect socket when user logs in ──
  useEffect(() => {
    if (!user?._id) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.emit("setup", user._id);
    socket.on("connected", () => console.log("✅ Socket ready"));

    // ── new message received ──
    socket.on("message received", (newMessage) => {
      const currentChat = selectedChatRef.current;
      if (currentChat?._id === newMessage.chat?._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
      setChats((prev) =>
        prev.map((c) =>
          c._id === newMessage.chat?._id ? { ...c, latestMessage: newMessage } : c
        )
      );
    });

    // ── notification (unread badge) ──
    socket.on("notification received", (newMessage) => {
      const currentChat = selectedChatRef.current;
      const chatId = newMessage.chat?._id;
      if (currentChat?._id !== chatId) {
        setUnreadCounts((prev) => ({ ...prev, [chatId]: (prev[chatId] || 0) + 1 }));
      }
      setChats((prev) =>
        prev.map((c) => c._id === chatId ? { ...c, latestMessage: newMessage } : c)
      );
    });

    // ── typing indicators ──
    socket.on("typing", ({ chatId, username }) => {
      if (selectedChatRef.current?._id === chatId) {
        setTypingInfo({ chatId, username });
      }
    });
    socket.on("stop typing", ({ chatId }) => {
      if (selectedChatRef.current?._id === chatId) setTypingInfo(null);
    });

    // ── online/offline status ──
    socket.on("user online", ({ userId }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: { isOnline: true, lastSeen: null } }));
    });
    socket.on("user offline", ({ userId, lastSeen }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: { isOnline: false, lastSeen } }));
    });

    // ── messages read by other user ──
    socket.on("messages read", ({ chatId, userId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.chat?._id === chatId || m.chat === chatId
            ? { ...m, readBy: [...new Set([...(m.readBy || []), userId])] }
            : m
        )
      );
    });

    // ── message deleted broadcast ──
    socket.on("message deleted", ({ message }) => {
      setMessages((prev) => prev.map((m) => m._id === message._id ? message : m));
      setChats((prev) =>
        prev.map((c) =>
          c._id === message.chat?._id ? { ...c, latestMessage: message } : c
        )
      );
    });

    // ── message edited broadcast ──
    socket.on("message edited", ({ message }) => {
      setMessages((prev) => prev.map((m) => m._id === message._id ? message : m));
    });

    // ── delivery confirmation ──
    socket.on("message delivered", ({ messageId }) => {
      setDeliveredMessages((prev) => new Set([...prev, messageId]));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  // ── join/leave chat room ──
  const joinChat = useCallback((chatId) => {
    socketRef.current?.emit("join chat", chatId);
  }, []);

  const leaveChat = useCallback((chatId) => {
    socketRef.current?.emit("leave chat", chatId);
  }, []);

  // ── typing emitters ──
  const emitTyping = useCallback((chatId) => {
    socketRef.current?.emit("typing", { chatId, username: user?.username });
  }, [user?.username]);

  const emitStopTyping = useCallback((chatId) => {
    socketRef.current?.emit("stop typing", { chatId });
  }, []);

  return {
    socketRef,
    typingInfo, setTypingInfo,
    onlineUsers, setOnlineUsers,
    deliveredMessages,
    joinChat,
    leaveChat,
    emitTyping,
    emitStopTyping,
  };
};

export default useSocket; 