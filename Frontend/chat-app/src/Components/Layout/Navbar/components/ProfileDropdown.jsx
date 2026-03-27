import { FALLBACK_AVATAR } from "../utils/navbarHelpers";


const ProfileDropdown = ({ dropdownRef, profileOpen, setProfileOpen, user, onLogout }) => {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setProfileOpen((p) => !p)}
        className="flex items-center gap-2 hover:bg-slate-800 rounded-lg px-2 py-1 transition"
      >
        <img
          src={user?.pic || FALLBACK_AVATAR}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover border border-slate-600"
        />
        <span className="text-slate-300 text-sm hidden sm:block">{user?.username}</span>
        <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd" />
        </svg>
      </button>

      {profileOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-white font-medium text-sm">{user?.username}</p>
            <p className="text-slate-400 text-xs truncate">{user?.email}</p>
          </div>

          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;