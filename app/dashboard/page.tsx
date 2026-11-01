"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  Clock,
  MessageSquare,
  Send,
  RefreshCw,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const STAGES = [
  { key: "PENDING", label: "Registered" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "IN_PROGRESS", label: "Production" },
  { key: "AWAITING_RESPONSE", label: "Client Staging" },
  { key: "REVISION", label: "Revision" },
  { key: "COMPLETED", label: "Delivered" },
];

export default function CustomerDashboardPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newMessage, setNewMessage] = useState<string>("");
  const [revisionNote, setRevisionNote] = useState<string>("");
  const [showRevisionModal, setShowRevisionModal] = useState<boolean>(false);
  const [submittingAction, setSubmittingAction] = useState<boolean>(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
        if (data.orders.length > 0 && !selectedOrder) {
          setSelectedOrder(data.orders[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedOrder) return;
    setSubmittingAction(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedMsg = data.message;
        setSelectedOrder((prev: any) => ({
          ...prev,
          updates: [updatedMsg, ...(prev.updates || [])],
        }));
        setNewMessage("");
      }
    } catch (e) {
      console.error("Failed to send message:", e);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleRequestStaffChat = async () => {
    if (!selectedOrder) return;
    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "👋 Client requested a direct discussion with the lead developer regarding project specifications.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder((prev: any) => ({
          ...prev,
          updates: [data.message, ...(prev.updates || [])],
        }));
      }
    } catch (e) {
      console.error("Failed to request chat:", e);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!revisionNote.trim() || !selectedOrder) return;
    setSubmittingAction(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "REVISION",
          updateNote: `Revision requested: ${revisionNote}`,
        }),
      });

      if (res.ok) {
        setSelectedOrder((prev: any) => ({
          ...prev,
          status: "REVISION",
        }));
        setShowRevisionModal(false);
        setRevisionNote("");
        loadOrders();
      }
    } catch (e) {
      console.error("Failed to request revision:", e);
    } finally {
      setSubmittingAction(false);
    }
  };

  const currentStageIndex = STAGES.findIndex((s) => s.key === selectedOrder?.status);

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-white/[0.08] gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-cream-400 font-mono mb-2">
            Customer Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            My Orders & Messages
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track your orders, check development progress, and chat directly with me.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-surface px-4 py-2 text-xs text-neutral-300 hover:text-white transition-colors uppercase tracking-wider font-mono text-[11px]"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link href="/order">
            <MagneticButton variant="primary" className="px-5 py-2 text-xs uppercase tracking-wider font-semibold">
              <span>Place New Order</span>
            </MagneticButton>
          </Link>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && orders.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-white/[0.08] bg-surface p-12 text-center text-xs text-neutral-400 font-mono">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-cream-400 mb-3" />
          <span>Loading your orders...</span>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State: Unified, responsive, generous spacing and quick action cards */
        <div className="mt-10 rounded-3xl border border-white/[0.08] bg-surface p-8 sm:p-14 lg:p-16 text-center space-y-6 max-w-3xl mx-auto shadow-sm">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border border-cream-400/30 bg-cream-400/10 text-cream-300 mx-auto shadow-glow">
            <Layers className="h-8 w-8 sm:h-10 sm:w-10 stroke-[1.8]" />
          </div>

          <div className="space-y-2.5 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
              No Orders Found Yet
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              You haven&apos;t placed any orders yet. Once you submit a project, you can track live progress and chat directly with the developer here.
            </p>
          </div>

          <div className="pt-4 pb-2">
            <Link href="/order" className="inline-block">
              <MagneticButton
                variant="primary"
                className="px-8 py-3.5 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2.5 shadow-glow"
              >
                <span>Place Your First Order</span>
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </Link>
          </div>

          {/* Quick Start Options */}
          <div className="pt-8 border-t border-white/[0.06]">
            <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono mb-4 text-center">
              Or Choose What You Want to Build:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
              {[
                { title: "SaaS App", desc: "Subscriptions, dashboard & payments", href: "/order?type=saas" },
                { title: "Fullstack Web App", desc: "Fast modern website & database", href: "/order?type=fullstack" },
                { title: "Discord Bot", desc: "Slash commands, roles & web panel", href: "/order?type=discord" },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-2xl border border-white/[0.06] bg-surfaceElevated p-4 hover:border-cream-400/30 hover:bg-white/[0.04] transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-cream-200 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-[10px] font-mono text-cream-400 group-hover:translate-x-1 transition-transform">
                    <span>Configure</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Orders Exist: Responsive 2-column grid */
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Orders List (5 cols on lg, 4 on xl) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">
              My Orders ({orders.length})
            </div>

            <div className="space-y-3">
              {orders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
                      isSelected
                        ? "border-cream-400/50 bg-surfaceElevated shadow-glow"
                        : "border-white/[0.06] bg-surface hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] text-neutral-500 truncate max-w-[140px]">
                        {ord.id}
                      </span>
                      <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-cream-200">
                        {ord.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="font-medium text-sm text-white mb-1">
                      {ord.package?.service?.title || ord.serviceTitle || "Custom Architecture"}
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-white/[0.04]">
                      <span className="font-mono text-cream-200 text-xs">{formatCurrency(ord.totalPrice)}</span>
                      <span className="text-[10px] font-mono text-neutral-500">{formatDate(ord.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        {/* Right Column: Order Detail & Timeline (7 cols on lg, 8 on xl) */}
        {selectedOrder ? (
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Visual Lifecycle Stepper */}
            <div className="rounded-2xl border border-white/[0.08] bg-surface p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    Ref: {selectedOrder.id}
                  </div>
                  <h2 className="text-xl font-normal text-white mt-1">
                    {selectedOrder.package?.name || selectedOrder.packageName || "Studio Edition"}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-mono">Settlement</div>
                    <div className="text-xs font-mono text-cream-200">
                      {selectedOrder.paymentStatus || "UNPAID"}
                    </div>
                  </div>
                  {selectedOrder.status === "AWAITING_RESPONSE" && (
                    <button
                      onClick={() => setShowRevisionModal(true)}
                      className="rounded-full border border-white/20 bg-surfaceElevated px-3 py-1 text-xs text-cream-100 hover:border-white/40 transition-all font-mono"
                    >
                      Request Revisions
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {STAGES.map((stage, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div
                        key={stage.key}
                        className={`rounded-lg p-2.5 text-center border transition-all ${
                          isCurrent
                            ? "border-cream-300 bg-white/10 text-white"
                            : isDone
                            ? "border-white/10 bg-white/[0.03] text-cream-300"
                            : "border-white/[0.04] bg-transparent text-neutral-600"
                        }`}
                      >
                        <div className="text-[9px] font-mono uppercase mb-1">
                          {isDone ? "✓" : isCurrent ? "●" : `0${idx + 1}`}
                        </div>
                        <div className="text-[11px] truncate font-medium">
                          {stage.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirements & Visual Scope Badges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedOrder.appType && (
                  <div className="rounded-xl border border-white/[0.04] bg-surfaceElevated p-4">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
                      Target App Type:
                    </div>
                    <div className="text-xs text-cream-200 font-medium">
                      {selectedOrder.appType} {selectedOrder.customAppType && `(${selectedOrder.customAppType})`}
                    </div>
                  </div>
                )}

                {selectedOrder.customColors && selectedOrder.customColors.length > 0 ? (
                  <div className="rounded-xl border border-white/[0.04] bg-surfaceElevated p-4">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
                      Color Palette:
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {selectedOrder.customColors.map((c: string, i: number) => (
                        <span
                          key={i}
                          className="h-4 w-4 rounded-full border border-white/20"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/[0.04] bg-surfaceElevated p-4">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
                      Color Palette:
                    </div>
                    <div className="text-xs text-neutral-400 font-mono">Developer Curated Palette</div>
                  </div>
                )}
              </div>

              {/* Requirements Note */}
              {selectedOrder.requirements && (
                <div className="rounded-xl border border-white/[0.04] bg-surfaceElevated p-4">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
                    Order Details:
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    {selectedOrder.requirements}
                  </p>
                </div>
              )}

              {/* Reference Links if provided */}
              {selectedOrder.referenceLinks && (
                <div className="rounded-xl border border-white/[0.04] bg-surfaceElevated p-4">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
                    Reference Links:
                  </div>
                  <div className="text-xs font-mono text-cream-300 truncate">
                    {selectedOrder.referenceLinks}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Studio Messaging Thread */}
            <div className="rounded-2xl border border-white/[0.08] bg-surface p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-cream-300" />
                  <h3 className="text-sm font-medium text-white">Direct Chat with Developer</h3>
                </div>
                <button
                  type="button"
                  onClick={handleRequestStaffChat}
                  disabled={submittingAction}
                  className="rounded-full border border-cream-400/30 bg-cream-400/10 px-3 py-1 text-[11px] font-mono text-cream-300 hover:bg-cream-400/20 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="h-3 w-3 text-cream-400" />
                  <span>Request Chat</span>
                </button>
              </div>

              {/* Messages List */}
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
                {selectedOrder.updates && selectedOrder.updates.length > 0 ? (
                  selectedOrder.updates.map((upd: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/[0.04] bg-surfaceElevated p-4 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-cream-200">
                          {upd.author?.name || upd.author || "Developer"}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500">
                          {formatDate(upd.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">{upd.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-neutral-500 font-mono">
                    No messages yet. Send a message below to start chatting!
                  </div>
                )}
              </div>

              {/* New Message Input */}
              <div className="flex gap-2 pt-2 border-t border-white/[0.06]">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message here..."
                  className="flex-1 rounded-full border border-white/[0.08] bg-surfaceElevated px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-white/30 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={submittingAction || !newMessage.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-neutral-900 hover:bg-white transition-colors disabled:opacity-30"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 xl:col-span-8 flex items-center justify-center rounded-2xl border border-white/[0.08] bg-surface p-16 text-center text-xs text-neutral-500 font-mono">
            Select an order from the list to see details and chat.
          </div>
        )}
      </div>
      )}

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surfaceElevated p-6 space-y-4">
            <h3 className="text-base font-normal text-white">Request Revisions</h3>
            <p className="text-xs text-neutral-400">
              Please describe the changes or fixes you would like.
            </p>
            <textarea
              rows={4}
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              placeholder="Outline requested changes..."
              className="w-full rounded-xl border border-white/[0.08] bg-surface p-3 text-xs text-white placeholder-neutral-500 focus:border-white/30 focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="rounded-full px-4 py-2 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestRevision}
                disabled={submittingAction || !revisionNote.trim()}
                className="rounded-full bg-cream-100 px-5 py-2 text-xs font-semibold text-neutral-900 hover:bg-white disabled:opacity-30"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
