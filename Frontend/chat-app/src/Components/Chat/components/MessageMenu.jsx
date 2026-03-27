import { useEffect, useRef, useState } from "react";
import { canEdit } from "./Chathelpers ";

const MessageMenu = ({ msg, currentUserId, onEdit, onDeleteForMe, onDeleteForEveryone }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const isMe = msg.sender?._id === currentUserId;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (msg.isDeleted) return null;

  return (
    <div className="relative flex-shrink-0" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition opacity-0 group-hover:opacity-100"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute bottom-7 z-50 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden ${
            isMe ? "right-0" : "left-0"
          }`}
        >
          {isMe && canEdit(msg) && (
            <button
              onClick={() => { onEdit(msg); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-slate-700 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          )}

          <button
            onClick={() => { onDeleteForMe(msg._id); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete for me
          </button>

          {isMe && (
            <button
              onClick={() => { onDeleteForEveryone(msg._id); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-slate-700 transition flex items-center gap-2 border-t border-slate-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete for everyone
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageMenu;