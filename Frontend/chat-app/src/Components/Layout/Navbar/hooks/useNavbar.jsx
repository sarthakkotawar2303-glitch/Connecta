import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../../../Context/ChatProvider";


const useNavbar = () => {
  const {
    user, setUser, setChats, setSelectedChat,
    createGroupChat, searchUsers, searchResults, setSearchResults,
    unreadCounts, chats, markAsRead,
  } = useChat();

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const bellRef = useRef(null);

  const totalUnread = Object.values(unreadCounts || {}).reduce(
    (sum, n) => sum + (typeof n === "number" ? n : 0),
    0
  );

  const unreadChats = chats?.filter(
    (c) => (unreadCounts?.[c._id?.toString()] || 0) > 0
  ) || [];


  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target))
        setBellOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) searchUsers?.(search);
      else setSearchResults([]);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);


  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    setChats([]);
    setSelectedChat(null);
    navigate("/");
  };

  const handleBellChatClick = (chat) => {
    setSelectedChat(chat);
    markAsRead(chat._id);
    setBellOpen(false);
  };

  const handleAddUser = (u) => {
    if (selectedUsers.some((x) => x._id === u._id)) return;
    setSelectedUsers((prev) => [...prev, u]);
    setSearch("");
    setSearchResults([]);
  };

  const handleRemoveUser = (id) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return alert("Enter a group name");
    if (selectedUsers.length < 2) return alert("Add at least 2 users");
    setLoading(true);
    await createGroupChat(selectedUsers, groupName);
    setGroupName("");
    setSelectedUsers([]);
    setSearch("");
    setShowGroupModal(false);
    setLoading(false);
  };

  const closeModal = () => {
    setShowGroupModal(false);
    setGroupName("");
    setSelectedUsers([]);
    setSearch("");
    setSearchResults([]);
  };

  return {
    // data
    user, totalUnread, unreadChats, unreadCounts,
    searchResults,
    
    showGroupModal, setShowGroupModal,
    groupName, setGroupName,
    selectedUsers,
    search, setSearch,
    loading,
    
    profileOpen, setProfileOpen,
    bellOpen, setBellOpen,
  
    dropdownRef, bellRef,
    
    logoutHandler,
    handleBellChatClick,
    handleAddUser,
    handleRemoveUser,
    handleCreateGroup,
    closeModal,
  };
};

export default useNavbar;