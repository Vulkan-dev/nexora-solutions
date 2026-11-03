"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ShieldAlert, ArrowLeft } from "lucide-react";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [loading, setLoading] = useState<boolean>(false);
  const [simulatingRole, setSimulatingRole] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn("google", { callbackUrl });
  };

  const handleSimulateLogin = async (role: "CUSTOMER" | "ADMIN") => {
    setSimulatingRole(role);
    try {
      const targetUrl = role === "ADMIN" ? "/admin" : callbackUrl;
      const res = await signIn("simulated-auth", {
        role,
        name: role === "ADMIN" ? "Studio Lead Director" : "Alexandra Vance",
        email: role === "ADMIN" ? "director@nexorasolutions.com" : "alexandra.vance@nexorasolutions.com",
        redirect: false,
        callbackUrl: targetUrl,
      });

      if (res?.ok) {
        window.location.href = targetUrl;
      } else {
        router.push(targetUrl);
      }
    } catch (e) {
      console.error("Simulation error:", e);
      setSimulatingRole(null);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="relative w-full max-w-md rounded-2xl border border-black/[0.08] bg-white p-8 sm:p-10 space-y-8 shadow-xl">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-widest text-amber-800 font-mono font-semibold mb-2">
            Sign In // Nexora Solutions
          </div>
          <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Sign In to Your Account</h1>
          <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
            Sign in with Google to place orders, check project status, and chat with me directly.
          </p>
        </div>

        {/* Real Google OAuth Login Button */}
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={loading || !!simulatingRole}
            className="w-full flex items-center justify-center gap-3 rounded-full border border-black/[0.12] bg-[#f7f6f2] px-6 py-3.5 text-xs font-semibold text-neutral-900 hover:border-black/30 hover:bg-white shadow-sm transition-all focus:outline-none disabled:opacity-40"
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
            <span className="uppercase tracking-wider text-[11px]">Continue with Google</span>
          </button>
        </div>

        {/* Temporary Quick Test Simulated Logins */}
        <div className="rounded-xl border border-amber-700/20 bg-[#f4f2ec] p-4 space-y-3 shadow-inner">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-800 font-mono font-semibold">
            <Zap className="h-3.5 w-3.5 text-amber-700" />
            <span>Developer Testing Simulations</span>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => handleSimulateLogin("CUSTOMER")}
              disabled={!!simulatingRole}
              className="w-full flex items-center justify-between rounded-lg border border-black/[0.08] bg-white px-3.5 py-2 text-xs text-neutral-800 hover:border-black/25 hover:text-black transition-all font-mono shadow-sm"
            >
              <span>⚡ Simulate Client Login</span>
              <span className="text-[10px] text-neutral-500">Alexandra Vance</span>
            </button>

            <button
              onClick={() => handleSimulateLogin("ADMIN")}
              disabled={!!simulatingRole}
              className="w-full flex items-center justify-between rounded-lg border border-black/[0.08] bg-white px-3.5 py-2 text-xs text-neutral-800 hover:border-black/25 hover:text-black transition-all font-mono shadow-sm"
            >
              <span>⚡ Simulate Admin Hub Access</span>
              <span className="text-[10px] text-amber-800 font-semibold">Studio Director</span>
            </button>
          </div>
        </div>

        {/* Return to Home */}
        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-neutral-600 hover:text-neutral-950 transition-colors font-mono font-medium"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Return to Index</span>
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
        <div className="min-h-[80vh] flex items-center justify-center text-xs text-neutral-400 font-mono uppercase tracking-widest">
          Loading Sign In...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
