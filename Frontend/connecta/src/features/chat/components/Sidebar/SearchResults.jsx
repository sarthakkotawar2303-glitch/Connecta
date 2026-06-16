import { getInitials, getAvatarBgColor } from "../../utils/sidebarHelpers";

const SearchResults = ({ results, onUserSelect }) => {
  if (!results?.length) {
    return (
      <div className="border-b border-slate-800 bg-slate-900/60 p-4 text-center">
        <p className="text-slate-500 text-xs font-medium">No results matched your search</p>
      </div>
    );
  }

  return (
    <div className="border-b border-slate-800 bg-slate-900/40">
      <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Search</p>
      <div className="max-h-52 overflow-y-auto divide-y divide-slate-800/20">
        {results.map((result) => {
          const isDefaultPic = !result.pic || result.pic.includes("anonymous-avatar-icon");
          const initials = getInitials(result.username);
          const avatarBg = getAvatarBgColor(result.username);

          return (
            <div
              key={result._id}
              onClick={() => onUserSelect(result)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-850 cursor-pointer transition duration-150"
            >
              {isDefaultPic ? (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm ${avatarBg}`}>
                  {initials}
                </div>
              ) : (
                <img
                  src={result.pic}
                  alt={result.username}
                  className="w-8 h-8 rounded-full object-cover border border-slate-800 shadow-sm"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-slate-100 text-xs font-semibold truncate leading-none">{result.username}</p>
                <p className="text-slate-500 text-[10px] truncate mt-1">{result.email}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
