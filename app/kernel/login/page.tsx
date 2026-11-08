"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowLeft, AlertCircle } from "lucide-react";

function KernelLoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/kernel";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("admin-credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("Invalid credentials or unauthorized access.");
      } else if (res?.ok) {
        window.location.href = callbackUrl;
      }
    } catch (err: any) {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-20 select-none">
      <div className="relative w-full max-w-md rounded-2xl border border-black/[0.12] bg-white p-8 sm:p-10 space-y-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-50 px-3 py-1 text-[10px] uppercase tracking-widest text-amber-900 font-mono font-semibold">
            <Shield className="h-3.5 w-3.5 text-amber-800" />
            <span>Root Kernel Access</span>
          </div>
          <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Administrative Console</h1>
          <p className="text-xs text-neutral-500 font-mono">
            Direct credential challenge required.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 flex items-center gap-2.5 text-xs text-red-800">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-700 mb-1.5 font-medium">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                autoComplete="off"
                className="w-full rounded-xl border border-black/[0.12] bg-[#f7f6f2] py-2.5 pl-10 pr-4 text-xs text-neutral-900 placeholder-neutral-400 focus:border-amber-700 focus:bg-white focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-700 mb-1.5 font-medium">
              Kernel Secret Key
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-black/[0.12] bg-[#f7f6f2] py-2.5 pl-10 pr-4 text-xs text-neutral-900 placeholder-neutral-400 focus:border-amber-700 focus:bg-white focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-neutral-900 py-3 text-xs uppercase tracking-widest font-semibold text-white hover:bg-neutral-800 transition-all shadow-md disabled:opacity-40 font-mono"
            >
              {loading ? "Authenticating..." : "Authenticate Session"}
            </button>
          </div>
        </form>

        <div className="pt-2 text-center border-t border-black/[0.06]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-neutral-500 hover:text-neutral-950 transition-colors font-mono font-medium"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Return to Site</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function KernelLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center text-xs text-neutral-400 font-mono uppercase tracking-widest">
          Loading Security Module...
        </div>
      }
    >
      <KernelLoginContent />
    </Suspense>
  );
}
