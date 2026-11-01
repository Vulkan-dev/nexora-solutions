"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Layers,
  ShoppingBag,
  LayoutDashboard,
  Shield,
  Menu,
  X,
  LogOut,
  LogIn,
  User,
} from "lucide-react";
import MagneticButton from "./MagneticButton";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/order", label: "Build Order" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  if (session?.user?.role === "ADMIN") {
    navLinks.push({ href: "/admin", label: "Admin Hub" });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5 font-bold tracking-tight text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-neon">
            <Sparkles className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <span className="text-lg font-bold tracking-wider">
            RADIANT<span className="text-blue-400">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-surface/60 px-3 py-1.5 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-200",
                  isActive ? "text-white" : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full border border-neutral-700 bg-surfaceElevated px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-500 transition-colors"
              >
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Avatar"}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-blue-400" />
                )}
                <span className="max-w-[100px] truncate">{session.user.name || session.user.email}</span>
                {session.user.role === "ADMIN" && (
                  <span className="rounded bg-blue-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-blue-400">
                    ADMIN
                  </span>
                )}
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign out"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/signin">
                <MagneticButton variant="outline" className="px-4 py-2 text-xs">
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </MagneticButton>
              </Link>
              <Link href="/order">
                <MagneticButton variant="glow" className="px-4 py-2 text-xs">
                  <span>Get Started</span>
                </MagneticButton>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 text-neutral-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-neutral-800 bg-background/95 px-4 py-6 md:hidden backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-[1px] bg-neutral-800" />
              {session?.user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-1 text-xs text-neutral-400">
                    Signed in as {session.user.name || session.user.email}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg border border-neutral-700 px-4 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white shadow-neon"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
