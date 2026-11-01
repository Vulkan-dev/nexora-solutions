"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Send,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";

const STAGES = [
  { key: "PENDING", label: "Pending" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "AWAITING_RESPONSE", label: "Client Review" },
  { key: "REVISION", label: "Revision" },
  { key: "COMPLETED", label: "Completed" },
];

export default function CustomerDashboardPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newMessage, setNewMessage] = useState<string>("");
  const [revisionNote, setRevisionNote] = useState<string>("");
  const [showRevisionModal, setShowRevisionModal] = useState<boolean>(false);
  const [submittingAction, setSubmittingAction] = useState<boolean>(false);

  // Fetch orders
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/5 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Project Control Center</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track active architectural builds, communicate with engineers, and review deliverables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 rounded-full border border-neutral-800 bg-surfaceElevated px-4 py-2 text-xs text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link href="/order">
            <MagneticButton variant="glow" className="px-5 py-2 text-xs">
              <span>Commission New Order</span>
            </MagneticButton>
          </Link>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Orders List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Your Orders ({orders.length})
          </div>

          {loading && orders.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-surface/50 p-8 text-center text-xs text-neutral-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-surface/50 p-8 text-center space-y-4">
              <Layers className="mx-auto h-8 w-8 text-neutral-600" />
              <div className="text-xs text-neutral-400">No active or past orders found.</div>
              <Link href="/order">
                <MagneticButton variant="glow" className="px-4 py-2 text-xs">
                  <span>Start Your First Order</span>
                </MagneticButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-950/20 shadow-neon"
                        : "border-borderDark bg-surface/60 hover:border-neutral-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] text-neutral-400 truncate max-w-[140px]">
                        {ord.id}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          ord.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : ord.status === "IN_PROGRESS"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {ord.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-white mb-1">
                      {ord.package?.service?.title || ord.serviceTitle || "Cinematic Architecture"}
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-white/5">
                      <span>{formatCurrency(ord.totalPrice)}</span>
                      <span>{formatDate(ord.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Order Detail & Timeline Hub (8 cols) */}
        {selectedOrder ? (
          <div className="lg:col-span-8 space-y-8">
            {/* 8-Stage Progress Lifecycle Timeline */}
            <div className="rounded-3xl border border-white/10 bg-surface/80 p-6 backdrop-blur-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <div>
                  <div className="text-xs text-neutral-400">Order ID: {selectedOrder.id}</div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedOrder.package?.name || selectedOrder.packageName || "Enterprise Tier"}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-neutral-500">Payment</div>
                    <div className="text-xs font-bold text-emerald-400">
                      {selectedOrder.paymentStatus || "UNPAID"}
                    </div>
                  </div>
                  {selectedOrder.status === "AWAITING_RESPONSE" && (
                    <button
                      onClick={() => setShowRevisionModal(true)}
                      className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-all"
                    >
                      Request Revision
                    </button>
                  )}
                </div>
              </div>

              {/* Visual Lifecycle Stepper */}
              <div className="pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {STAGES.map((stage, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div
                        key={stage.key}
                        className={`rounded-xl p-2.5 text-center border transition-all ${
                          isCurrent
                            ? "border-blue-500 bg-blue-500/15 shadow-neon"
                            : isDone
                            ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                            : "border-white/5 bg-white/[0.02] text-neutral-500"
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase mb-1">
                          {isDone ? "✓ Done" : isCurrent ? "● Active" : `${idx + 1}`}
                        </div>
                        <div
                          className={`text-xs font-semibold truncate ${
                            isCurrent ? "text-white" : isDone ? "text-emerald-300" : "text-neutral-500"
                          }`}
                        >
                          {stage.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirements & Details */}
              {selectedOrder.requirements && (
                <div className="rounded-2xl border border-white/5 bg-surfaceElevated/40 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Requirements Specification:
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {selectedOrder.requirements}
                  </p>
                </div>
              )}
            </div>

            {/* Direct Project Messaging Thread */}
            <div className="rounded-3xl border border-white/10 bg-surface/80 p-6 backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Project Activity & Communications Thread</h3>
              </div>

              {/* Updates / Messages */}
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                {selectedOrder.updates && selectedOrder.updates.length > 0 ? (
                  selectedOrder.updates.map((upd: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/5 bg-surfaceElevated/60 p-4 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-blue-400">
                          {upd.author?.name || upd.author || "Architectural Team"}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          {formatDate(upd.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-200 leading-relaxed">{upd.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-neutral-500">
                    No timeline notes posted yet.
                  </div>
                )}
              </div>

              {/* New Message Input */}
              <div className="flex gap-2 pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Send a message or query to the engineering team..."
                  className="flex-1 rounded-full border border-borderDark bg-surfaceElevated px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={submittingAction || !newMessage.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-neon hover:bg-blue-500 transition-colors disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center rounded-3xl border border-white/5 bg-surface/30 p-12 text-center text-xs text-neutral-500">
            Select an order from the left list to review its live progress timeline.
          </div>
        )}
      </div>

      {/* Revision Request Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-surfaceElevated p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Request Revisions</h3>
            <p className="text-xs text-neutral-400">
              Please specify the adjustments you would like made to the staged deliverables.
            </p>
            <textarea
              rows={4}
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              placeholder="Detail your requested revisions clearly..."
              className="w-full rounded-2xl border border-borderDark bg-surface p-3 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
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
                className="rounded-full bg-amber-500 px-5 py-2 text-xs font-semibold text-black hover:bg-amber-400 disabled:opacity-40"
              >
                Submit Revision Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
