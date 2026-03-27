const FALLBACK_AVATAR =
  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";



const SearchResults = ({ results, onUserSelect }) => {
  if (!results?.length) {
    return (
      <div className="border-b border-slate-800">
        <p className="px-4 py-3 text-slate-500 text-sm">No users found</p>
      </div>
    );
  }

  return (
    <div className="border-b border-slate-800">
      <p className="px-4 py-2 text-xs text-slate-500 uppercase tracking-wider">People</p>
      <div className="max-h-52 overflow-y-auto">
        {results.map((result) => (
          <div
            key={result._id}
            onClick={() => onUserSelect(result)}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800 cursor-pointer transition"
          >
            <img
              src={result.pic || FALLBACK_AVATAR}
              alt={result.username}
              className="w-9 h-9 rounded-full object-cover border border-slate-700"
            />
            <div>
              <p className="text-white text-sm font-medium">{result.username}</p>
              <p className="text-slate-400 text-xs truncate">{result.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;