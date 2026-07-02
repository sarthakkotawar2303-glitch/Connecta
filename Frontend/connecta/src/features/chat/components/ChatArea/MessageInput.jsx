import EmojiPicker from "emoji-picker-react";
import { Smile, Send, X, Check } from "lucide-react";

const MessageInput = ({
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
    <div className="border-t border-[#334155]/30 bg-[#1E293B] px-6 py-5 flex-shrink-0 select-none relative font-sans">
      {editingMessage && (
        <div className="flex items-center justify-between px-4 py-2 mb-3 bg-[#0F172A]/60 border border-primary/20 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs font-semibold uppercase tracking-wider font-mono">Editing message</span>
            <span className="text-slate-300 text-xs truncate max-w-[200px]">
              {editingMessage.content}
            </span>
          </div>
          <button onClick={onEditCancel} className="text-slate-400 hover:text-white transition flex-shrink-0 ml-2 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {editError && (
        <p className="text-error text-xs px-1 pb-2 font-mono">{editError}</p>
      )}

      {showEmoji && (
        <div ref={emojiPickerRef} className="absolute bottom-24 left-6 z-50">
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

      <div className="flex items-center gap-4">

        {/* Input container */}
        <div
          className={`flex-1 flex items-center bg-[#0F172A]/70 px-4 py-3 border transition ${
            sending
              ? "border-[#334155]/30 opacity-60"
              : "border-[#334155]/60 focus-within:border-primary/80"
          } rounded-2xl`}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={editingMessage ? "Edit your message…" : "Type a message..."}
            className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm outline-none border-none focus:ring-0 focus:outline-none"
            value={newMessage}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            disabled={sending}
            autoFocus
          />

          <button
            onClick={onToggleEmoji}
            className={`w-6 h-6 flex-shrink-0 flex items-center justify-center transition cursor-pointer text-slate-400 hover:text-white`}
            title="Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Send / Save Button */}
        <button
          onClick={onSend}
          disabled={!newMessage.trim() || sending}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white p-3 flex items-center justify-center transition-all cursor-pointer rounded-2xl flex-shrink-0 shadow-md"
        >
          {sending ? (
            <div className="w-5.5 h-5.5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
          ) : editingMessage ? (
            <Check className="w-5.5 h-5.5" />
          ) : (
            <Send className="w-5.5 h-5.5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
