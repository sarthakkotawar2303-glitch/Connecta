import { useEffect, useState } from "react";
import { useChat } from "../../../Context/ChatProvider";
import { formatLastSeen } from "./Chathelpers ";

// ─── GroupInfoPanel ───────────────────────────────────────
// Right-side panel (group chats only).
// Lets the group admin rename the group, add / remove members.
// Regular members can only view the member list.

const FALLBACK_AVATAR =
  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

const GroupInfoPanel = ({ onClose }) => {
  const {
    selectedChat, user,
    renameGroupChat, addToGroup, removeFromGroup,
    searchUsers, searchResults, setSearchResults,
    onlineUsers,
  } = useChat();

  const [newName, setNewName] = useState(selectedChat?.chatName || "");
  const [memberSearch, setMemberSearch] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [addingUser, setAddingUser] = useState(null);
  const [removingUser, setRemovingUser] = useState(null);

  const isAdmin = selectedChat?.groupAdmin?._id === user?._id;

  // Debounced user search
  useEffect(() => {
    const t = setTimeout(() => {
      if (memberSearch.trim()) searchUsers?.(memberSearch);
      else setSearchResults([]);
    }, 400);
    return () => clearTimeout(t);
  }, [memberSearch]);

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

  // Filter out users already in the group from search results
  const memberIds = new Set(selectedChat?.users?.map((u) => u._id));
  const filteredResults = searchResults?.filter((u) => !memberIds.has(u._id));

  return (
    <div className="w-72 border-l border-slate-800 bg-slate-900 flex flex-col flex-shrink-0">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <h3 className="text-white font-semibold text-sm tracking-wide uppercase">Group Info</h3>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Rename (admin only) ── */}
        {isAdmin && (
          <div className="p-5 border-b border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Group Name</p>
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
                className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              />
              <button
                onClick={handleRename}
                disabled={renaming || !newName.trim()}
                className="px-3 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-lg text-sm transition font-medium"
              >
                {renaming ? "..." : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* ── Add member (admin only) ── */}
        {isAdmin && (
          <div className="p-5 border-b border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Add Member</p>
            <input
              placeholder="Search by name or email..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            />
            {filteredResults?.length > 0 && (
              <div className="mt-2 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
                {filteredResults.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => handleAddMember(u)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 cursor-pointer transition"
                  >
                    <img src={u.pic || FALLBACK_AVATAR} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <p className="text-white text-sm font-medium flex-1 truncate">{u.username}</p>
                    {addingUser === u._id ? (
                      <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Member list ── */}
        <div className="p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
            Members · {selectedChat?.users?.length || 0}
          </p>
          <div className="space-y-1">
            {selectedChat?.users?.map((u) => {
              const isCurrentUser = u._id === user?._id;
              const isGroupAdmin = selectedChat?.groupAdmin?._id === u._id;
              const memberOnline = onlineUsers[u._id]?.isOnline;

              return (
                <div key={u._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition group">
                  {/* Avatar with online dot */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={u.pic || FALLBACK_AVATAR}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    {memberOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full" />
                    )}
                  </div>

                  {/* Name + status */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {u.username}
                      {isCurrentUser && <span className="text-slate-500 font-normal"> (you)</span>}
                    </p>
                    {isGroupAdmin ? (
                      <p className="text-[11px] text-teal-400">Admin</p>
                    ) : memberOnline ? (
                      <p className="text-[10px] text-green-400">Online</p>
                    ) : onlineUsers[u._id]?.lastSeen ? (
                      <p className="text-[10px] text-slate-500">
                        {formatLastSeen(onlineUsers[u._id].lastSeen)}
                      </p>
                    ) : null}
                  </div>

                  {/* Remove button (admin only, not self, not other admin) */}
                  {isAdmin && !isCurrentUser && !isGroupAdmin && (
                    <button
                      onClick={() => handleRemoveMember(u._id)}
                      disabled={removingUser === u._id}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg hover:bg-red-500/20 flex items-center justify-center text-slate-500 hover:text-red-400 transition"
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
};

export default GroupInfoPanel;