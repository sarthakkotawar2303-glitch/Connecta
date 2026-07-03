import useSidebar from "../../hooks/useSidebar";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import ChatRow from "./ChatRow";

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
    <div className="w-full md:w-80 bg-[#1E293B] rounded-none md:rounded-2xl flex flex-col h-full flex-shrink-0 overflow-hidden shadow-xl border border-[#334155]/25">
      <div className="px-5 pt-5 pb-4 border-b border-[#334155]/30">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-white font-headline-md text-base font-bold tracking-wide">Recent Conversations</h2>
        </div>
        <SearchBar
          search={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={clearSearch}
        />
      </div>

      {/* Search Results (only when typing) */}
      {search && (
        <SearchResults
          results={searchResults}
          onUserSelect={handleUserSelect}
        />
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Loading */}
        {loadingChats && (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
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
