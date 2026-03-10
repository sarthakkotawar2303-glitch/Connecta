import { getChatName, getChatPic, getMessagePreview, FALLBACK_AVATAR } from "../utils/navbarHelpers";

// ─── BellDropdown ─────────────────────────────────────────
// Notification bell button + dropdown list of unread chats.
//
// Props:
//   bellRef        – ref for outside-click detection (owned by useNavbar)
//   bellOpen       – boolean
//   setBellOpen    – toggle
//   totalUnread    – number shown on badge
//   unreadChats    – array of chat objects with unread messages
//   unreadCounts   – { [chatId]: number }
//   user           – current user
//   onChatClick    – called with a chat when user clicks a row

const GroupIcon = () => (
  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
  </svg>
);

const BellIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const BellDropdown = ({
  bellRef, bellOpen, setBellOpen,
  totalUnread, unreadChats, unreadCounts,
  user, onChatClick,
}) => {
  return (
    <div className="relative" ref={bellRef}>
      {/* Bell button */}
      <button
        onClick={() => setBellOpen((v) => !v)}
        className={`w-9 h-9 flex items-center justify-center rounded-lg transition ${
          bellOpen
            ? "bg-slate-700 text-white"
            : "hover:bg-slate-800 text-slate-400 hover:text-white"
        }`}
        title="Notifications"
      >
        <BellIcon className="w-5 h-5" />
      </button>

      {/* Unread badge */}
      {totalUnread > 0 && (
        <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none pointer-events-none">
          {totalUnread > 99 ? "99+" : totalUnread}
        </span>
      )}

      {/* Dropdown panel */}
      {bellOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">

          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <p className="text-white font-semibold text-sm">Notifications</p>
            {totalUnread > 0 && (
              <span className="bg-teal-500/20 text-teal-400 text-xs px-2 py-0.5 rounded-full font-medium">
                {totalUnread} unread
              </span>
            )}
          </div>

          {/* Empty state */}
          {unreadChats.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <BellIcon className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-slate-500 text-sm">All caught up!</p>
              <p className="text-slate-600 text-xs mt-0.5">No unread messages</p>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {unreadChats.map((chat) => {
                const count = unreadCounts?.[chat._id?.toString()] || 0;
                const pic = getChatPic(chat, user?._id);
                const name = getChatName(chat, user?._id);
                const preview = getMessagePreview(chat, user?._id);

                return (
                  <div
                    key={chat._id}
                    onClick={() => onChatClick(chat)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 cursor-pointer transition border-b border-slate-700/50 last:border-0"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {chat.isGroupChat ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                          <GroupIcon />
                        </div>
                      ) : (
                        <img
                          src={pic || FALLBACK_AVATAR}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-slate-600"
                        />
                      )}
                      {/* Count bubble */}
                      <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none">
                        {count > 99 ? "99+" : count}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{name}</p>
                      <p className="text-slate-400 text-xs truncate">{preview}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BellDropdown;