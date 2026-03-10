import { useState, useEffect } from "react";
import { useChat } from "../../../../Context/ChatProvider";

/**
 * useSidebar
 * ──────────
 * Owns ALL state and side-effects for the Sidebar.
 * Components stay pure — they only render what this hook gives them.
 */
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

  // Prevent crashes before API returns
  const safeUnreadCounts = unreadCounts || {};

  // Open (or create) a DM when a search result is clicked
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