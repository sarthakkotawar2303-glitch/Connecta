import { useState, useEffect } from "react";
import { useChat } from "../../../../Context/ChatProvider";


const useSidebar = () => {
  const {
    chats, loadingChats,
    selectedChat, setSelectedChat,
    user,
    searchUsers, searchResults, setSearchResults,
    accessChat,
    unreadCounts,
    onlineUsers,
  } = useChat();

  const [search, setSearch] = useState("");

  // Debounced user search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) searchUsers?.(search);
      else setSearchResults([]);
    }, 400);
    return () => clearTimeout(delay);
  }, [search]);

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
    // data
    chats, loadingChats,
    selectedChat, setSelectedChat,
    user,
    searchResults,
    safeUnreadCounts,
    onlineUsers,
    // search
    search, setSearch, clearSearch,
    // handlers
    handleUserSelect,
  };
};

export default useSidebar;