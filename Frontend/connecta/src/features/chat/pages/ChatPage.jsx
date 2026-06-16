import { useEffect } from "react";
import MenuSidebar from "../components/Navigation/MenuSidebar";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatArea from "../components/ChatArea/ChatArea";
import { useSocketEvents } from "../../../hooks/useSocketEvents";
import { useChatActions } from "../../../hooks/useChatActions";
import { useAuthContext } from "../../../context/AuthContext";

const ChatPage = () => {
  const { user } = useAuthContext();
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
    <div className="h-screen w-full flex bg-[#121212] overflow-hidden">
      <MenuSidebar />
      <div className="flex-1 flex gap-4 p-4 pl-0 h-full overflow-hidden">
        <Sidebar />
        <ChatArea />
      </div>
    </div>
  );
};

export default ChatPage;
