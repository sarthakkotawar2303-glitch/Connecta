import { Search, X } from "lucide-react";

const SearchBar = ({ search, onChange, onClear }) => (
  <div className="relative">
    <Search className="absolute left-3.5 top-3 w-4 h-4 text-secondary pointer-events-none" />

    <input
      type="text"
      placeholder="Search conversations..."
      value={search}
      onChange={onChange}
      className="w-full bg-[#121212]/40 border border-[#334155]/60 text-white placeholder-slate-400 pl-11 pr-10 py-2.5 rounded-xl text-xs focus:border-primary focus:ring-0 outline-none transition font-sans"
    />

    {search && (
      <button
        onClick={onClear}
        className="absolute right-3 top-3 text-secondary hover:text-on-surface transition cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default SearchBar;
