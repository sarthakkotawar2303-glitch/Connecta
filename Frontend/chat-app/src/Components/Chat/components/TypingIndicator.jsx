// ─── TypingIndicator ─────────────────────────────────────
// Shows an animated "..." bubble when another user is typing.

const TypingIndicator = ({ username }) => (
  <div className="flex items-end gap-2 mt-3">
    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
      <span className="text-[10px] text-slate-400 font-medium">
        {username?.charAt(0)?.toUpperCase()}
      </span>
    </div>
    <div className="flex flex-col items-start">
      <p className="text-[10px] text-slate-500 mb-1 ml-1">{username} is typing</p>
      <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default TypingIndicator;