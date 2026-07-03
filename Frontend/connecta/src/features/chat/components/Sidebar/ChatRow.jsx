import { useState } from "react";
import ReadReceipt from "./ReadReceipt";
import { getChatName, getChatPic, getOtherUser, getLatestMsg, formatTime, getInitials, getAvatarBgColor } from "../../utils/sidebarHelpers";

const ChatRow = ({ chat, isSelected, currentUserId, unread, onlineUsers, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const pic = getChatPic(chat, currentUserId);
  const otherUser = getOtherUser(chat, currentUserId);
  const isOnline = !chat.isGroupChat && onlineUsers[otherUser?._id]?.isOnline;
  const hasUnread = unread > 0;
  const isRead = !hasUnread && !!chat.latestMessage;

  const chatName = getChatName(chat, currentUserId);
  const initials = getInitials(chatName);
  const avatarBg = getAvatarBgColor(chatName);
  
  const showInitials = !pic || pic.includes("anonymous-avatar-icon") || imgError;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3.5 px-4 py-3.5 cursor-pointer transition-all duration-150 rounded-xl font-sans mx-2 mb-1 ${
        isSelected
          ? "bg-[#334155]/60 shadow-sm"
          : hasUnread
          ? "bg-[#334155]/20 hover:bg-[#334155]/35"
          : "bg-transparent hover:bg-[#334155]/25"
      }`}
    >
      <div className="relative flex shrink-0">
        {!showInitials ? (
          <img
            src={pic}
            alt=""
            onError={() => setImgError(true)}
            className="w-10 h-10 rounded-full object-cover border border-[#334155]/40 shadow-sm"
          />
        ) : (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${avatarBg}`}>
            {initials}
          </div>
        )}

        {isOnline && !hasUnread && (
          <span className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 bg-green-500 border-2 border-[#1E293B] rounded-full" />
        )}
        
        {hasUnread && (
          <span className="absolute top-[-1px] right-[-1px] w-2.5 h-2.5 bg-primary border-2 border-[#1E293B] rounded-full animate-pulse" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-1">
          <p className={`text-xs font-semibold truncate leading-none ${
            isSelected ? "text-white font-bold"
            : hasUnread  ? "text-white font-bold"
            : "text-slate-200 font-medium"
          }`}>
            {chatName}
          </p>
          <span className={`text-[10px] flex-shrink-0 ${
            isSelected ? "text-slate-300"
            : hasUnread ? "text-primary font-semibold"
            : "text-slate-400"
          }`}>
            {formatTime(chat)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1 mt-1.5">
          <p className={`text-[11px] truncate flex-1 min-w-0 ${
            isSelected ? "text-slate-300"
            : hasUnread ? "text-slate-100 font-medium"
            : "text-slate-400"
          }`}>
            {getLatestMsg(chat, currentUserId)}
          </p>

          <div className="flex items-center gap-1 flex-shrink-0">
            {hasUnread ? (
              <span className="bg-primary text-on-primary text-[9px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center leading-none">
                {unread > 99 ? "99+" : unread}
              </span>
            ) : isRead ? (
              <ReadReceipt chat={chat} currentUserId={currentUserId} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRow;
