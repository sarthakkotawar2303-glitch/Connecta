// ─── sidebarHelpers.js ────────────────────────────────────
// Pure functions — no React, no hooks.
// Import wherever needed without touching any component.

/**
 * Returns the display name for a chat.
 * Group → chatName | DM → other user's username
 */
export const getChatName = (chat, currentUserId) => {
  if (!chat) return "";
  if (chat.isGroupChat) return chat.chatName || "Group Chat";
  const other = chat.users?.find(
    (u) => u._id?.toString() !== currentUserId?.toString()
  );
  return other?.username || "Unknown";
};

/**
 * Returns the avatar pic URL for a DM (null for group chats).
 */
export const getChatPic = (chat, currentUserId) => {
  if (!chat || chat.isGroupChat) return null;
  const other = chat.users?.find(
    (u) => u._id?.toString() !== currentUserId?.toString()
  );
  return other?.pic || null;
};

/**
 * Returns the other participant object in a DM (null for group chats).
 */
export const getOtherUser = (chat, currentUserId) => {
  if (!chat || chat.isGroupChat) return null;
  return chat.users?.find(
    (u) => u._id?.toString() !== currentUserId?.toString()
  ) || null;
};

/**
 * Builds the latest message preview string shown in each chat row.
 * e.g. "You: hey!" | "Ali: hey!" | "hey!"
 */
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

/**
 * Formats the latest message timestamp as a short relative string.
 * e.g. "10:30 AM" | "Yesterday" | "Mon"
 */
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