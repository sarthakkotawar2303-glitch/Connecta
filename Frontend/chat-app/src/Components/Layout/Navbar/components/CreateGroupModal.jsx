import { FALLBACK_AVATAR } from "../utils/navbarHelpers";


const CreateGroupModal = ({
  groupName, setGroupName,
  search, setSearch,
  searchResults,
  selectedUsers,
  loading,
  onAddUser,
  onRemoveUser,
  onCreateGroup,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">Create Group Chat</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Group name */}
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">Group Name</label>
          <input
            placeholder="e.g. Team Alpha"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Member search */}
        <div className="mb-3">
          <label className="block text-sm text-slate-400 mb-1">Add Members</label>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Search results */}
        {searchResults?.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl mb-3 max-h-40 overflow-y-auto">
            {searchResults.map((u) => (
              <div
                key={u._id}
                onClick={() => onAddUser(u)}
                className="flex items-center gap-3 p-3 hover:bg-slate-700 cursor-pointer transition"
              >
                <img
                  src={u.pic || FALLBACK_AVATAR}
                  alt={u.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-white text-sm font-medium">{u.username}</p>
                  <p className="text-slate-400 text-xs">{u.email}</p>
                </div>
                <svg className="w-4 h-4 text-slate-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            ))}
          </div>
        )}

        {/* Selected user chips */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedUsers.map((u) => (
              <span
                key={u._id}
                onClick={() => onRemoveUser(u._id)}
                className="flex items-center gap-1 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs px-2.5 py-1 rounded-full cursor-pointer hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 transition"
              >
                {u.username}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            ))}
          </div>
        )}

        {/* Min members hint */}
        <p className="text-slate-500 text-xs mb-4">
          {selectedUsers.length}/2 minimum members selected
        </p>

        {/* Submit */}
        <button
          onClick={onCreateGroup}
          disabled={loading}
          className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
        >
          {loading
            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : "Create Group"}
        </button>
      </div>
    </div>
  );
};

export default CreateGroupModal;