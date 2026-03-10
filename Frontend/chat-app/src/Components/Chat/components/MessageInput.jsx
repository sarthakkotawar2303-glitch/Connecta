import { useRef } from "react";
import EmojiPicker from "emoji-picker-react";

// ─── MessageInput ─────────────────────────────────────────
// Bottom input bar. Handles:
//   • normal message typing + send
//   • edit mode (banner + save button)
//   • emoji picker
//   • typing events (passed in as callbacks)

const MessageInput = ({
  chatName,
  newMessage,
  sending,
  showEmoji,
  editingMessage,
  editError,
  inputRef,
  emojiPickerRef,
  onInputChange,
  onKeyDown,
  onSend,
  onEmojiClick,
  onToggleEmoji,
  onEditCancel,
}) => {
  return (
    <div className="border-t border-slate-800 bg-slate-900 px-4 py-3 flex-shrink-0">

      {/* ── Edit mode banner ── */}
      {editingMessage && (
        <div className="flex items-center justify-between px-3 py-2 mb-2 bg-slate-800 border border-teal-500/30 rounded-xl">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-teal-400 text-xs font-medium">Editing message</span>
            <span className="text-slate-500 text-xs truncate max-w-[180px]">
              {editingMessage.content}
            </span>
          </div>
          <button onClick={onEditCancel} className="text-slate-400 hover:text-white transition flex-shrink-0 ml-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Edit error ── */}
      {editError && (
        <p className="text-red-400 text-xs px-1 pb-1.5">{editError}</p>
      )}

      {/* ── Emoji picker ── */}
      {showEmoji && (
        <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-50">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme="dark"
            skinTonesDisabled
            searchDisabled={false}
            height={380}
            width={320}
          />
        </div>
      )}

      {/* ── Input row ── */}
      <div
        className={`flex items-center gap-2 bg-slate-800 border rounded-xl px-3 py-2.5 transition ${
          sending
            ? "border-slate-700 opacity-70"
            : "border-slate-700 focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/30"
        }`}
      >
        {/* Emoji toggle */}
        <button
          onClick={onToggleEmoji}
          className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg transition ${
            showEmoji ? "bg-teal-600/20 text-teal-400" : "text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
          title="Emoji"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          placeholder={editingMessage ? "Edit your message…" : `Message ${chatName}…`}
          className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none"
          value={newMessage}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          disabled={sending}
          autoFocus
        />

        {/* Hint */}
        {newMessage.length > 0 && (
          <span className="text-xs text-slate-600 flex-shrink-0">
            {editingMessage ? "↵ save" : "↵ send"}
          </span>
        )}

        {/* Send / Save button */}
        <button
          onClick={onSend}
          disabled={!newMessage.trim() || sending}
          className="w-8 h-8 flex-shrink-0 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition"
        >
          {sending ? (
            <div className="w-3.5 h-3.5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
          ) : editingMessage ? (
            // Save (checkmark) icon
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            // Send (paper plane) icon
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;