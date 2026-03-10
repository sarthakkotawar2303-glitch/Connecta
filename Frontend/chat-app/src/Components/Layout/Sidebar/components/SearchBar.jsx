// ─── SearchBar ────────────────────────────────────────────
// The search input at the top of the sidebar.
// Shows a clear (✕) button when there's text.
//
// Props:
//   search      – controlled value
//   onChange    – input change handler
//   onClear     – clears the input

const SearchBar = ({ search, onChange, onClear }) => (
  <div className="relative">
    <svg
      className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none"
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>

    <input
      type="text"
      placeholder="Search people..."
      value={search}
      onChange={onChange}
      className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 pl-9 pr-9 py-2 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
    />

    {search && (
      <button
        onClick={onClear}
        className="absolute right-3 top-2.5 text-slate-500 hover:text-white transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

export default SearchBar;