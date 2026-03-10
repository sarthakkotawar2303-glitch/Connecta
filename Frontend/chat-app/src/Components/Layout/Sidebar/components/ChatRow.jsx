import ReadReceipt from "./ReadReceipt";
import { getChatName, getChatPic, getOtherUser, getLatestMsg, formatTime } from "../utils/sidebarHelpers";

const FALLBACK_AVATAR =
  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

// ─── ChatRow ──────────────────────────────────────────────
// A single row in the chat list.
// Renders avatar (with online/unread dot), name, timestamp,
// message preview, unread badge, and read receipt ticks.
//
// Props:
//   chat            – chat object
//   isSelected      – bool (highlights row in teal)
//   currentUserId   – logged-in user's _id
//   unread          – unread count for this chat (0 if selected)
//   onlineUsers     – { [userId]: { isOnline, lastSeen } }
//   onClick         – called when the row is clicked

const ChatRow = ({ chat, isSelected, currentUserId, unread, onlineUsers, onClick }) => {
  const pic = getChatPic(chat, currentUserId);
  const otherUser = getOtherUser(chat, currentUserId);
  const isOnline = !chat.isGroupChat && onlineUsers[otherUser?._id]?.isOnline;
  const hasUnread = unread > 0;
  const isRead = !hasUnread && !!chat.latestMessage;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition mx-2 rounded-xl mb-0.5 ${
        isSelected
          ? "bg-teal-600/20 border border-teal-500/30"
          : hasUnread
          ? "bg-slate-800/70 hover:bg-slate-800"
          : "hover:bg-slate-800/50"
      }`}
    >
      {/* ── Avatar ── */}
      <div className="relative flex-shrink-0">
        {chat.isGroupChat ? (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
        ) : (
          <img
            src={pic || FALLBACK_AVATAR}
            alt="avatar"
            className="w-11 h-11 rounded-full object-cover border border-slate-700"
          />
        )}

        {/* Online dot (only when no unread) */}
        {isOnline && !hasUnread && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
        )}
        {/* Unread dot (takes priority over online dot) */}
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-teal-500 border-2 border-slate-900 rounded-full" />
        )}
      </div>

      {/* ── Text ── */}
      <div className="flex-1 min-w-0">

        {/* Row 1: name + timestamp */}
        <div className="flex justify-between items-center gap-1">
          <p className={`text-sm truncate ${
            isSelected ? "text-teal-300 font-semibold"
            : hasUnread  ? "text-white font-semibold"
            : "text-slate-300 font-medium"
          }`}>
            {getChatName(chat, currentUserId)}
          </p>
          <span className={`text-[10px] flex-shrink-0 ${hasUnread ? "text-teal-400 font-medium" : "text-slate-600"}`}>
            {formatTime(chat)}
          </span>
        </div>

        {/* Row 2: message preview + badge/ticks */}
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <p className={`text-xs truncate flex-1 min-w-0 ${
            hasUnread ? "text-slate-200 font-medium" : "text-slate-500"
          }`}>
            {getLatestMsg(chat, currentUserId)}
          </p>

          <div className="flex items-center gap-1 flex-shrink-0">
            {hasUnread ? (
              <span className="bg-teal-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none">
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