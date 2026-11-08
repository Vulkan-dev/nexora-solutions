"use client";

import React, { useRef, useEffect } from "react";
import { Send, Sparkles, Check, CheckCheck } from "lucide-react";

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
    <div className={`w-full flex ${isMe ? "justify-end" : "justify-start"} my-1.5`}>
      <div
        className={`relative max-w-[82%] sm:max-w-[72%] md:max-w-[65%] rounded-2xl px-3.5 py-2 text-xs shadow-sm transition-all ${
          isMe
            ? "bg-[#005c4b] text-white rounded-tr-none"
            : "bg-white text-neutral-900 border border-black/[0.08] rounded-tl-none shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
        }`}
      >
        {/* Author header */}
        <div className="flex items-center gap-1.5 mb-1 font-sans">
          <span
            className={`text-[11px] font-semibold tracking-wide ${
              isMe ? "text-emerald-200" : role === "ADMIN" ? "text-amber-800" : "text-sky-700"
            }`}
          >
            {isMe ? "You" : authorName}
          </span>
          {role === "ADMIN" && !isMe && (
            <span className="rounded bg-amber-100 text-amber-900 border border-amber-300/60 px-1 py-[1px] text-[9px] font-mono font-bold uppercase">
              Staff / Admin
            </span>
          )}
        </div>

        {/* Message body */}
        <p className="whitespace-pre-wrap break-words leading-relaxed text-[12.5px] pr-8 select-text">
          {message}
        </p>

        {/* Timestamp & read receipts */}
        <div
          className={`flex items-center justify-end gap-1 mt-1 text-[10px] font-mono ${
            isMe ? "text-emerald-200/80" : "text-neutral-400"
          }`}
        >
          <span>{formattedTime}</span>
          {isMe && <CheckCheck className="h-3.5 w-3.5 text-emerald-300 inline" />}
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
  onRequestStaffChat?: () => void;
  submitting?: boolean;
}

export function WhatsAppChatBox({
  title = "Direct WhatsApp-Style Project Chat",
  subtitle = "End-to-end encrypted direct developer communications",
  messages = [],
  currentUserEmail,
  currentUserId,
  currentRole,
  newMessage,
  setNewMessage,
  onSendMessage,
  onRequestStaffChat,
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

  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white shadow-lg overflow-hidden flex flex-col h-[520px]">
      {/* Top Header bar styled like WhatsApp */}
      <div className="flex items-center justify-between border-b border-black/[0.08] bg-[#075e54] px-5 py-3.5 text-white">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700/80 text-white font-bold text-sm shadow-inner border border-emerald-400/30">
            💬
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#075e54]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">{title}</h3>
            <p className="text-[11px] text-emerald-100/90 font-mono flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span>Online • Developer & Direct Studio</span>
            </p>
          </div>
        </div>

        {onRequestStaffChat && (
          <button
            type="button"
            onClick={onRequestStaffChat}
            disabled={submitting}
            className="rounded-full border border-emerald-300/40 bg-emerald-800/60 px-3 py-1.5 text-[11px] font-mono text-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-1.5 font-semibold shadow-sm"
          >
            <Sparkles className="h-3 w-3 text-emerald-300" />
            <span>Request Chat</span>
          </button>
        )}
      </div>

      {/* Messages Canvas - WhatsApp subtle background texture */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#efeae2] bg-opacity-90 space-y-1">
        {chronologicalMessages.length > 0 ? (
          chronologicalMessages.map((msg, idx) => {
            const authorRole = msg.author?.role || msg.role || "";
            const authorId = msg.authorId || msg.author?.id;
            const authorEmail = msg.author?.email || msg.clientEmail;
            const authorName = msg.author?.name || msg.authorName || "Studio Developer";

            // If user is Admin, their own messages are ADMIN messages or match id/email
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
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-500 space-y-2">
            <div className="rounded-full bg-white/80 p-3 shadow-sm border border-black/[0.05]">
              🔒
            </div>
            <p className="text-xs font-mono font-medium text-neutral-600">
              Messages are secure and linked to this project order.
            </p>
            <p className="text-[11px] text-neutral-500">
              Type a message below to chat directly with our engineering team!
            </p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* WhatsApp Input Bar */}
      <div className="p-3 bg-[#f0f2f5] border-t border-black/[0.06] flex items-center gap-2">
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
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-black/[0.1] bg-white px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#005c4b] shadow-inner"
        />
        <button
          onClick={onSendMessage}
          disabled={submitting || !newMessage.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a884] text-white hover:bg-[#008f6f] transition-all shadow-md disabled:opacity-40"
          title="Send message"
        >
          <Send className="h-4 w-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
