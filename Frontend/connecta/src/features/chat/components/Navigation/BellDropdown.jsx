import { Bell, Users, MessageSquare } from "lucide-react";
import { getChatName, getChatPic, getMessagePreview, FALLBACK_AVATAR } from "../../utils/navbarHelpers";

const BellDropdown = ({
  bellRef,
  bellOpen,
  setBellOpen,
  totalUnread,
  unreadChats,
  unreadCounts,
  user,
  onChatClick,
}) => {
  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setBellOpen((v) => !v)}
        className={`w-9 h-9 flex items-center justify-center rounded-xl transition duration-150 cursor-pointer relative ${
          bellOpen
            ? "bg-slate-800 text-white"
            : "hover:bg-slate-800 text-slate-400 hover:text-white"
        }`}
        title="Notifications"
      >
        <Bell className="w-4.5 h-4.5" />
        {totalUnread > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-sky-600 text-white text-[9px] font-bold min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center leading-none animate-pulse">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </button>

      {bellOpen && (
        <div className="absolute left-14 bottom-0 w-80 bg-slate-900/95 backdrop-blur-xl border border-[#1e293b]/80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-left-3 duration-150">
          <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
            <p className="text-white font-semibold text-xs uppercase tracking-wider">Notifications</p>
            {totalUnread > 0 && (
              <span className="bg-sky-500/10 text-sky-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {totalUnread} unread
              </span>
            )}
          </div>

          {unreadChats.length === 0 ? (
            <div className="px-4 py-8 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 bg-slate-850 rounded-full flex items-center justify-center mb-2 text-slate-600">
                <Bell className="w-4.5 h-4.5" />
              </div>
              <p className="text-slate-400 text-sm font-medium">All caught up!</p>
              <p className="text-slate-600 text-xs mt-0.5">No unread notifications</p>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/40">
              {unreadChats.map((chat) => {
                const count = unreadCounts?.[chat._id?.toString()] || 0;
                const pic = getChatPic(chat, user?._id);
                const name = getChatName(chat, user?._id);
                const preview = getMessagePreview(chat, user?._id);

                return (
                  <div
                    key={chat._id}
                    onClick={() => onChatClick(chat)}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-850 cursor-pointer transition"
                  >
                    <div className="relative flex-shrink-0">
                      {chat.isGroupChat ? (
                        <div className="w-9 h-9 rounded-full bg-sky-600 flex items-center justify-center shadow-md">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <img
                          src={pic || FALLBACK_AVATAR}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-sm"
                        />
                      )}
                      <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[9px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center leading-none border border-slate-900">
                        {count > 99 ? "99+" : count}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate leading-tight">{name}</p>
                      <p className="text-slate-500 text-[11px] truncate mt-0.5 leading-snug">{preview}</p>
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
