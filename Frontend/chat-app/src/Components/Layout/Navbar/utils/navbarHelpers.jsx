const FALLBACK_AVATAR =
  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";


export const getChatName = (chat, currentUserId) => {
  if (chat.isGroupChat) return chat.chatName || "Group Chat";
  const other = chat.users?.find(
    (u) => u._id?.toString() !== currentUserId?.toString()
  );
  return other?.username || "Unknown";
};


export const getChatPic = (chat, currentUserId) => {
  if (chat.isGroupChat) return null;
  const other = chat.users?.find(
    (u) => u._id?.toString() !== currentUserId?.toString()
  );
  return other?.pic || null;
};


export const getMessagePreview = (chat, currentUserId) => {
  const latestMsg = chat.latestMessage?.content || "";
  const sender = chat.latestMessage?.sender;
  const senderId =
    typeof sender === "object" ? sender?._id?.toString() : sender?.toString();
  const isMe = senderId === currentUserId?.toString();
  const senderName = typeof sender === "object" ? sender?.username : null;

  if (chat.isGroupChat) {
    if (isMe) return `You: ${latestMsg}`;
    if (senderName) return `${senderName}: ${latestMsg}`;
    return latestMsg;
  }
  return isMe ? `You: ${latestMsg}` : latestMsg;
};

export { FALLBACK_AVATAR };