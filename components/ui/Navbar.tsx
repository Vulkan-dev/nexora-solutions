"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, LogIn, User } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/order", label: "Order Now" },
    { href: "/dashboard", label: "My Orders & Chat" },
  ];

  if (session?.user?.role === "ADMIN") {
    navLinks.push({ href: "/admin", label: "Admin Panel" });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.08] bg-[#f8f7f4]/85 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex h-20 w-full max-w-[95vw] items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3 text-neutral-900 transition-opacity hover:opacity-90">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/64x64.png"
            alt="Nexora Solutions"
            className="h-8 w-8 sm:h-9 sm:w-9 object-contain flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <span className="text-sm font-semibold tracking-[0.22em] uppercase text-neutral-900">
              NEXORA
            </span>
            <span className="text-[10px] text-neutral-500 tracking-[0.22em] uppercase">Solutions</span>
          </div>
        </Link>

        {/* Center Minimal Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-2 transition-colors duration-200",
                  isActive ? "text-neutral-950 font-semibold" : "text-neutral-600 hover:text-neutral-950"
                )}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-700"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Auth / Action */}
        <div className="hidden md:flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full border border-black/[0.09] bg-white px-3.5 py-1.5 text-xs text-neutral-800 hover:border-black/20 shadow-sm transition-all"
              >
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Avatar"}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-3.5 w-3.5 text-amber-700" />
                )}
                <span className="max-w-[110px] truncate text-[11px] font-medium">
                  {session.user.name || session.user.email}
                </span>
                {session.user.role === "ADMIN" && (
                  <span className="rounded bg-black/[0.06] px-1.5 py-0.2 text-[9px] font-mono uppercase text-amber-800 font-semibold">
                    ADMIN
                  </span>
                )}
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.09] text-neutral-500 hover:text-neutral-950 bg-white hover:bg-neutral-50 shadow-sm transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/signin">
                <span className="text-xs uppercase tracking-wider text-neutral-600 hover:text-neutral-950 transition-colors px-2 font-medium">
                  Sign In
                </span>
              </Link>
              <Link href="/order">
                <MagneticButton variant="primary" className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wider">
                  <span>Order Now</span>
                </MagneticButton>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.09] bg-white text-neutral-700 shadow-sm"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
            className="border-b border-black/[0.08] bg-[#f8f7f4]/98 px-6 py-6 md:hidden shadow-lg backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase tracking-widest text-neutral-700 hover:text-neutral-950 py-1 font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-[1px] bg-black/[0.08]" />
              {session?.user ? (
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-neutral-600">
                    Logged in as {session.user.name || session.user.email}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 text-xs text-neutral-700 hover:text-neutral-950 py-1"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full border border-black/[0.12] bg-white px-4 py-2.5 text-center text-xs uppercase tracking-wider text-neutral-800 shadow-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full bg-neutral-900 text-white px-4 py-2.5 text-center text-xs uppercase tracking-wider font-semibold shadow-md"
                  >
                    Order Now
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
