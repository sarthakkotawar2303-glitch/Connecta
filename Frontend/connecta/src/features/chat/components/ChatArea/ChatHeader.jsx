import { MoreVertical, Search } from "lucide-react";
import { formatLastSeen } from "../../utils/chatHelpers";
import { getInitials, getAvatarBgColor } from "../../utils/sidebarHelpers";

const ChatHeader = ({
  selectedChat,
  otherUser,
  chatName,
  chatPic,
  typingInfo,
  onlineUsers,
  showInfo,
  onToggleInfo,
  onBack,
}) => {
  const someoneIsTyping = typingInfo && typingInfo.chatId === selectedChat._id;
  const otherUserStatus = !selectedChat.isGroupChat ? onlineUsers[otherUser?._id] : null;
  const groupOnlineCount = selectedChat.isGroupChat
    ? selectedChat.users?.filter((u) => onlineUsers[u._id]?.isOnline).length || 0
    : 0;

  const initials = getInitials(chatName);
  const avatarBg = getAvatarBgColor(chatName);

  return (
    <div className="h-16 border-b border-[#334155]/30 bg-[#1E293B] px-6 flex items-center justify-between flex-shrink-0 select-none font-sans">
      <div className="flex items-center gap-3">
        {/* Back button */}
        <button
          onClick={onBack}
          className="md:hidden mr-1 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-800 text-on-surface-variant hover:text-on-surface transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Avatar */}
        {selectedChat.isGroupChat ? (
          chatPic ? (
            <img
              src={chatPic}
              alt=""
              className="w-10 h-10 rounded-full object-cover border border-[#334155]/40 shadow-sm"
            />
          ) : (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${avatarBg}`}>
              {initials}
            </div>
          )
        ) : (
          <div className="relative flex-shrink-0">
            {chatPic ? (
              <img
                src={chatPic}
                alt=""
                className="w-10 h-10 rounded-full object-cover border border-[#334155]/40 shadow-sm"
              />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${avatarBg}`}>
                {initials}
              </div>
            )}
            {otherUserStatus?.isOnline && (
              <span className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 bg-green-500 border-2 border-[#1E293B] rounded-full" />
            )}
          </div>
        )}

        {/* Name + status */}
        <div>
          <p className="text-white font-headline-md text-sm font-semibold leading-tight">{chatName}</p>
          {someoneIsTyping ? (
            <p className="text-xs text-primary animate-pulse font-mono tracking-wide">typing...</p>
          ) : selectedChat.isGroupChat ? (
            <p className="text-slate-400 text-[10px] font-mono">
              {selectedChat.users?.length || 0} MEMBERS
              {groupOnlineCount > 0 && (
                <span className="text-green-500"> · {groupOnlineCount} ONLINE</span>
              )}
            </p>
          ) : (
            <p className={`text-[10px] flex items-center font-mono ${otherUserStatus?.isOnline ? "text-green-500" : "text-slate-400"}`}>
              {otherUserStatus?.isOnline && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>}
              {otherUserStatus?.isOnline ? "Active Now" : formatLastSeen(otherUserStatus?.lastSeen)}
            </p>
          )}
        </div>
      </div>

      {/* Header controls: Search & Icons */}
      <div className="flex items-center gap-6">
        {/* Search inside chat input */}
        <div className="hidden lg:flex items-center bg-[#121212]/40 border border-[#334155]/60 px-3 py-1.5 h-10 w-64 rounded-xl">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search in chat"
            className="bg-transparent border-none focus:outline-none text-xs w-full placeholder:text-slate-400 text-white font-sans"
          />
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <MoreVertical
            onClick={onToggleInfo}
            className={`w-5 h-5 cursor-pointer hover:text-primary transition-colors ${showInfo ? "text-primary" : ""}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
