export const getChatName = (chat, currentUserId) => {
  if (!chat) return "";
  if (chat.isGroupChat) return chat.chatName || "Group Chat";
  const other = chat.users?.find(
    (u) => u._id?.toString() !== currentUserId?.toString()
  );
  return other?.username || "Unknown";
};

export const getChatPic = (chat, currentUserId) => {
  if (!chat || chat.isGroupChat) return null;
  const other = chat.users?.find(
    (u) => u._id?.toString() !== currentUserId?.toString()
  );
  return other?.pic || null;
};

export const getOtherUser = (chat, currentUserId) => {
  if (!chat || chat.isGroupChat) return null;
  return chat.users?.find(
    (u) => u._id?.toString() !== currentUserId?.toString()
  ) || null;
};

export const getLatestMsg = (chat, currentUserId) => {
  const msg = chat.latestMessage;
  if (!msg?.content) return "No messages yet";

  const senderId =
    typeof msg.sender === "object"
      ? msg.sender?._id?.toString()
      : msg.sender?.toString();
  const isMe = senderId === currentUserId?.toString();
  const senderName =
    typeof msg.sender === "object" ? msg.sender?.username : null;

  if (chat.isGroupChat) {
    if (isMe) return `You: ${msg.content}`;
    if (senderName) return `${senderName}: ${msg.content}`;
    return msg.content;
  }
  return isMe ? `You: ${msg.content}` : msg.content;
};

export const formatTime = (chat) => {
  const ts = chat.latestMessage?.createdAt;
  if (!ts) return "";
  const date = new Date(ts);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === now.toDateString())
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { weekday: "short" });
};

export const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const getAvatarBgColor = (name) => {
  if (!name) return "bg-[#007AFF] text-white";
  const normalized = name.toLowerCase();
  if (normalized.includes("alex")) return "bg-[#007AFF] text-white";
  if (normalized.includes("project")) return "bg-[#10B981] text-white";
  if (normalized.includes("sarah")) return "bg-[#F59E0B] text-white";

  const colors = [
    "bg-[#007AFF] text-white",       // Blue
    "bg-[#10B981] text-white",       // Green
    "bg-[#F59E0B] text-white",       // Orange
    "bg-indigo-500 text-white",      // Indigo
    "bg-rose-500 text-white",        // Rose
    "bg-teal-500 text-white",        // Teal
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
