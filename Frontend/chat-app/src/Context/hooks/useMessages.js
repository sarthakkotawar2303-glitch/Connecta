import { useState, useCallback } from "react";
import axiosInstance from "../../Utils/AxiosConfig";

const useMessages = (user, socketRef) => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});

  // fetch all messages for a chat
  const fetchMessages = useCallback(async (chatId) => {
    if (!chatId) return;
    try {
      setLoadingMessages(true);
      const { data } = await axiosInstance.get(`/message/${chatId}`);
      setMessages(data);
    } catch (error) {
      console.error("fetchMessages:", error?.response?.data?.message);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // fetch unread counts for sidebar badges
  const fetchUnreadCounts = useCallback(async () => {
    if (!user?.accessToken) return;
    try {
      const { data } = await axiosInstance.get("/message/unread/counts");
      setUnreadCounts(data);
    } catch (error) {
      console.error("fetchUnreadCounts:", error?.response?.data?.message);
    }
  }, [user]);

  // mark all messages in a chat as read
  const markAsRead = useCallback(async (chatId) => {
    if (!chatId) return;
    try {
      await axiosInstance.put(`/message/read/${chatId}`);
      setUnreadCounts((prev) => {
        const updated = { ...prev };
        delete updated[chatId];
        return updated;
      });
     
      socketRef.current?.emit("mark read", { chatId, userId: user?._id });
    } catch (error) {
      console.error("markAsRead:", error?.response?.data?.message);
    }
  }, [user?._id]);

  // send a new message
  const sendMessage = async (chatId, content, setChats) => {
    if (!chatId || !content?.trim()) return;
    try {
      const { data } = await axiosInstance.post("/message", { chatId, content });
      setMessages((prev) => [...prev, data]);
      

      setChats((prev) =>
        prev.map((c) => c._id === chatId ? { ...c, latestMessage: data } : c)
      );
      socketRef.current?.emit("new message", data);
    } catch (error) {
      console.error("sendMessage:", error?.response?.data?.message);
    }
  };

  // delete a message
  const deleteMessage = async (messageId, deleteForEveryone) => {
    try {
      const { data } = await axiosInstance.delete(`/message/${messageId}`, {
        data: { deleteForEveryone },
      });

    if(deleteForEveryone){
      setMessages((prev)=>prev.map((m)=>m._id===messageId?data:m))
      socketRef.current?.emit("message deleted", {
        message: data,
        chatId: data.chat?._id || data.chat,
      });
    }else{
      setMessages((prev)=>prev.filter((m)=>m._id!==messageId))
    }
      
    } catch (error) {
      console.error("deleteMessage:", error?.response?.data?.message);
    }
  };

  // edit a message
  const editMessage = async (messageId, content) => {
    try {
      const { data } = await axiosInstance.put(`/message/${messageId}`, { content });
      setMessages((prev) => prev.map((m) => m._id === messageId ? data : m));
      socketRef.current?.emit("message edited", {
        message: data,
        chatId: data.chat?._id || data.chat,
      });
      return data;
    } catch (error) {
      console.error("editMessage:", error?.response?.data?.message);
      throw error; // rethrow so ChatArea can catch 15min error
    }
  };

  return {
    messages, setMessages,
    loadingMessages,
    unreadCounts, setUnreadCounts,
    fetchMessages,
    fetchUnreadCounts,
    markAsRead,
    sendMessage,
    deleteMessage,
    editMessage,
  };
};

export default useMessages;