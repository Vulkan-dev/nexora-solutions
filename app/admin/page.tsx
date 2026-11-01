"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  ShieldAlert,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Settings,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  MessageSquare,
} from "lucide-react";

const ALL_STATUSES = [
  "PENDING",
  "UNDER_REVIEW",
  "ACCEPTED",
  "IN_PROGRESS",
  "AWAITING_RESPONSE",
  "REVISION",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminPanelPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"orders" | "catalog">("orders");

  // Status update modal state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [targetStatus, setTargetStatus] = useState<string>("IN_PROGRESS");
  const [adminNote, setAdminNote] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error("Admin order fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string, note?: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          updateNote: note || `Admin updated status to ${status}`,
        }),
      });

      if (res.ok) {
        fetchOrders();
        setSelectedOrder(null);
        setAdminNote("");
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  // KPI Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
  const activeOrders = orders.filter((o) =>
    ["ACCEPTED", "IN_PROGRESS", "REVISION", "AWAITING_RESPONSE"].includes(o.status)
  ).length;
  const pendingReview = orders.filter((o) => ["PENDING", "UNDER_REVIEW"].includes(o.status)).length;
  const completedOrders = orders.filter((o) => o.status === "COMPLETED").length;

  // Filtered list
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === "ALL" || ord.status === statusFilter;
    const matchesSearch =
      ord.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.package?.service?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.serviceTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Admin Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/5 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 mb-2">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Admin Command Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Platform Operations Hub</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Triage new client commissions, execute status state transitions, and audit analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 rounded-full border border-neutral-800 bg-surfaceElevated px-4 py-2 text-xs text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-white/5 bg-surface/70 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400 font-medium">Pipeline Volume</span>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{formatCurrency(totalRevenue)}</div>
          <div className="text-[11px] text-emerald-400 mt-2">Gross contracted volume</div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-surface/70 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400 font-medium">Active Builds</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{activeOrders}</div>
          <div className="text-[11px] text-neutral-400 mt-2">In engineering lifecycle</div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-surface/70 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400 font-medium">Triage Queue</span>
            <AlertCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">{pendingReview}</div>
          <div className="text-[11px] text-rose-400 mt-2">Requires admin review</div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-surface/70 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400 font-medium">Delivered</span>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{completedOrders}</div>
          <div className="text-[11px] text-emerald-400 mt-2">Final sign-off completed</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {["ALL", "PENDING", "UNDER_REVIEW", "IN_PROGRESS", "AWAITING_RESPONSE", "COMPLETED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow-neon"
                    : "bg-surfaceElevated text-neutral-400 hover:text-white border border-borderDark"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            )
          )}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID or service..."
            className="w-full rounded-full border border-borderDark bg-surface py-2 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Management Table */}
      <div className="mt-8 overflow-x-auto rounded-3xl border border-white/10 bg-surface/80 backdrop-blur-2xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/5 bg-surfaceElevated/50 text-neutral-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-6 py-4">Order ID & Date</th>
              <th className="px-6 py-4">Service & Package</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-neutral-300">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                  No orders matching filter criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-white font-bold">{ord.id}</div>
                    <div className="text-[10px] text-neutral-500">{formatDate(ord.createdAt)}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">
                      {ord.package?.service?.title || ord.serviceTitle || "Custom Architecture"}
                    </div>
                    <div className="text-[11px] text-blue-400">
                      {ord.package?.name || ord.packageName || "Standard"}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === "COMPLETED"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : ord.status === "IN_PROGRESS"
                          ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                          : ord.status === "CANCELLED"
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {ord.status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`text-[11px] font-semibold ${
                        ord.paymentStatus === "PAID" ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {ord.paymentStatus || "UNPAID"}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-bold text-white">
                    {formatCurrency(ord.totalPrice)}
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    {ord.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(ord.id, "ACCEPTED", "Order accepted by Admin triage.")}
                          className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/30"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ord.id, "CANCELLED", "Order rejected by Admin triage.")}
                          className="rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-[11px] font-semibold text-rose-400 hover:bg-rose-500/30"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setSelectedOrder(ord);
                        setTargetStatus(ord.status);
                      }}
                      className="rounded-full border border-neutral-700 bg-surfaceElevated px-3 py-1 text-[11px] font-semibold text-neutral-300 hover:text-white"
                    >
                      Transition
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Transition & Note Dispatch Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-surfaceElevated p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white">Transition Order Status</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs text-neutral-400">Order: {selectedOrder.id}</div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">Target Status</label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
                className="w-full rounded-xl border border-borderDark bg-surface p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Project Update Note (Visible to Client)
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Explain the update, deliverables ready, or requirements clarification..."
                className="w-full rounded-xl border border-borderDark bg-surface p-3 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-full px-4 py-2 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, targetStatus, adminNote)}
                disabled={updating}
                className="rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-neon hover:bg-blue-500 disabled:opacity-40"
              >
                {updating ? "Updating..." : "Execute Status Transition"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
