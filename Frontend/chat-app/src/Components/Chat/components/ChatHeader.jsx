
import { formatLastSeen } from "./ChatHelpers";

const FALLBACK_AVATAR =
  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

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

  return (
    <div className="h-14 border-b border-slate-800 bg-slate-900 px-5 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mr-1 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Avatar */}
        {selectedChat.isGroupChat ? (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
        ) : (
          <div className="relative flex-shrink-0">
            <img
              src={chatPic || FALLBACK_AVATAR}
              alt=""
              className="w-9 h-9 rounded-full object-cover border border-slate-700"
            />
            {otherUserStatus?.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full" />
            )}
          </div>
        )}

        {/* Name + status */}
        <div>
          <p className="text-white font-semibold text-sm leading-tight">{chatName}</p>
          {someoneIsTyping ? (
            <p className="text-xs text-teal-400 animate-pulse">{typingInfo.username} is typing...</p>
          ) : selectedChat.isGroupChat ? (
            <p className="text-slate-500 text-xs">
              {selectedChat.users?.length || 0} members
              {groupOnlineCount > 0 && (
                <span className="text-green-400"> · {groupOnlineCount} online</span>
              )}
            </p>
          ) : (
            <p className={`text-xs ${otherUserStatus?.isOnline ? "text-green-400" : "text-slate-500"}`}>
              {otherUserStatus?.isOnline ? "Online" : formatLastSeen(otherUserStatus?.lastSeen)}
            </p>
          )}
        </div>
      </div>

      {/* Group Info toggle */}
      {selectedChat.isGroupChat && (
        <button
          onClick={onToggleInfo}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
            showInfo
              ? "bg-teal-600/20 border-teal-500/40 text-teal-300"
              : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {showInfo ? "Hide Info" : "Group Info"}
        </button>
      )}
    </div>
  );
};

export default ChatHeader;