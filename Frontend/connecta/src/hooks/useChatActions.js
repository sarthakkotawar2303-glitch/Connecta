import { useCallback } from "react";
import api from "../services/api";
import { socketService } from "../services/socket";
import { useChatContext } from "../context/ChatContext";
import { useAuthContext } from "../context/AuthContext";

export const useChatActions = () => {
  const { user, logoutUser } = useAuthContext();
  const {
    setChats,
    setLoadingChats,
    selectedChat, setSelectedChat,
    setMessages,
    setLoadingMessages,
    setUnreadCounts,
    setOnlineUsers,
  } = useChatContext();

  // ─── Chat Actions ──────────────────────────────────────────────────────────

  const fetchChats = useCallback(async () => {
    if (!user?.accessToken) return;
    try {
      setLoadingChats(true);
      const { data } = await api.get("/chat/all");
      setChats(data);

      const initialStatus = {};
      data.forEach((chat) => {
        chat.users.forEach((u) => {
          initialStatus[u._id] = { isOnline: u.isOnline, lastSeen: u.lastSeen };
        });
      });
      setOnlineUsers(initialStatus);
    } catch (error) {
      if (error?.response?.status === 401) {
        logoutUser();
      }
    } finally {
      setLoadingChats(false);
    }
  }, [user, setChats, setLoadingChats, setOnlineUsers, logoutUser]);

  const accessChat = useCallback(async (userId) => {
    if (!user?.accessToken || !userId) return;
    try {
      const { data } = await api.post("/chat/access", { userId });
      setSelectedChat(data);
      setChats((prev) => {
        const exists = prev.some((c) => c._id === data._id);
        return exists ? prev : [data, ...prev];
      });
    } catch (error) {
      console.error("accessChat:", error?.response?.data?.message);
    }
  }, [user, setSelectedChat, setChats]);

  const createGroupChat = useCallback(async (selectedUsers, chatName) => {
    if (!user?.accessToken) return;
    try {
      const { data } = await api.post("/chat/group", {
        chatName,
        users: selectedUsers.map((u) => u._id),
      });
      setChats((prev) => [data, ...prev]);
      setSelectedChat(data);
      return data;
    } catch (error) {
      console.error("createGroupChat:", error?.response?.data?.message);
    }
  }, [user, setChats, setSelectedChat]);

  const renameGroupChat = useCallback(async (chatId, chatName) => {
    if (!user?.accessToken) return;
    try {
      const { data } = await api.put("/chat/rename", { chatId, chatName });
      setChats((prev) => prev.map((c) => (c._id === chatId ? data : c)));
      if (selectedChat?._id === chatId) setSelectedChat(data);
      return data;
    } catch (error) {
      console.error("renameGroupChat:", error?.response?.data?.message);
    }
  }, [user, selectedChat, setChats, setSelectedChat]);

  const addToGroup = useCallback(async (chatId, userId) => {
    try {
      const { data } = await api.put("/chat/add", { chatId, userId });
      setChats((prev) => prev.map((c) => (c._id === chatId ? data : c)));
      if (selectedChat?._id === chatId) setSelectedChat(data);
      return data;
    } catch (error) {
      console.error("addToGroup:", error?.response?.data?.message);
    }
  }, [selectedChat, setChats, setSelectedChat]);

  const removeFromGroup = useCallback(async (chatId, userId) => {
    try {
      const { data } = await api.put("/chat/remove", { chatId, userId });
      setChats((prev) => prev.map((c) => (c._id === chatId ? data : c)));
      if (selectedChat?._id === chatId) setSelectedChat(data);
      return data;
    } catch (error) {
      console.error("removeFromGroup:", error?.response?.data?.message);
    }
  }, [selectedChat, setChats, setSelectedChat]);

  // ─── Message Actions ───────────────────────────────────────────────────────

  const fetchMessages = useCallback(async (chatId) => {
    if (!chatId) return;
    try {
      setLoadingMessages(true);
      const { data } = await api.get(`/message/${chatId}`);
      setMessages(data);
    } catch (error) {
      console.error("fetchMessages:", error?.response?.data?.message);
    } finally {
      setLoadingMessages(false);
    }
  }, [setMessages, setLoadingMessages]);

  const fetchUnreadCounts = useCallback(async () => {
    if (!user?.accessToken) return;
    try {
      const { data } = await api.get("/message/unread/counts");
      setUnreadCounts(data);
    } catch (error) {
      console.error("fetchUnreadCounts:", error?.response?.data?.message);
    }
  }, [user, setUnreadCounts]);

  const markAsRead = useCallback(async (chatId) => {
    if (!chatId) return;
    try {
      await api.put(`/message/read/${chatId}`);
      setUnreadCounts((prev) => {
        const updated = { ...prev };
        delete updated[chatId];
        return updated;
      });
      socketService.emit("mark read", { chatId, userId: user?._id });
    } catch (error) {
      console.error("markAsRead:", error?.response?.data?.message);
    }
  }, [user, setUnreadCounts]);

  const sendMessage = useCallback(async (chatId, content) => {
    if (!chatId || !content?.trim()) return;
    try {
      const { data } = await api.post("/message", { chatId, content });
      setMessages((prev) => [...prev, data]);
      setChats((prev) =>
        prev.map((c) => c._id === chatId ? { ...c, latestMessage: data } : c)
      );
      socketService.emit("new message", data);
    } catch (error) {
      console.error("sendMessage:", error?.response?.data?.message);
    }
  }, [setMessages, setChats]);

  const deleteMessage = useCallback(async (messageId, deleteForEveryone) => {
    try {
      const { data } = await api.delete(`/message/${messageId}`, {
        data: { deleteForEveryone },
      });

      if (deleteForEveryone) {
        setMessages((prev) => prev.map((m) => m._id === messageId ? data : m));
        setChats((prev) =>
          prev.map((c) =>
            c._id === (data.chat?._id || data.chat) ? { ...c, latestMessage: data } : c
          )
        );
        socketService.emit("message deleted", {
          message: data,
          chatId: data.chat?._id || data.chat,
        });
      } else {
        setMessages((prev) => prev.filter((m) => m._id !== messageId));
        fetchChats();
      }
    } catch (error) {
      console.error("deleteMessage:", error?.response?.data?.message);
    }
  }, [setMessages, setChats, fetchChats]);

  const editMessage = useCallback(async (messageId, content) => {
    try {
      const { data } = await api.put(`/message/${messageId}`, { content });
      setMessages((prev) => prev.map((m) => m._id === messageId ? data : m));
      setChats((prev) =>
        prev.map((c) =>
          c._id === (data.chat?._id || data.chat) ? { ...c, latestMessage: data } : c
        )
      );
      socketService.emit("message edited", {
        message: data,
        chatId: data.chat?._id || data.chat,
      });
      return data;
    } catch (error) {
      console.error("editMessage:", error?.response?.data?.message);
      throw error;
    }
  }, [setMessages, setChats]);

  // ─── Search Actions ────────────────────────────────────────────────────────

  const searchUsers = useCallback(async (keyword) => {
    if (!keyword?.trim()) return [];
    try {
      const { data } = await api.get(`/user/all?search=${keyword}`);
      return data;
    } catch (error) {
      console.error("searchUsers:", error?.response?.data?.message);
      return [];
    }
  }, []);

  // ─── Socket Room / Typing Actions ──────────────────────────────────────────

  const joinChat = useCallback((chatId) => {
    socketService.emit("join chat", chatId);
  }, []);

  const leaveChat = useCallback((chatId) => {
    socketService.emit("leave chat", chatId);
  }, []);

  const emitTyping = useCallback((chatId) => {
    socketService.emit("typing", { chatId, username: user?.username });
  }, [user]);

  const emitStopTyping = useCallback((chatId) => {
    socketService.emit("stop typing", { chatId });
  }, []);

  return {
    fetchChats,
    accessChat,
    createGroupChat,
    renameGroupChat,
    addToGroup,
    removeFromGroup,
    fetchMessages,
    fetchUnreadCounts,
    markAsRead,
    sendMessage,
    deleteMessage,
    editMessage,
    searchUsers,
    joinChat,
    leaveChat,
    emitTyping,
    emitStopTyping,
  };
};
