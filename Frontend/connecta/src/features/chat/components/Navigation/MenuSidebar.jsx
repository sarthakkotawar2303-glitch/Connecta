import { MessageSquare, Plus } from "lucide-react";
import useNavbar from "../../hooks/useNavbar";
import BellDropdown from "./BellDropdown";
import ProfileDropdown from "./ProfileDropdown";
import CreateGroupModal from "../Group/CreateGroupModal";

const MenuSidebar = () => {
  const {
    user, totalUnread, unreadChats, unreadCounts, searchResults,
    showGroupModal, setShowGroupModal,
    groupName, setGroupName,
    selectedUsers,
    search, setSearch,
    loading,
    profileOpen, setProfileOpen,
    bellOpen, setBellOpen,
    dropdownRef, bellRef,
    logoutHandler,
    handleBellChatClick,
    handleAddUser,
    handleRemoveUser,
    handleCreateGroup,
    closeModal,
  } = useNavbar();

  return (
    <>
      <aside className="flex md:flex-col h-16 md:h-screen w-full md:w-20 bg-[#121212] border-t md:border-t-0 md:border-r border-[#1e293b]/50 flex-shrink-0 select-none items-center justify-around md:justify-between fixed bottom-0 left-0 right-0 md:relative z-50 md:z-auto px-4 md:px-0 md:py-6">
        <div className="flex flex-row md:flex-col items-center w-auto md:w-full">
          {/* Brand Header */}
          <div className="hidden md:flex flex-col items-center mb-8">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg">
              <svg viewBox="0 0 100 100" className="w-6 h-6 text-on-primary">
                <line x1="50" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="8" />
                <line x1="50" y1="50" x2="78.5" y2="40.7" stroke="currentColor" strokeWidth="8" />
                <line x1="50" y1="50" x2="67.6" y2="74.3" stroke="currentColor" strokeWidth="8" />
                <line x1="50" y1="50" x2="32.4" y2="74.3" stroke="currentColor" strokeWidth="8" />
                <line x1="50" y1="50" x2="21.5" y2="40.7" stroke="currentColor" strokeWidth="8" />
                <circle cx="50" cy="50" r="14" fill="#007AFF" stroke="currentColor" strokeWidth="8" />
                <circle cx="50" cy="20" r="8" fill="#007AFF" stroke="currentColor" strokeWidth="8" />
                <circle cx="78.5" cy="40.7" r="8" fill="#007AFF" stroke="currentColor" strokeWidth="8" />
                <circle cx="67.6" cy="74.3" r="8" fill="#007AFF" stroke="currentColor" strokeWidth="8" />
                <circle cx="32.4" cy="74.3" r="8" fill="#007AFF" stroke="currentColor" strokeWidth="8" />
                <circle cx="21.5" cy="40.7" r="8" fill="#007AFF" stroke="currentColor" strokeWidth="8" />
              </svg>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="w-auto md:w-full">
            <ul className="flex flex-row md:flex-col items-center gap-6">
              {/* Chat (Active) */}
              <li className="flex flex-col items-center cursor-pointer group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary text-on-primary flex items-center justify-center rounded-xl md:rounded-2xl shadow-md transition-all duration-200">
                  <MessageSquare className="w-5 h-5 md:w-5.5 md:h-5.5 fill-current" />
                </div>
                <span className="hidden md:block text-[11px] mt-1.5 font-medium text-white tracking-wide">Chat</span>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="flex flex-row md:flex-col items-center gap-4 md:gap-5 md:pt-5 md:border-t border-[#1e293b]/40 w-auto md:w-full">
          {/* Bell Dropdown wrapper */}
          <div className="relative">
            <BellDropdown
              bellRef={bellRef}
              bellOpen={bellOpen}
              setBellOpen={setBellOpen}
              totalUnread={totalUnread}
              unreadChats={unreadChats}
              unreadCounts={unreadCounts}
              user={user}
              onChatClick={handleBellChatClick}
            />
          </div>

          {/* New Group Trigger */}
          <button
            onClick={() => setShowGroupModal(true)}
            title="Create New Group"
            className="w-9 h-9 bg-slate-800 hover:bg-primary text-slate-400 hover:text-white rounded-xl border border-[#1e293b]/50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
          </button>

          {/* Profile Dropdown wrapper */}
          <div className="relative">
            <ProfileDropdown
              dropdownRef={dropdownRef}
              profileOpen={profileOpen}
              setProfileOpen={setProfileOpen}
              user={user}
              onLogout={logoutHandler}
            />
          </div>
        </div>
      </aside>

      {showGroupModal && (
        <CreateGroupModal
          groupName={groupName}
          setGroupName={setGroupName}
          search={search}
          setSearch={setSearch}
          searchResults={searchResults}
          selectedUsers={selectedUsers}
          loading={loading}
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
          onCreateGroup={handleCreateGroup}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default MenuSidebar;
