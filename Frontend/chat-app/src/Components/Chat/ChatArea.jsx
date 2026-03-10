import { useEffect, useRef, useState } from "react";
import { useChat } from "../../Context/ChatProvider";

import ChatHeader from "./components/ChatHeader";
import GroupInfoPanel from "./components/GroupInfoPanel";
import MessageBubble from "./components/MessageBubble";
import MessageInput from "./components/MessageInput";
import TypingIndicator from "./components/TypingIndicator";
import { getOtherUser } from "./components/Chathelpers ";
// import  getOtherUser  from "./components/ChatHelpers";

// ─── ChatArea ─────────────────────────────────────────────
// Top-level orchestrator. Owns only:
//   • UI state (sending, showInfo, showEmoji, editingMessage, editError)
//   • Refs (bottomRef, inputRef, typingTimerRef, emojiPickerRef)
//   • Event handlers that coordinate between child components
// All rendering is delegated to the components above.

const ChatArea = () => {
  const {
    selectedChat, setSelectedChat,
    user, messages, loadingMessages, sendMessage,
    typingInfo, emitTyping, emitStopTyping,
    onlineUsers, deliveredMessages,
    deleteMessage,
    editMessage,
  } = useChat();

  // ── UI state ──
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editError, setEditError] = useState("");

  // ── Refs ──
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // ── Close emoji picker on outside click ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    if (showEmoji) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);

  // ── Reset state when switching chats ──
  useEffect(() => {
    setShowInfo(false);
    setNewMessage("");
    setShowEmoji(false);
    setEditingMessage(null);
    setEditError("");
    clearTimeout(typingTimerRef.current);
  }, [selectedChat?._id]);

  // ── Clean up typing timer on unmount ──
  useEffect(() => {
    return () => clearTimeout(typingTimerRef.current);
  }, []);

  // ── Auto-scroll to bottom on new messages / typing ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingInfo]);

  // ── Send or save edit ──
  const handleSend = async () => {
    const content = newMessage.trim();
    if (!content || !selectedChat || sending) return;

    if (editingMessage) {
      try {
        await editMessage(editingMessage._id, content);
        setEditingMessage(null);
        setNewMessage("");
        setEditError("");
      } catch {
        setEditError("Cannot edit message after 15 minutes");
      }
      return;
    }

    clearTimeout(typingTimerRef.current);
    emitStopTyping?.(selectedChat._id);
    setNewMessage("");
    setShowEmoji(false);
    setSending(true);
    await sendMessage(selectedChat._id, content);
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape" && editingMessage) {
      handleEditCancel();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!selectedChat?._id) return;
    emitTyping?.(selectedChat._id);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      emitStopTyping?.(selectedChat._id);
    }, 2000);
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const updated = newMessage.slice(0, start) + emoji + newMessage.slice(end);
    setNewMessage(updated);
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const handleEditStart = (msg) => {
    setEditingMessage(msg);
    setNewMessage(msg.content);
    setEditError("");
    inputRef.current?.focus();
  };

  const handleEditCancel = () => {
    setEditingMessage(null);
    setNewMessage("");
    setEditError("");
  };

  // ── Empty state ──
  if (!selectedChat) {
    return (
      <div className="flex-1 bg-slate-950 flex items-center justify-center">
        <div className="text-center select-none">
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 bg-teal-500/10 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center">
              <svg className="w-9 h-9 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <h3 className="text-white font-semibold text-lg mb-1">No conversation open</h3>
          <p className="text-slate-500 text-sm max-w-xs">Search for a person or pick an existing chat.</p>
        </div>
      </div>
    );
  }

  const otherUser = getOtherUser(selectedChat, user?._id);
  const chatName = selectedChat.isGroupChat ? selectedChat.chatName : otherUser?.username || "Unknown";
  const chatPic = otherUser?.pic;
  const someoneIsTyping = typingInfo && typingInfo.chatId === selectedChat._id;

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-w-0">

      {/* ── Header ── */}
      <ChatHeader
        selectedChat={selectedChat}
        otherUser={otherUser}
        chatName={chatName}
        chatPic={chatPic}
        typingInfo={typingInfo}
        onlineUsers={onlineUsers}
        showInfo={showInfo}
        onToggleInfo={() => setShowInfo((v) => !v)}
        onBack={() => setSelectedChat(null)}
      />

      {/* ── Body (messages + optional group panel) ── */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-5 py-5">

          {/* Loading spinner */}
          {loadingMessages && (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty messages */}
          {!loadingMessages && messages?.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full pb-10">
              <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm">No messages yet</p>
              <p className="text-slate-600 text-xs mt-0.5">Be the first to say something 👋</p>
            </div>
          )}

          {/* Message list */}
          {!loadingMessages && messages?.map((msg, index) => (
            <MessageBubble
              key={msg._id}
              msg={msg}
              index={index}
              messages={messages}
              currentUserId={user?._id}
              isGroupChat={selectedChat.isGroupChat}
              deliveredMessages={deliveredMessages}
              onEdit={handleEditStart}
              onDeleteForMe={(id) => deleteMessage(id, false)}
              onDeleteForEveryone={(id) => deleteMessage(id, true)}
            />
          ))}

          {someoneIsTyping && <TypingIndicator username={typingInfo.username} />}
          <div ref={bottomRef} className="h-2" />
        </div>

        {/* Group info side panel */}
        {showInfo && selectedChat.isGroupChat && (
          <GroupInfoPanel onClose={() => setShowInfo(false)} />
        )}
      </div>

      {/* ── Input bar ── */}
      <MessageInput
        chatName={chatName}
        newMessage={newMessage}
        sending={sending}
        showEmoji={showEmoji}
        editingMessage={editingMessage}
        editError={editError}
        inputRef={inputRef}
        emojiPickerRef={emojiPickerRef}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onSend={handleSend}
        onEmojiClick={handleEmojiClick}
        onToggleEmoji={() => setShowEmoji((v) => !v)}
        onEditCancel={handleEditCancel}
      />
    </div>
  );
};

export default ChatArea;