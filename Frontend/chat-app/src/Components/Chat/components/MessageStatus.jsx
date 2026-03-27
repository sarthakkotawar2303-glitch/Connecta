

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const MessageStatus = ({ msg, currentUserId, deliveredMessages }) => {
  const readBy = msg.readBy || [];
  const seen = readBy.some((id) => id?.toString() !== currentUserId?.toString());
  const delivered = deliveredMessages?.has(msg._id);

  if (seen)
    return (
      <span className="flex items-center gap-0.5 flex-shrink-0" title="Seen">
        <CheckIcon className="w-3.5 h-3.5 text-teal-300" />
        <CheckIcon className="w-3.5 h-3.5 text-teal-300 -ml-2" />
      </span>
    );

  if (delivered)
    return (
      <span className="flex items-center gap-0.5 flex-shrink-0" title="Delivered">
        <CheckIcon className="w-3.5 h-3.5 text-slate-400" />
        <CheckIcon className="w-3.5 h-3.5 text-slate-400 -ml-2" />
      </span>
    );

  return (
    <span className="flex items-center flex-shrink-0" title="Sent">
      <CheckIcon className="w-3.5 h-3.5 text-slate-400" />
    </span>
  );
};

export default MessageStatus;