import { useState, useEffect } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { useChatContext } from "../../../context/ChatContext";
import { useChatActions } from "../../../hooks/useChatActions";

const useSidebar = () => {
  const { user } = useAuthContext();
  const {
    chats, loadingChats,
    selectedChat, setSelectedChat,
    unreadCounts,
    onlineUsers,
  } = useChatContext();

  const { searchUsers, accessChat } = useChatActions();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Debounced user search
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (search.trim()) {
        const results = await searchUsers?.(search);
        setSearchResults(results || []);
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [search, searchUsers]);

  const safeUnreadCounts = unreadCounts || {};

  const handleUserSelect = async (searchedUser) => {
    setSearch("");
    setSearchResults([]);
    await accessChat?.(searchedUser._id);
  };

  const clearSearch = () => {
    setSearch("");
    setSearchResults([]);
  };

  return {
    chats, loadingChats,
    selectedChat, setSelectedChat,
    user,
    searchResults,
    safeUnreadCounts,
    onlineUsers,
    search, setSearch, clearSearch,
    handleUserSelect,
  };
};

export default useSidebar;
