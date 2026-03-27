import { formatRelativeTime } from "./ChatHelpers";
import MessageMenu from "./MessageMenu";
import MessageStatus from "./MessageStatus";



const FALLBACK_AVATAR =
  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

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

  const deletedForMe = msg.deletedFor?.some(
    (id) => id?.toString() === currentUserId?.toString()
  );
  const isHidden = deletedForMe || msg.isDeleted;

  const myCorners = samePrev ? "rounded-2xl rounded-tr-md" : sameNext ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-tr-md";
  const theirCorners = samePrev ? "rounded-2xl rounded-tl-md" : sameNext ? "rounded-2xl rounded-bl-md" : "rounded-2xl rounded-tl-md";

  return (
    <div
      className={`flex items-end gap-2 group ${isMe ? "justify-end" : "justify-start"} ${
        samePrev ? "mt-0.5" : "mt-4"
      }`}
    >
      {!isMe && (
        <div className="w-7 flex-shrink-0 self-end mb-0.5">
          {showAvatar && (
            <img
              src={msg.sender?.pic || FALLBACK_AVATAR}
              alt=""
              className="w-7 h-7 rounded-full object-cover border border-slate-700"
            />
          )}
        </div>
      )}

      <div className={`flex items-end gap-1 max-w-sm lg:max-w-md ${isMe ? "flex-row-reverse" : "flex-row"}`}>
        <MessageMenu
          msg={msg}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDeleteForMe={onDeleteForMe}
          onDeleteForEveryone={onDeleteForEveryone}
        />

        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
          {showName && (
            <p className="text-xs text-slate-400 mb-1 ml-1">{msg.sender?.username}</p>
          )}

          {isHidden ? (
            <div className="px-4 py-2.5 text-sm italic text-slate-500 bg-slate-800/50 border border-slate-700/50 rounded-2xl select-none">
              {msg.isDeleted ? "This message was deleted" : "You deleted this message"}
            </div>
          ) : (
            <div
              className={`relative px-4 py-2.5 text-sm break-words leading-relaxed ${
                isMe
                  ? `bg-teal-600 text-white ${myCorners}`
                  : `bg-slate-800 text-slate-100 border border-slate-700 ${theirCorners}`
              }`}
            >
              <span className="pr-16">{msg.content}</span>

              <span className="absolute bottom-1.5 right-2.5 flex items-center gap-1">
                {msg.isEdited && (
                  <span className={`text-[10px] leading-none italic ${isMe ? "text-teal-200/60" : "text-slate-500"}`}>
                    edited
                  </span>
                )}
                <span className={`text-[10px] leading-none ${isMe ? "text-teal-200/70" : "text-slate-500"}`}>
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