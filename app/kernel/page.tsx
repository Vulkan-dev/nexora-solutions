"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  Clock,
  RefreshCw,
  Search,
  X,
  Layers,
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

export default function KernelConsolePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      console.error("Kernel order fetch failed:", e);
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
          updateNote: note || `Status transitioned to ${status}`,
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

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
  const activeOrders = orders.filter((o) =>
    ["ACCEPTED", "IN_PROGRESS", "REVISION", "AWAITING_RESPONSE"].includes(o.status)
  ).length;
  const pendingReview = orders.filter((o) => ["PENDING", "UNDER_REVIEW"].includes(o.status)).length;
  const completedOrders = orders.filter((o) => o.status === "COMPLETED").length;

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === "ALL" || ord.status === statusFilter;
    const matchesSearch =
      ord.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.package?.service?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.serviceTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full max-w-[95vw] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-black/[0.08] gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-amber-800 font-mono font-semibold mb-2">
            Kernel Panel // Nexora Solutions Management
          </div>
          <h1 className="text-3xl font-light text-neutral-900">Kernel Dashboard</h1>
          <p className="text-xs text-neutral-600 mt-1">
            Manage incoming orders, update project statuses, and chat with customers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 rounded-full border border-black/[0.09] bg-white px-4 py-2 text-xs text-neutral-700 hover:text-neutral-950 transition-colors uppercase tracking-wider font-mono text-[11px] shadow-sm"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm">
          <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono mb-1">Total Revenue</div>
          <div className="text-2xl font-light text-neutral-900 font-serif">{formatCurrency(totalRevenue)}</div>
          <div className="text-[11px] text-amber-800 mt-2 font-mono font-semibold">All-time volume</div>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm">
          <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono mb-1">Active Orders</div>
          <div className="text-2xl font-light text-neutral-900 font-serif">{activeOrders}</div>
          <div className="text-[11px] text-neutral-600 mt-2 font-mono">In production cycle</div>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm">
          <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono mb-1">Review Queue</div>
          <div className="text-2xl font-light text-neutral-900 font-serif">{pendingReview}</div>
          <div className="text-[11px] text-amber-800 mt-2 font-mono font-semibold">Pending director triage</div>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm">
          <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono mb-1">Completed Editions</div>
          <div className="text-2xl font-light text-neutral-900 font-serif">{completedOrders}</div>
          <div className="text-[11px] text-neutral-600 mt-2 font-mono">Delivered to clients</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="mt-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-black/[0.08] pb-6">
        <div className="flex flex-wrap gap-2">
          {["ALL", "PENDING", "UNDER_REVIEW", "IN_PROGRESS", "AWAITING_RESPONSE", "COMPLETED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-3.5 py-1 text-xs uppercase tracking-wider font-mono transition-all ${
                  statusFilter === status
                    ? "bg-neutral-900 text-white font-bold shadow-md"
                    : "bg-white text-neutral-700 hover:text-black border border-black/[0.08] shadow-sm"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            )
          )}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or discipline..."
            className="w-full rounded-full border border-black/[0.09] bg-white py-2 pl-9 pr-4 text-xs text-neutral-900 placeholder-neutral-500 focus:border-amber-700 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-black/[0.08] bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-black/[0.06] bg-[#f4f2ec] text-neutral-600 uppercase tracking-widest text-[9px] font-mono font-semibold">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Service & Package</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.06] text-neutral-700">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 font-mono">
                  No records match the current filter.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-neutral-900 font-semibold text-[11px]">{ord.id}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">{formatDate(ord.createdAt)}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">
                      {ord.package?.service?.title || ord.serviceTitle || "Custom Architecture"}
                    </div>
                    <div className="text-[10px] text-amber-800 font-mono font-semibold">
                      {ord.package?.name || ord.packageName || "Standard"}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-black/[0.05] border border-black/[0.08] px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-amber-900 font-semibold">
                      {ord.status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-[11px] font-mono text-neutral-800">
                      {ord.paymentStatus || "UNPAID"}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-serif text-neutral-900 font-medium text-sm">
                    {formatCurrency(ord.totalPrice)}
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    {ord.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(ord.id, "ACCEPTED", "Order accepted into development queue.")}
                          className="rounded-full border border-amber-700/30 bg-amber-50 px-2.5 py-1 text-[10px] text-amber-900 hover:bg-amber-100 font-mono font-semibold shadow-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ord.id, "CANCELLED", "Order declined.")}
                          className="rounded-full border border-black/[0.1] bg-white px-2.5 py-1 text-[10px] text-neutral-600 hover:text-black font-mono shadow-sm"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setSelectedOrder(ord);
                        setTargetStatus(ord.status);
                      }}
                      className="rounded-full border border-black/[0.1] bg-[#f7f6f2] px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-800 hover:text-black hover:bg-white shadow-sm"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-black/[0.09] bg-white p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <h3 className="text-sm font-semibold text-neutral-900">Transition Production State</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-500 hover:text-neutral-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs font-mono text-neutral-500">Ref: {selectedOrder.id}</div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-mono font-medium mb-2">Target State</label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
                className="w-full rounded-xl border border-black/[0.1] bg-[#f7f6f2] p-2.5 text-xs text-neutral-900 focus:border-amber-700 focus:bg-white focus:outline-none"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-mono font-medium mb-2">
                Production Milestone Note (Client Visible)
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="State changes or milestone instructions..."
                className="w-full rounded-xl border border-black/[0.1] bg-[#f7f6f2] p-3 text-xs text-neutral-900 placeholder-neutral-500 focus:border-amber-700 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-full px-4 py-2 text-xs text-neutral-600 hover:text-black font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, targetStatus, adminNote)}
                disabled={updating}
                className="rounded-full bg-neutral-900 px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 shadow-md disabled:opacity-30"
              >
                {updating ? "Updating..." : "Execute Transition"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
