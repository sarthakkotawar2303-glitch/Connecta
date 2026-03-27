import {
  useState, createContext, useEffect,
  useContext, useRef,
} from "react";

import useSocket   from "./hooks/useSocket";
import useMessages from "./hooks/useMessages";
import useChats    from "./hooks/useChats";
import useSearch   from "./hooks/useSearch";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {


  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  const selectedChatRef = useRef(null);

  // ── search ──
  const search = useSearch();

  // ── chats ──
  const chats = useChats(user, setUser);

  const socketRef = useRef(null);
  const messages = useMessages(user, socketRef);

  const socket = useSocket(
    user,
    selectedChatRef,
    messages.setMessages,
    chats.setChats,
    messages.setUnreadCounts,
  );

  useEffect(() => {
    socketRef.current = socket.socketRef.current;
  });

  useEffect(() => {
    selectedChatRef.current = chats.selectedChat;
  }, [chats.selectedChat]);

  useEffect(() => {
    if (!chats.selectedChat?._id) {
      socket.setTypingInfo(null);
      messages.setMessages([]);
      return;
    }
    socket.joinChat(chats.selectedChat._id);
    messages.fetchMessages(chats.selectedChat._id);
    messages.markAsRead(chats.selectedChat._id);

    return () => {
      socket.leaveChat(chats.selectedChat._id);
    };
  }, [chats.selectedChat?._id]);

  useEffect(() => {
    if (user?.accessToken) {
      chats.fetchChats(socket.setOnlineUsers);
      messages.fetchUnreadCounts();
    }
  }, [user]);

  const sendMessage = (chatId, content) => {
    messages.sendMessage(chatId, content, chats.setChats);
  };

  const createGroupChat = (selectedUsers, chatName) => {
    chats.createGroupChat(selectedUsers, chatName, search.setSearchResults);
  };

  return (
    <ChatContext.Provider value={{
      // user
      user, setUser,

      // chats
      chats: chats.chats,
      setChats: chats.setChats,
      loadingChats: chats.loadingChats,
      selectedChat: chats.selectedChat,
      setSelectedChat: chats.setSelectedChat,
      fetchChats: () => chats.fetchChats(socket.setOnlineUsers),
      accessChat: chats.accessChat,
      createGroupChat,
      renameGroupChat: chats.renameGroupChat,
      addToGroup: chats.addToGroup,
      removeFromGroup: chats.removeFromGroup,

      // messages
      messages: messages.messages,
      setMessages: messages.setMessages,
      loadingMessages: messages.loadingMessages,
      unreadCounts: messages.unreadCounts,
      fetchMessages: messages.fetchMessages,
      fetchUnreadCounts: messages.fetchUnreadCounts,
      markAsRead: messages.markAsRead,
      sendMessage,
      deleteMessage: messages.deleteMessage,
      editMessage: messages.editMessage,

      // socket
      typingInfo: socket.typingInfo,
      onlineUsers: socket.onlineUsers,
      deliveredMessages: socket.deliveredMessages,
      emitTyping: socket.emitTyping,
      emitStopTyping: socket.emitStopTyping,

      // search
      searchResults: search.searchResults,
      setSearchResults: search.setSearchResults,
      searchUsers: search.searchUsers,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
export default ChatProvider;
