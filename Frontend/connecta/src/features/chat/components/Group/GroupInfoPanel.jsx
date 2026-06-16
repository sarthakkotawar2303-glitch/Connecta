import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { useAuthContext } from "../../../../context/AuthContext";
import { useChatContext } from "../../../../context/ChatContext";
import { useChatActions } from "../../../../hooks/useChatActions";
import { formatLastSeen } from "../../utils/chatHelpers";
import { getInitials, getAvatarBgColor } from "../../utils/sidebarHelpers";

const GroupInfoPanel = ({ onClose }) => {
  const { user } = useAuthContext();
  const { selectedChat, onlineUsers } = useChatContext();
  const { renameGroupChat, addToGroup, removeFromGroup, searchUsers, deleteMessage } = useChatActions();

  const [newName, setNewName] = useState(selectedChat?.chatName || "");
  const [memberSearch, setMemberSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [renaming, setRenaming] = useState(false);
  const [addingUser, setAddingUser] = useState(null);
  const [removingUser, setRemovingUser] = useState(null);

  const isAdmin = selectedChat?.groupAdmin?._id === user?._id;

  useEffect(() => {
    const t = setTimeout(async () => {
      if (memberSearch.trim()) {
        const results = await searchUsers?.(memberSearch);
        setSearchResults(results || []);
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [memberSearch, searchUsers]);

  const handleRename = async () => {
    if (!newName.trim() || newName === selectedChat?.chatName) return;
    setRenaming(true);
    await renameGroupChat(selectedChat._id, newName);
    setRenaming(false);
  };

  const handleAddMember = async (u) => {
    setAddingUser(u._id);
    setMemberSearch("");
    setSearchResults([]);
    await addToGroup(selectedChat._id, u._id);
    setAddingUser(null);
  };

  const handleRemoveMember = async (userId) => {
    setRemovingUser(userId);
    await removeFromGroup(selectedChat._id, userId);
    setRemovingUser(null);
  };

  const otherUser = selectedChat?.isGroupChat
    ? null
    : selectedChat?.users?.find((u) => u._id !== user?._id);

  if (selectedChat?.isGroupChat) {
    const memberIds = new Set(selectedChat?.users?.map((u) => u._id));
    const filteredResults = searchResults?.filter((u) => !memberIds.has(u._id));

    return (
      <div className="w-80 border-l border-outline-variant bg-surface-container-low flex flex-col flex-shrink-0 animate-in slide-in-from-right duration-200 select-none text-on-surface font-sans">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant">
          <h3 className="text-on-surface font-headline-sm text-xs tracking-wider uppercase">Group Info</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-none hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isAdmin && (
            <div className="p-5 border-b border-outline-variant">
              <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">Group Name</p>
              <div className="flex gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename()}
                  className="flex-1 bg-background border border-outline-variant text-on-surface placeholder-on-surface-variant px-3 py-2 rounded-none text-sm focus:ring-1 focus:ring-primary outline-none transition"
                />
                <button
                  onClick={handleRename}
                  disabled={renaming || !newName.trim()}
                  className="px-3 py-2 bg-primary hover:opacity-90 disabled:opacity-40 text-on-primary rounded-none text-sm transition font-medium cursor-pointer"
                >
                  {renaming ? "..." : "Save"}
                </button>
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="p-5 border-b border-outline-variant">
              <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">Add Member</p>
              <input
                placeholder="Search users..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full bg-background border border-outline-variant text-on-surface placeholder-on-surface-variant px-3 py-2 rounded-none text-sm focus:ring-1 focus:ring-primary outline-none transition"
              />
              {filteredResults?.length > 0 && (
                <div className="mt-2 bg-background border border-outline-variant rounded-none overflow-hidden max-h-40 overflow-y-auto">
                  {filteredResults.map((u) => (
                    <div
                      key={u._id}
                      onClick={() => handleAddMember(u)}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface-container-high cursor-pointer transition"
                    >
                      {(!u.pic || u.pic.includes("anonymous-avatar-icon")) ? (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[9px] shadow-sm ${getAvatarBgColor(u.username)}`}>
                          {getInitials(u.username)}
                        </div>
                      ) : (
                        <img src={u.pic} alt="" className="w-7 h-7 rounded-full object-cover border border-[#334155]/40" />
                      )}
                      <p className="text-on-surface text-sm font-medium flex-1 truncate">{u.username}</p>
                      {addingUser === u._id ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="p-5">
            <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mb-3">
              Members · {selectedChat?.users?.length || 0}
            </p>
            <div className="space-y-1">
              {selectedChat?.users?.map((u) => {
                const isCurrentUser = u._id === user?._id;
                const isGroupAdmin = selectedChat?.groupAdmin?._id === u._id;
                const memberOnline = onlineUsers[u._id]?.isOnline;

                return (
                  <div key={u._id} className="flex items-center gap-3 p-2 rounded-none hover:bg-surface-container-high/40 transition group">
                    <div className="relative flex-shrink-0">
                      {(!u.pic || u.pic.includes("anonymous-avatar-icon")) ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm ${getAvatarBgColor(u.username)}`}>
                          {getInitials(u.username)}
                        </div>
                      ) : (
                        <img
                          src={u.pic}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-[#334155]/40"
                        />
                      )}
                      {memberOnline && (
                        <span className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 bg-green-500 border-2 border-[#1E293B] rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-on-surface text-sm font-medium truncate">
                        {u.username}
                        {isCurrentUser && <span className="text-on-surface-variant font-normal"> (you)</span>}
                      </p>
                      {isGroupAdmin ? (
                        <p className="text-[11px] text-primary font-semibold font-mono">Admin</p>
                      ) : memberOnline ? (
                        <p className="text-[10px] text-green-500 font-mono">Online</p>
                      ) : onlineUsers[u._id]?.lastSeen ? (
                        <p className="text-[10px] text-on-surface-variant font-mono">
                          {formatLastSeen(onlineUsers[u._id].lastSeen)}
                        </p>
                      ) : null}
                    </div>

                    {isAdmin && !isCurrentUser && !isGroupAdmin && (
                      <button
                        onClick={() => handleRemoveMember(u._id)}
                        disabled={removingUser === u._id}
                        className="opacity-0 group-hover:opacity-100 w-6 h-6 hover:bg-red-500/20 flex items-center justify-center text-on-surface-variant hover:text-red-400 transition cursor-pointer"
                      >
                        {removingUser === u._id ? (
                          <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 1-to-1 User Profile Info Sidebar
  const otherUserOnline = onlineUsers[otherUser?._id]?.isOnline;

  return (
    <div className="w-80 border-l border-outline-variant bg-surface-container-low flex flex-col flex-shrink-0 animate-in slide-in-from-right duration-200 select-none text-on-surface font-sans">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
        <h3 className="text-on-surface font-label-sm text-xs tracking-wider uppercase">Contact Profile</h3>
        <button
          onClick={onClose}
          className="w-7 h-7 hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* User Card */}
        <div className="p-8 text-center border-b border-outline-variant/60">
          <div className="w-32 h-32 mx-auto mb-6 bg-slate-800 border border-[#334155]/40 flex items-center justify-center overflow-hidden rounded-full shadow-lg">
            {(!otherUser?.pic || otherUser.pic.includes("anonymous-avatar-icon")) ? (
              <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-3xl shadow-sm ${getAvatarBgColor(otherUser?.username || "Connecta User")}`}>
                {getInitials(otherUser?.username || "Connecta User")}
              </div>
            ) : (
              <img
                alt="profile"
                className="w-full h-full object-cover grayscale opacity-85 hover:grayscale-0 hover:opacity-100 rounded-full transition-all duration-200"
                src={otherUser.pic}
              />
            )}
          </div>
          <h3 className="font-headline-md text-headline-md text-white font-semibold">{otherUser?.username || "Connecta User"}</h3>
          <p className="font-label-md text-label-md text-on-surface-variant mt-1.5 flex items-center justify-center gap-1.5 font-mono">
            {otherUserOnline ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-green-400">Active Now</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
                <span>Offline</span>
              </>
            )}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Details */}
          <div>
            <h4 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mb-3.5">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center text-on-surface">
                <Mail className="w-4 h-4 text-on-surface-variant mr-3 flex-shrink-0" />
                <span className="text-body-md text-xs truncate select-text">{otherUser?.email}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GroupInfoPanel;
