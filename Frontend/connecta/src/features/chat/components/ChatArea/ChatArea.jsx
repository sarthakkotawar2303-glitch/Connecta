import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../../../context/AuthContext";
import { useChatContext } from "../../../../context/ChatContext";
import { useChatActions } from "../../../../hooks/useChatActions";

import ChatHeader from "./ChatHeader";
import GroupInfoPanel from "../Group/GroupInfoPanel";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import { getOtherUser } from "../../utils/chatHelpers";

const ChatArea = () => {
  const { user } = useAuthContext();
  const {
    selectedChat, setSelectedChat,
    messages, loadingMessages,
    typingInfo, onlineUsers, deliveredMessages,
  } = useChatContext();

  const {
    sendMessage, editMessage, deleteMessage,
    joinChat, leaveChat, emitTyping, emitStopTyping,
    fetchMessages, markAsRead,
  } = useChatActions();

  // UI state 
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editError, setEditError] = useState("");

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    if (showEmoji) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);

  // Handle room joining and leaving
  useEffect(() => {
    if (!selectedChat?._id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewMessage("");
      setShowEmoji(false);
      setEditingMessage(null);
      setEditError("");
      return;
    }

    joinChat(selectedChat._id);
    fetchMessages(selectedChat._id);
    markAsRead(selectedChat._id);

    setShowInfo(false);
    setNewMessage("");
    setShowEmoji(false);
    setEditingMessage(null);
    setEditError("");
    clearTimeout(typingTimerRef.current);
    isTypingRef.current = false;

    return () => {
      leaveChat(selectedChat._id);
    };
  }, [selectedChat?._id, joinChat, leaveChat, fetchMessages, markAsRead]);

  useEffect(() => {
    return () => clearTimeout(typingTimerRef.current);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingInfo]);

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
    isTypingRef.current = false;
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
    
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emitTyping?.(selectedChat._id);
    }
    
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      emitStopTyping?.(selectedChat._id);
      isTypingRef.current = false;
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
      <div className="flex-1 bg-[#1E293B] rounded-2xl flex items-center justify-center font-sans shadow-xl border border-[#334155]/25">
        <div className="text-center select-none px-6">
          {/* Cartoon Vector Illustration */}
          <svg viewBox="0 0 320 220" className="w-72 h-auto mx-auto mb-6" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Soft background circle */}
            <circle cx="160" cy="115" r="70" fill="#007AFF" fillOpacity="0.08" />

            {/* Left Character (Guy) */}
            <g id="guy">
              {/* Torso */}
              <path d="M75,185 C75,145 95,135 110,135 C125,135 145,145 145,185" fill="#007AFF" />
              {/* Neck */}
              <rect x="106" y="122" width="8" height="15" fill="#FFDBB5" />
              {/* Face */}
              <circle cx="110" cy="112" r="15" fill="#FFDBB5" />
              {/* Hair */}
              <path d="M94,112 C94,96 126,96 126,112 C126,104 94,104 94,112 Z" fill="#0056B3" />
              {/* Eye */}
              <circle cx="115" cy="110" r="1.5" fill="#1E293B" />
              {/* Gesturing arms */}
              <path d="M80,155 Q65,145 70,135 Q75,125 90,145" stroke="#FFDBB5" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <path d="M140,155 Q155,145 150,135 Q145,125 130,145" stroke="#FFDBB5" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            </g>

            {/* Right Character (Girl) */}
            <g id="girl">
              {/* Torso */}
              <path d="M175,185 C175,145 195,135 210,135 C225,135 245,145 245,185" fill="#0056B3" />
              {/* Neck */}
              <rect x="206" y="122" width="8" height="15" fill="#FFDBB5" />
              {/* Face */}
              <circle cx="210" cy="112" r="15" fill="#FFDBB5" />
              {/* Hair */}
              <path d="M194,118 C194,92 226,92 226,118 C226,128 222,134 222,138" fill="#1A202C" />
              {/* Eye */}
              <circle cx="205" cy="110" r="1.5" fill="#1E293B" />
              {/* Gesturing arms */}
              <path d="M180,155 Q165,145 170,135 Q175,125 190,145" stroke="#FFDBB5" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <path d="M240,155 Q255,145 250,135 Q245,125 230,145" stroke="#FFDBB5" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            </g>

            {/* Left Speech Bubble (Blue) */}
            <g id="bubble-left">
              <path d="M100,30 H140 C146,30 150,34 150,40 V60 C150,46 146,50 140,50 H112 L100,60 V50 C94,50 90,46 90,40 V40 C90,34 94,30 100,30 Z" fill="#007AFF" />
              <line x1="100" y1="37" x2="140" y2="37" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="100" y1="44" x2="132" y2="44" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Right Speech Bubble (White) */}
            <g id="bubble-right">
              <path d="M180,45 H220 C226,45 230,49 230,55 V75 C230,81 226,85 220,85 H202 L190,95 V85 C184,85 180,81 180,75 V55 C180,49 184,45 180,45 Z" fill="white" />
              <line x1="190" y1="52" x2="220" y2="52" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="190" y1="60" x2="215" y2="60" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="190" y1="68" x2="208" y2="68" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Little floating dots/elements */}
            <circle cx="160" cy="45" r="3" fill="#007AFF" />
            <circle cx="168" cy="38" r="4.5" fill="#007AFF" />
            <circle cx="152" cy="65" r="2.5" fill="#94A3B8" />
          </svg>

          <h3 className="text-white font-headline-md font-bold text-xl mb-2">Select a conversation to start messaging</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">Connect with your team and contacts easily.</p>
        </div>
      </div>
    );
  }

  const otherUser = getOtherUser(selectedChat, user?._id);
  const chatName = selectedChat.isGroupChat ? selectedChat.chatName : otherUser?.username || "Unknown";
  const chatPic = otherUser?.pic;
  const someoneIsTyping = typingInfo && typingInfo.chatId === selectedChat._id;

  return (
    <div className="flex-1 flex flex-col bg-[#1E293B] rounded-2xl min-w-0 font-sans overflow-hidden shadow-xl border border-[#334155]/25">
      {/* Header */}
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

      {/* Body (messages + optional group panel) */}
      <div className="flex flex-1 overflow-hidden bg-[#0F172A]">
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Loading spinner */}
          {loadingMessages && (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty messages */}
          {!loadingMessages && messages?.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full pb-10">
              <div className="w-14 h-14 bg-surface-container border border-outline-variant rounded-none flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-on-surface-variant/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-on-surface-variant text-sm">No messages yet</p>
              <p className="text-on-surface-variant/60 text-xs mt-0.5 font-mono">BE THE FIRST TO SAY SOMETHING 👋</p>
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

        {/* Group / Contact info side panel */}
        {showInfo && (
          <GroupInfoPanel onClose={() => setShowInfo(false)} />
        )}
      </div>

      {/* Input bar */}
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
