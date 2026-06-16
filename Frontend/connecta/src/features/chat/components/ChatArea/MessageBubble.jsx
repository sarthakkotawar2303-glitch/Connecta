import { formatRelativeTime } from "../../utils/chatHelpers";
import MessageMenu from "./MessageMenu";
import MessageStatus from "./MessageStatus";
import { getInitials, getAvatarBgColor } from "../../utils/sidebarHelpers";

const MessageBubble = ({
  msg,
  index,
  messages,
  currentUserId,
  isGroupChat,
  deliveredMessages,
  onEdit,
  onDeleteForMe,
  onDeleteForEveryone,
}) => {
  const isMe = msg.sender?._id === currentUserId;
  const prevMsg = messages[index - 1];
  const nextMsg = messages[index + 1];
  const samePrev = prevMsg?.sender?._id === msg.sender?._id;
  const sameNext = nextMsg?.sender?._id === msg.sender?._id;
  const showAvatar = !isMe && !sameNext;
  const showName = isGroupChat && !isMe && !samePrev;

  const deletedForMe = (msg.deleteFor || msg.deletedFor)?.some(
    (id) => id?.toString() === currentUserId?.toString()
  );
  const isHidden = deletedForMe || msg.isDeleted;

  return (
    <div
      className={`flex items-end gap-3 group font-sans ${isMe ? "justify-end" : "justify-start"} ${
        samePrev ? "mt-1" : "mt-4"
      }`}
    >
      {!isMe && (
        <div className="w-8 flex-shrink-0 self-end mb-0.5">
          {showAvatar && (
            (!msg.sender?.pic || msg.sender.pic.includes("anonymous-avatar-icon")) ? (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm ${getAvatarBgColor(msg.sender?.username || "Unknown")}`}>
                {getInitials(msg.sender?.username || "Unknown")}
              </div>
            ) : (
              <img
                src={msg.sender.pic}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-[#334155]/40 shadow-sm"
              />
            )
          )}
        </div>
      )}

      <div className={`flex items-end gap-1.5 max-w-sm lg:max-w-md ${isMe ? "flex-row-reverse" : "flex-row"}`}>
        <MessageMenu
          msg={msg}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDeleteForMe={onDeleteForMe}
          onDeleteForEveryone={onDeleteForEveryone}
        />

        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
          {showName && (
            <p className="text-xs text-on-surface-variant mb-1 ml-1 font-mono tracking-wide">{msg.sender?.username}</p>
          )}

          {isHidden ? (
            <div className="px-4 py-3 text-sm italic text-on-surface-variant bg-surface-container border border-outline-variant rounded-none select-none">
              {msg.isDeleted ? "This message was deleted" : "You deleted this message"}
            </div>
          ) : (
            <div
              className={`relative px-4 py-3.5 text-sm break-words leading-relaxed shadow-md ${
                isMe
                  ? `bg-[#007AFF] text-white rounded-2xl rounded-tr-none`
                  : `bg-[#1E293B] text-slate-100 border border-[#334155]/30 rounded-2xl rounded-tl-none`
              }`}
            >
              <span className="pr-16 text-body-md font-body-md">{msg.content}</span>

              <span className="absolute bottom-1.5 right-2.5 flex items-center gap-1">
                {msg.isEdited && (
                  <span className={`text-[9px] leading-none italic font-mono ${isMe ? "text-white/60" : "text-slate-400"}`}>
                    edited
                  </span>
                )}
                <span className={`text-[9px] leading-none font-mono ${isMe ? "text-white/70" : "text-slate-400"}`}>
                  {formatRelativeTime(msg.createdAt)}
                </span>
                {isMe && (
                  <MessageStatus
                    msg={msg}
                    currentUserId={currentUserId}
                    deliveredMessages={deliveredMessages}
                  />
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
