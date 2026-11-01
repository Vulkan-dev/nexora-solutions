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
    navLinks.push({ href: "/admin", label: "Studio Admin" });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-baseline gap-2 text-white">
          <span className="text-sm font-semibold tracking-[0.25em] uppercase text-cream-100">
            NEXORA
          </span>
          <span className="text-[10px] text-neutral-500 tracking-[0.25em] uppercase">Solutions</span>
        </Link>

        {/* Center Minimal Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-2 transition-colors duration-200",
                  isActive ? "text-cream-100" : "text-neutral-400 hover:text-white"
                )}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-cream-300"
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
                className="flex items-center gap-2 rounded-full border border-white/10 bg-surfaceElevated px-3.5 py-1.5 text-xs text-neutral-300 hover:border-white/25 transition-colors"
              >
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Avatar"}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-3.5 w-3.5 text-cream-300" />
                )}
                <span className="max-w-[110px] truncate text-[11px] font-medium">
                  {session.user.name || session.user.email}
                </span>
                {session.user.role === "ADMIN" && (
                  <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] font-mono uppercase text-cream-300">
                    ADMIN
                  </span>
                )}
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/signin">
                <span className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors px-2">
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-300"
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
            className="border-b border-white/10 bg-background/95 px-6 py-6 md:hidden backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase tracking-widest text-neutral-300 hover:text-white py-1"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-[1px] bg-white/[0.08]" />
              {session?.user ? (
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-neutral-400">
                    Logged in as {session.user.name || session.user.email}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 text-xs text-neutral-300 hover:text-white py-1"
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
                    className="rounded-full border border-white/15 px-4 py-2.5 text-center text-xs uppercase tracking-wider text-white"
                  >
                    Client Ingress
                  </Link>
                  <Link
                    href="/order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full bg-cream-100 text-neutral-900 px-4 py-2.5 text-center text-xs uppercase tracking-wider font-semibold"
                  >
                    Commission
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
