import ChatArea from "../Components/Chat/ChatArea";
import Navbar from "../Components/Layout/Navbar/Navbar";
import Sidebar from "../Components/Layout/Sidebar/Sidebar";


const ChatPage = () => {
  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ChatArea />
      </div>
    </div>
  );
};

export default ChatPage;