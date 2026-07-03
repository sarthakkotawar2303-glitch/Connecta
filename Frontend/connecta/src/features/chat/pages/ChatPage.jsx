import { useEffect } from "react";
import MenuSidebar from "../components/Navigation/MenuSidebar";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatArea from "../components/ChatArea/ChatArea";
import { useSocketEvents } from "../../../hooks/useSocketEvents";
import { useChatActions } from "../../../hooks/useChatActions";
import { useAuthContext } from "../../../context/AuthContext";
import { useChatContext } from "../../../context/ChatContext";

const ChatPage = () => {
  const { user } = useAuthContext();
  const { selectedChat } = useChatContext();
  const { fetchChats, fetchUnreadCounts } = useChatActions();

  // Run the Socket connection lifecycle & listeners binding
  useSocketEvents();

  // Load initial conversation lists & notifications
  useEffect(() => {
    if (user?.accessToken) {
      fetchChats();
      fetchUnreadCounts();
    }
  }, [user, fetchChats, fetchUnreadCounts]);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#121212] overflow-hidden pb-16 md:pb-0">
      <MenuSidebar />
      <div className="flex-1 flex flex-col md:flex-row md:gap-4 md:p-4 md:pl-0 h-full overflow-hidden relative">
        <div className={`w-full h-full md:w-80 md:flex-shrink-0 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          <Sidebar />
        </div>
        
        <div className={`w-full h-full flex-1 ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
          <ChatArea />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
