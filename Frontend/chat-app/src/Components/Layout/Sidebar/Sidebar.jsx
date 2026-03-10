import useSidebar from "./hooks/useSidebar";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import ChatRow from "./components/ChatRow";

// ─── Sidebar ──────────────────────────────────────────────
// Pure layout shell. All logic lives in useSidebar().
//
// To add a new feature:
//   1. Add state/handler to hooks/useSidebar.js
//   2. Create a component in components/
//   3. Import both here and wire up

const Sidebar = () => {
  const {
    chats, loadingChats,
    selectedChat, setSelectedChat,
    user,
    searchResults,
    safeUnreadCounts,
    onlineUsers,
    search, setSearch, clearSearch,
    handleUserSelect,
  } = useSidebar();

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full flex-shrink-0">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-base">Messages</h2>
        </div>
        <SearchBar
          search={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={clearSearch}
        />
      </div>

      {/* ── Search Results (only when typing) ── */}
      {search && (
        <SearchResults
          results={searchResults}
          onUserSelect={handleUserSelect}
        />
      )}

      {/* ── Chat List ── */}
      <div className="flex-1 overflow-y-auto py-2">

        {/* Loading */}
        {loadingChats && (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loadingChats && chats?.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No chats yet</p>
            <p className="text-slate-600 text-xs mt-1">Search for someone to start!</p>
          </div>
        )}

        {/* Chat rows */}
        {!loadingChats && chats?.map((chat) => {
          const isSelected = selectedChat?._id?.toString() === chat._id?.toString();
          const unread = isSelected ? 0 : (safeUnreadCounts[chat._id?.toString()] || 0);

          return (
            <ChatRow
              key={chat._id}
              chat={chat}
              isSelected={isSelected}
              currentUserId={user?._id}
              unread={unread}
              onlineUsers={onlineUsers}
              onClick={() => setSelectedChat(chat)}
            />
          );
        })}

      </div>
    </div>
  );
};

export default Sidebar;