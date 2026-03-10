import ChatArea from "../Components/Chat/ChatArea";
import Navbar from "../Components/Layout/Navbar/Navbar";
import Sidebar from "../Components/Layout/Sidebar/Sidebar";

// ChatPage is just the layout shell.
// All data (messages, chats, selected chat) lives in ChatProvider.
const ChatPage = () => {
  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Top navigation bar */}
      <Navbar />

      {/* Main content: sidebar + chat area side by side */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ChatArea />
      </div>
    </div>
  );
};

export default ChatPage;