
export const canEdit = (msg) => {
  const ageInMinutes = (Date.now() - new Date(msg.createdAt)) / 1000 / 60;
  return ageInMinutes <= 15;
};

export const getOtherUser = (chat, currentUserId) => {
  if (!chat || chat.isGroupChat) return null;
  return chat.users?.find((u) => u._id !== currentUserId) || null;
};


export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return "Offline";
  const date = new Date(lastSeen);
  return `Last seen at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};


export const formatRelativeTime = (createdAt) => {
  if (!createdAt) return "";
  const now = new Date();
  const date = new Date(createdAt);
  const diffSec = Math.floor((now - date) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return "yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;
  return date.toLocaleDateString([], { day: "numeric", month: "short" });
};

