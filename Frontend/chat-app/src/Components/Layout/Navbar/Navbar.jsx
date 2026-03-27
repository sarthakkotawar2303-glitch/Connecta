import useNavbar from "./hooks/useNavbar";
import BellDropdown from "./components/BellDropdown";
import ProfileDropdown from "./components/ProfileDropdown";
import CreateGroupModal from "./components/CreateGroupModal";



const Navbar = () => {
  const {
    // data
    user, totalUnread, unreadChats, unreadCounts, searchResults,
    // group modal
    showGroupModal, setShowGroupModal,
    groupName, setGroupName,
    selectedUsers,
    search, setSearch,
    loading,
    // dropdowns
    profileOpen, setProfileOpen,
    bellOpen, setBellOpen,
    // refs
    dropdownRef, bellRef,
    // handlers
    logoutHandler,
    handleBellChatClick,
    handleAddUser,
    handleRemoveUser,
    handleCreateGroup,
    closeModal,
  } = useNavbar();

  return (
    <>
      <div className="h-20 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-5 flex-shrink-0">

       
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767A4 4 0 0015 13h2a2 2 0 002-2V9a2 2 0 00-2-2h-2z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Connecta</span>
        </div>
        

        <div className="flex items-center gap-3">

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

          <button
            onClick={() => setShowGroupModal(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-sm px-3 py-1.5 rounded-lg transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Group
          </button>

          <ProfileDropdown
            dropdownRef={dropdownRef}
            profileOpen={profileOpen}
            setProfileOpen={setProfileOpen}
            user={user}
            onLogout={logoutHandler}
          />

        </div>
      </div>

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

export default Navbar;