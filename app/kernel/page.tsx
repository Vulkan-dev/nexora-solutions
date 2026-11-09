"use client";

import React, { useState, useEffect } from "react";
import { WhatsAppChatBox } from "@/components/chat/WhatsAppChatBox";
import { useSession, signOut } from "next-auth/react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Clock,
  RefreshCw,
  Search,
  X,
  Layers,
  LogOut,
  MessageSquare,
  Users,
  Shield,
  Trash2,
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
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"orders" | "users">("orders");

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [targetStatus, setTargetStatus] = useState<string>("IN_PROGRESS");
  const [adminNote, setAdminNote] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  // Chat Modal State
  const [chatModalOrder, setChatModalOrder] = useState<any | null>(null);
  const [adminMessage, setAdminMessage] = useState<string>("");
  const [sendingChat, setSendingChat] = useState<boolean>(false);

  // Users State
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>("");

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error("Kernel order fetch failed:", e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error("Kernel users fetch failed:", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const handleSendAdminMessage = async () => {
    if (!adminMessage.trim() || !chatModalOrder) return;
    setSendingChat(true);
    try {
      const res = await fetch(`/api/orders/${chatModalOrder.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: adminMessage }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedMsg = data.message;
        setChatModalOrder((prev: any) => ({
          ...prev,
          updates: [...(prev.updates || []), updatedMsg],
        }));
        setOrders((prev) =>
          prev.map((o) =>
            o.id === chatModalOrder.id
              ? { ...o, updates: [...(o.updates || []), updatedMsg] }
              : o
          )
        );
        setAdminMessage("");
      }
    } catch (e) {
      console.error("Failed to send admin message:", e);
    } finally {
      setSendingChat(false);
    }
  };

  const handleDeleteChat = async () => {
    if (!chatModalOrder) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to completely erase all chat history for this order? This action is permanent."
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/orders/${chatModalOrder.id}/messages`, {
        method: "DELETE",
      });
      if (res.ok) {
        setChatModalOrder((prev: any) => ({
          ...prev,
          updates: [],
        }));
        setOrders((prev) =>
          prev.map((o) => (o.id === chatModalOrder.id ? { ...o, updates: [] } : o))
        );
      }
    } catch (e) {
      console.error("Failed to delete chat:", e);
    }
  };

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
      ord.serviceTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.clientName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-[95vw] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-black/[0.08] gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono font-semibold mb-2 flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-neutral-800" />
            <span>Kernel Control System // Nexora Solutions</span>
          </div>
          <h1 className="text-3xl font-light text-neutral-900">Admin Kernel Console</h1>
          <p className="text-xs text-neutral-600 mt-1">
            Manage incoming orders, communicate via direct project chat, and review registered clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Section Switcher Tabs */}
          <div className="flex rounded-full bg-neutral-200/80 p-1 border border-neutral-300">
            <button
              onClick={() => setActiveTab("orders")}
              aria-label="View Orders tab"
              className={`rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
                activeTab === "orders"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-700 hover:text-black"
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              aria-label="View Users tab"
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
                activeTab === "users"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-700 hover:text-black"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Signed-In Users ({users.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              fetchOrders();
              fetchUsers();
            }}
            aria-label="Refresh Data"
            className="flex items-center gap-2 rounded-full border border-black/[0.09] bg-white px-4 py-2 text-xs text-neutral-700 hover:text-neutral-950 transition-colors uppercase tracking-wider font-mono text-[11px] shadow-sm"
          >
            <RefreshCw
              className={`h-3 w-3 ${loadingOrders || loadingUsers ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/kernel/login" })}
            aria-label="Terminate Kernel Session"
            className="flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 px-4 py-2 text-xs uppercase tracking-wider font-mono text-[11px] font-semibold transition-colors shadow-sm"
            title="Terminate Kernel Session"
          >
            <LogOut className="h-3 w-3 text-neutral-700" />
            <span>Exit Kernel</span>
          </button>
        </div>
      </div>

      {activeTab === "orders" ? (
        <>
          {/* KPI Row */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm">
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono mb-1">
                Total Revenue
              </div>
              <div className="text-2xl font-light text-neutral-900 font-serif">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="text-[11px] text-neutral-600 mt-2 font-mono">All-time volume</div>
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm">
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono mb-1">
                Active Orders
              </div>
              <div className="text-2xl font-light text-neutral-900 font-serif">{activeOrders}</div>
              <div className="text-[11px] text-neutral-600 mt-2 font-mono">In production cycle</div>
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm">
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono mb-1">
                Review Queue
              </div>
              <div className="text-2xl font-light text-neutral-900 font-serif">{pendingReview}</div>
              <div className="text-[11px] text-amber-800 mt-2 font-mono font-semibold">
                Pending director triage
              </div>
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm">
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono mb-1">
                Completed Editions
              </div>
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
                    aria-label={`Filter by status ${status}`}
                    className={`rounded-full px-3.5 py-1 text-xs uppercase tracking-wider font-mono transition-all ${
                      statusFilter === status
                        ? "bg-neutral-900 text-white font-bold shadow-md"
                        : "bg-white text-neutral-700 hover:text-black border border-black/[0.08] shadow-sm"
                    }`}
                  >
                    {status.replace(/_/g, " ")}
                  </button>
                )
              )}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search orders, client, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search orders"
                className="w-full rounded-full border border-black/[0.1] bg-white py-2 pl-9 pr-4 text-xs text-neutral-900 placeholder-neutral-400 focus:border-neutral-800 focus:outline-none shadow-sm"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="mt-6 overflow-x-auto rounded-2xl border border-black/[0.08] bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/[0.08] bg-[#fbfaf8] text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
                  <th className="py-4 px-6">ID & Date</th>
                  <th className="py-4 px-6">Client Info</th>
                  <th className="py-4 px-6">Service / Package</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] text-xs">
                {loadingOrders ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500 font-mono">
                      Loading incoming client orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500 font-mono">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#fbfaf8]/80 transition-colors">
                      <td className="py-4 px-6 font-mono text-[11px]">
                        <div className="font-semibold text-neutral-900">{ord.id}</div>
                        <div className="text-[10px] text-neutral-500">{formatDate(ord.createdAt)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-neutral-900">{ord.clientName || "Client"}</div>
                        <div className="text-[11px] text-neutral-500 font-mono truncate max-w-[180px]">
                          {ord.clientEmail || "—"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-neutral-900">
                          {ord.package?.service?.title || ord.serviceTitle || "Custom Solution"}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {ord.package?.name || "Standard Scope"}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-serif font-medium text-neutral-900">
                        {formatCurrency(ord.totalPrice)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-mono font-semibold uppercase text-neutral-800 border border-neutral-300">
                          {ord.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {/* Chat button */}
                        <button
                          onClick={() => setChatModalOrder(ord)}
                          aria-label={`Open chat for order ${ord.id}`}
                          className="rounded-full border border-neutral-300 bg-neutral-100 hover:bg-neutral-200 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-900 font-semibold shadow-sm inline-flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="h-3 w-3 text-neutral-700" />
                          <span>Chat</span>
                          {ord.updates && ord.updates.length > 0 && (
                            <span className="rounded-full bg-neutral-800 text-white px-1.5 text-[9px] font-bold">
                              {ord.updates.length}
                            </span>
                          )}
                        </button>

                        {/* Quick Accept/Decline if PENDING */}
                        {ord.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(ord.id, "ACCEPTED", "Order accepted.")}
                              aria-label="Accept order"
                              className="rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-[10px] text-white hover:bg-neutral-800 font-mono font-semibold shadow-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(ord.id, "CANCELLED", "Order declined.")}
                              aria-label="Decline order"
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
                          aria-label="Update order status"
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
        </>
      ) : (
        /* Users List Section */
        <div className="mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-black/[0.08] pb-6">
            <div>
              <h2 className="text-xl font-light text-neutral-900">Signed-In Google & System Accounts</h2>
              <p className="text-xs text-neutral-500 mt-1 font-mono">
                Real-time registry of all clients authenticated via Google OAuth with profile pictures, emails, and order activity.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search user name or gmail..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                aria-label="Search users"
                className="w-full rounded-full border border-black/[0.1] bg-white py-2 pl-9 pr-4 text-xs text-neutral-900 placeholder-neutral-400 focus:border-neutral-800 focus:outline-none shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-black/[0.08] bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/[0.08] bg-[#fbfaf8] text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
                  <th className="py-4 px-6">Avatar & Profile</th>
                  <th className="py-4 px-6">Google Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Orders Placed</th>
                  <th className="py-4 px-6">Account Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] text-xs">
                {loadingUsers ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-neutral-500 font-mono">
                      Loading user accounts...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-neutral-500 font-mono">
                      No registered users found matching the query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#fbfaf8]/80 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        {u.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.image}
                            alt={u.name || "User profile"}
                            className="h-10 w-10 rounded-full object-cover border border-neutral-300 shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 font-bold text-xs uppercase shadow-inner">
                            {u.name ? u.name.charAt(0) : "U"}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-neutral-900">{u.name || "Anonymous Client"}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">UID: {u.id}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-neutral-700 font-medium">
                        {u.email}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                            u.role === "ADMIN"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-neutral-100 text-neutral-800 border border-neutral-300"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono font-semibold text-neutral-800">
                        {u._count?.orders ?? 0}
                      </td>
                      <td className="py-4 px-6 font-mono text-neutral-500 text-[11px]">
                        {formatDate(u.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WhatsApp Chat Modal for Admin */}
      {chatModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-300 relative">
            <button
              onClick={() => setChatModalOrder(null)}
              aria-label="Close chat modal"
              className="absolute top-3.5 right-4 z-10 text-neutral-300 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-1.5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <WhatsAppChatBox
              title={`Chat // ${chatModalOrder.package?.service?.title || chatModalOrder.serviceTitle || "Order"} (Client: ${chatModalOrder.clientName || chatModalOrder.clientEmail || "Customer"})`}
              subtitle={`Order ID: ${chatModalOrder.id} • Live Customer Channel`}
              messages={chatModalOrder.updates || []}
              currentUserEmail={session?.user?.email}
              currentUserId={session?.user?.id}
              currentRole="ADMIN"
              newMessage={adminMessage}
              setNewMessage={setAdminMessage}
              onSendMessage={handleSendAdminMessage}
              onDeleteChat={handleDeleteChat}
              submitting={sendingChat}
            />
          </div>
        </div>
      )}

      {/* Status Transition Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-black/[0.09] bg-white p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <h3 className="text-sm font-semibold text-neutral-900">Transition Production State</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                aria-label="Close status transition modal"
                className="text-neutral-500 hover:text-neutral-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs font-mono text-neutral-500">Ref: {selectedOrder.id}</div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-mono font-medium mb-2">
                Target State
              </label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
                aria-label="Select target state"
                className="w-full rounded-xl border border-black/[0.1] bg-[#f7f6f2] p-2.5 text-xs text-neutral-900 focus:border-neutral-800 focus:bg-white focus:outline-none"
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
                aria-label="Production milestone note"
                className="w-full rounded-xl border border-black/[0.1] bg-[#f7f6f2] p-3 text-xs text-neutral-900 placeholder-neutral-500 focus:border-neutral-800 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                aria-label="Cancel update"
                className="rounded-full px-4 py-2 text-xs text-neutral-600 hover:text-black font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, targetStatus, adminNote)}
                disabled={updating}
                aria-label="Execute status transition"
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
