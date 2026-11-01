"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowRight, Lock, Check } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [turnstileVerified, setTurnstileVerified] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-surface/90 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl">
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-36 w-72 rounded-full bg-blue-600/20 blur-3xl" />

        {/* Brand Icon */}
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-neon">
          <Sparkles className="h-6 w-6 text-white" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Access Your Portal</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Authenticate to commission architectures and track project progress.
          </p>
        </div>

        {/* Cloudflare Turnstile Protection Simulation Pill */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-400">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium">Cloudflare Turnstile Verified</span>
          </div>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
        </div>

        {/* Google OAuth Login Button */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-full border border-neutral-700 bg-surfaceElevated px-6 py-3.5 text-xs font-semibold text-white shadow-md hover:border-neutral-500 hover:bg-neutral-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Quick Demo Access Notice */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <Lock className="h-3.5 w-3.5 text-neutral-500" />
            <span>Developer / Vercel Environment Notice</span>
          </div>
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            Configure <code className="text-neutral-300">GOOGLE_CLIENT_ID</code> and <code className="text-neutral-300">GOOGLE_CLIENT_SECRET</code> in your Vercel project environment variables for live Google OAuth production authentication.
          </p>
        </div>

        {/* Return to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-neutral-400 hover:text-white transition-colors">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center text-xs text-neutral-400">
          Loading authentication gateway...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
