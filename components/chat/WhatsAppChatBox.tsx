"use client";

import React, { useRef, useEffect } from "react";
import { Send, CheckCheck, MessageSquare, Download, Trash2 } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  authorName: string;
  createdAt: string;
  isMe: boolean;
  role?: string;
}

export function WhatsAppChatBubble({
  message,
  authorName,
  createdAt,
  isMe,
  role,
}: ChatBubbleProps) {
  const formattedTime = (() => {
    try {
      const d = new Date(createdAt);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  })();

  return (
    <div className={`w-full flex ${isMe ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`relative max-w-[85%] sm:max-w-[75%] md:max-w-[68%] rounded-2xl px-4 py-2.5 text-xs shadow-sm transition-all border ${
          isMe
            ? "bg-[#27272a] text-neutral-100 border-neutral-700/80 rounded-tr-none shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
            : "bg-white text-neutral-900 border-neutral-200/90 rounded-tl-none shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        }`}
      >
        {/* Author header */}
        <div className="flex items-center gap-1.5 mb-1 font-sans">
          <span
            className={`text-[11px] font-medium tracking-wide ${
              isMe ? "text-neutral-300" : role === "ADMIN" ? "text-amber-800 font-semibold" : "text-neutral-700 font-semibold"
            }`}
          >
            {isMe ? "You" : authorName}
          </span>
          {role === "ADMIN" && !isMe && (
            <span className="rounded bg-amber-50 text-amber-900 border border-amber-300/60 px-1.5 py-[1px] text-[9px] font-mono font-bold uppercase">
              Staff / Admin
            </span>
          )}
        </div>

        {/* Message body */}
        <p className="whitespace-pre-wrap break-words leading-relaxed text-[13px] pr-6 select-text">
          {message}
        </p>

        {/* Timestamp & status */}
        <div
          className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] font-mono ${
            isMe ? "text-neutral-400" : "text-neutral-400"
          }`}
        >
          <span>{formattedTime}</span>
          {isMe && <CheckCheck className="h-3.5 w-3.5 text-neutral-400 inline" />}
        </div>
      </div>
    </div>
  );
}

interface WhatsAppChatBoxProps {
  title?: string;
  subtitle?: string;
  messages: any[];
  currentUserEmail?: string | null;
  currentUserId?: string | null;
  currentRole?: string;
  newMessage: string;
  setNewMessage: (val: string) => void;
  onSendMessage: () => void;
  onDeleteChat?: () => void;
  submitting?: boolean;
}

export function WhatsAppChatBox({
  title = "Chat with Lead Developer",
  subtitle = "Online • Developer & Direct Studio",
  messages = [],
  currentUserEmail,
  currentUserId,
  currentRole,
  newMessage,
  setNewMessage,
  onSendMessage,
  onDeleteChat,
  submitting = false,
}: WhatsAppChatBoxProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sort ascending: oldest first, latest at bottom
  const chronologicalMessages = [...messages].sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeA - timeB;
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Export / Download transcript handler
  const handleDownloadTranscript = () => {
    if (chronologicalMessages.length === 0) return;
    const transcriptText = chronologicalMessages
      .map((m) => {
        const time = new Date(m.createdAt || 0).toLocaleString();
        const author = m.author?.name || m.authorName || "User";
        return `[${time}] ${author}: ${m.message}`;
      })
      .join("\r\n\r\n");

    const blob = new Blob([transcriptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat-transcript-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-neutral-300/80 bg-white shadow-xl overflow-hidden flex flex-col h-[530px]">
      {/* Sleek, professional modern grey header */}
      <div className="flex items-center justify-between border-b border-neutral-700 bg-[#18181b] px-5 py-3.5 text-white">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-neutral-200 border border-neutral-700 shadow-sm">
            <MessageSquare className="h-5 w-5 text-neutral-300" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#18181b]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-neutral-100">{title}</h3>
            <p className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{subtitle}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: Transcript download & Admin Delete */}
        <div className="flex items-center gap-2">
          {chronologicalMessages.length > 0 && (
            <button
              type="button"
              onClick={handleDownloadTranscript}
              title="Download Chat Transcript"
              aria-label="Download Chat Transcript"
              className="flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800/80 px-3 py-1.5 text-[11px] font-mono text-neutral-200 hover:bg-neutral-700 hover:text-white transition-all shadow-sm"
            >
              <Download className="h-3.5 w-3.5 text-neutral-300" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          {currentRole === "ADMIN" && onDeleteChat && (
            <button
              type="button"
              onClick={onDeleteChat}
              title="Completely delete all chat history"
              aria-label="Delete entire chat thread"
              className="flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-950/40 px-3 py-1.5 text-[11px] font-mono text-red-300 hover:bg-red-900/60 transition-all shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Clean, soothing greyish chat canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#f4f4f5] space-y-1">
        {chronologicalMessages.length > 0 ? (
          chronologicalMessages.map((msg, idx) => {
            const authorRole = msg.author?.role || msg.role || "";
            const authorId = msg.authorId || msg.author?.id;
            const authorEmail = msg.author?.email || msg.clientEmail;
            const authorName = msg.author?.name || msg.authorName || "Studio Developer";

            const isMe =
              (currentUserId && authorId && authorId === currentUserId) ||
              (currentUserEmail && authorEmail && authorEmail.toLowerCase() === currentUserEmail.toLowerCase()) ||
              (currentRole === "ADMIN" && authorRole === "ADMIN") ||
              (currentRole === "CUSTOMER" && authorRole === "CUSTOMER" && (!authorId || authorId === currentUserId));

            return (
              <WhatsAppChatBubble
                key={msg.id || idx}
                message={msg.message}
                authorName={authorName}
                createdAt={msg.createdAt}
                isMe={Boolean(isMe)}
                role={authorRole}
              />
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-500 space-y-3">
            <div className="rounded-2xl bg-white p-3.5 shadow-sm border border-neutral-200">
              <MessageSquare className="h-6 w-6 text-neutral-400" />
            </div>
            <div>
              <p className="text-xs font-mono font-medium text-neutral-700">
                End-to-End Encrypted Project Discussion
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Type your specifications or questions below to chat directly with our team.
              </p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Greyish Clean Input Bar */}
      <div className="p-3 bg-[#e4e4e7]/70 border-t border-neutral-200 flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
          }}
          placeholder="Type your message..."
          aria-label="Type your message"
          className="flex-1 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-800 shadow-inner"
        />
        <button
          onClick={onSendMessage}
          disabled={submitting || !newMessage.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-all shadow-md disabled:opacity-40"
          title="Send message"
        >
          <Send className="h-4 w-4 ml-0.5 text-white" />
        </button>
      </div>
    </div>
  );
}
