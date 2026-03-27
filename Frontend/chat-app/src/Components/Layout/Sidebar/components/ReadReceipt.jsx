
const ReadReceipt = ({ chat, currentUserId }) => {
  const msg = chat.latestMessage;
  if (!msg) return null;

  const senderId =
    typeof msg.sender === "object"
      ? msg.sender?._id?.toString()
      : msg.sender?.toString();
  if (senderId !== currentUserId?.toString()) return null;

  const readByOthers = (msg.readBy || []).some(
    (id) => id?.toString() !== currentUserId?.toString()
  );

  if (readByOthers) {
    return (
      <span className="flex items-center flex-shrink-0" title="Read">
        <svg className="w-3.5 h-3.5 text-teal-400" viewBox="0 0 16 16" fill="currentColor">
          <path d="M1 8l4 4L14 3" stroke="currentColor" strokeWidth="1.8" fill="none"
            strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 8l4 4L14 3" stroke="currentColor" strokeWidth="1.8" fill="none"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        </svg>
      </span>
    );
  }

  return (
    <span className="flex items-center flex-shrink-0" title="Delivered">
      <svg className="w-3 h-3 text-slate-500" viewBox="0 0 16 16" fill="none">
        <path d="M2 8l4 4L14 3" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
};

export default ReadReceipt;