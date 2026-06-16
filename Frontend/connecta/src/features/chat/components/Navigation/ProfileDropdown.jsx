import { useState } from "react";
import { LogOut } from "lucide-react";
import { getInitials, getAvatarBgColor } from "../../utils/sidebarHelpers";

const ProfileDropdown = ({ dropdownRef, profileOpen, setProfileOpen, user, onLogout }) => {
  const [imageError, setImageError] = useState(false);

  const isDefaultPic = !user?.pic || user.pic.includes("anonymous-avatar-icon");
  const useInitials = isDefaultPic || imageError;
  const initials = getInitials(user?.username);
  const avatarBg = getAvatarBgColor(user?.username);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setProfileOpen((p) => !p)}
        className="flex items-center justify-center hover:bg-slate-800 rounded-xl p-1 transition cursor-pointer"
      >
        {useInitials ? (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${avatarBg}`}>
            {initials}
          </div>
        ) : (
          <img
            src={user.pic}
            alt="profile"
            onError={() => setImageError(true)}
            className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow-sm"
          />
        )}
      </button>

      {profileOpen && (
        <div className="absolute left-14 bottom-0 w-48 bg-slate-900/95 backdrop-blur-xl border border-[#1e293b]/80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-left-3 duration-150">
          <div className="px-4 py-3.5 border-b border-slate-800/80">
            <p className="text-white font-semibold text-xs truncate">{user?.username}</p>
            <p className="text-slate-500 text-[10px] truncate mt-0.5">{user?.email}</p>
          </div>

          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-3 text-xs font-medium text-red-400 hover:bg-slate-850 hover:text-red-300 transition flex items-center gap-2.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
