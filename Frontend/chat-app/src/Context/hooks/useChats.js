import { useState, useCallback } from "react";
import axiosInstance from "../../Utils/AxiosConfig";

const useChats = (user, setUser) => {
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  // ── fetch all chats + seed online status ──
  const fetchChats = useCallback(async (setOnlineUsers) => {
    if (!user?.accessToken) return;
    try {
      setLoadingChats(true);
      const { data } = await axiosInstance.get("/chat/all");
      setChats(data);

      // seed online users from populated chat users
      const initialStatus = {};
      data.forEach((chat) => {
        chat.users.forEach((u) => {
          initialStatus[u._id] = { isOnline: u.isOnline, lastSeen: u.lastSeen };
        });
      });
      setOnlineUsers(initialStatus);
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("userInfo");
        setUser(null);
      }
    } finally {
      setLoadingChats(false);
    }
  }, [user]);

  // ── open or create a 1-on-1 chat ──
  const accessChat = async (userId) => {
    if (!user?.accessToken || !userId) return;
    try {
      const { data } = await axiosInstance.post("/chat/access", { userId });
      setSelectedChat(data);
      setChats((prev) => {
        const exists = prev.some((c) => c._id === data._id);
        return exists ? prev : [data, ...prev];
      });
    } catch (error) {
      console.error("accessChat:", error?.response?.data?.message);
    }
  };

  // ── create group ──
  const createGroupChat = async (selectedUsers, chatName, setSearchResults) => {
    if (!user?.accessToken) return;
    try {
      const { data } = await axiosInstance.post("/chat/group", {
        chatName,
        users: selectedUsers.map((u) => u._id),
      });
      setChats((prev) => [data, ...prev]);
      setSelectedChat(data);
      setSearchResults([]);
      return data;
    } catch (error) {
      console.error("createGroupChat:", error?.response?.data?.message);
    }
  };

  // ── rename group ──
  const renameGroupChat = async (chatId, chatName) => {
    if (!user?.accessToken) return;
    try {
      const { data } = await axiosInstance.put("/chat/rename", { chatId, chatName });
      setChats((prev) => prev.map((c) => (c._id === chatId ? data : c)));
      if (selectedChat?._id === chatId) setSelectedChat(data);
      return data;
    } catch (error) {
      console.error("renameGroupChat:", error?.response?.data?.message);
    }
  };

  // ── add member ──
  const addToGroup = async (chatId, userId) => {
    try {
      const { data } = await axiosInstance.put("/chat/add", { chatId, userId });
      setChats((prev) => prev.map((c) => (c._id === chatId ? data : c)));
      if (selectedChat?._id === chatId) setSelectedChat(data);
      return data;
    } catch (error) {
      console.error("addToGroup:", error?.response?.data?.message);
    }
  };

  // ── remove member ──
  const removeFromGroup = async (chatId, userId) => {
    try {
      const { data } = await axiosInstance.put("/chat/remove", { chatId, userId });
      setChats((prev) => prev.map((c) => (c._id === chatId ? data : c)));
      if (selectedChat?._id === chatId) setSelectedChat(data);
      return data;
    } catch (error) {
      console.error("removeFromGroup:", error?.response?.data?.message);
    }
  };

  return {
    chats, setChats,
    loadingChats,
    selectedChat, setSelectedChat,
    fetchChats,
    accessChat,
    createGroupChat,
    renameGroupChat,
    addToGroup,
    removeFromGroup,
  };
};

export default useChats;