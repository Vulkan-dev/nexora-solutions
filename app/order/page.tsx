"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getAllServices } from "@/lib/catalog";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  Trash2,
  AlertCircle,
  UserCheck,
  Layers,
  Globe,
  Bot,
  Sparkles,
  Palette,
  Plus,
  X,
  MessageSquare,
} from "lucide-react";

// Predefined curated color presets
const COLOR_PRESETS = [
  {
    name: "Midnight Obsidian & Gold",
    colors: ["#090a0d", "#c5a880", "#f6f2ea", "#181920"],
  },
  {
    name: "Neon Cyberpunk",
    colors: ["#0a0e17", "#00ffcc", "#ff007f", "#131b2b"],
  },
  {
    name: "Minimalist Monochrome",
    colors: ["#0f1015", "#3b82f6", "#ffffff", "#1e2029"],
  },
  {
    name: "Emerald Forest",
    colors: ["#061a14", "#10b981", "#ecfdf5", "#0b2e24"],
  },
  {
    name: "Royal Amethyst",
    colors: ["#0d0914", "#a855f7", "#faf5ff", "#1b1429"],
  },
];

const APP_TYPES = [
  {
    id: "saas",
    serviceId: "srv-saas",
    title: "SaaS App",
    badge: "Most Requested",
    icon: Layers,
    desc: "Multi-tenant platforms, recurring Stripe subscriptions, auth, user & admin dashboards, databases.",
  },
  {
    id: "fullstack",
    serviceId: "srv-fullstack",
    title: "Fullstack Web Application",
    badge: "Core Engineering",
    icon: Globe,
    desc: "Next.js 14+ App Router, responsive modern UI, custom APIs, PostgreSQL / Supabase, payments.",
  },
  {
    id: "discord",
    serviceId: "srv-discord",
    title: "Discord Bots",
    badge: "Community Tools",
    icon: Bot,
    desc: "Slash commands, auto-roles, payment/crypto gating, AI moderation, and web management dashboard.",
  },
  {
    id: "others",
    serviceId: "srv-fullstack",
    title: "Others (Custom Project)",
    badge: "Custom Project",
    icon: Sparkles,
    desc: "Custom scripts, integrations, unique architectures, or specialized software engineering.",
  },
];

function OrderWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: authStatus, update } = useSession();
  const allServices = getAllServices();

  const queryType = searchParams.get("type");
  const queryServiceId = searchParams.get("serviceId");
  const queryPackageId = searchParams.get("packageId");

  const matchedAppType =
    (queryServiceId && APP_TYPES.find((t) => t.serviceId === queryServiceId)) ||
    (queryType && APP_TYPES.find((t) => t.id === queryType)) ||
    APP_TYPES[0];

  // Steps: 1: App Type, 2: Color Theme, 3: Details & References, 4: Review & Auth, 5: Success
  const [step, setStep] = useState<number>(1);

  // Step 1: App Type
  const [selectedAppTypeId, setSelectedAppTypeId] = useState<string>(matchedAppType.id);
  const [customAppType, setCustomAppType] = useState<string>("");

  // Step 2: Color Theme
  const [colorMode, setColorMode] = useState<"DEV_CHOOSES" | "CUSTOM">("DEV_CHOOSES");
  const [colors, setColors] = useState<string[]>(["#090a0d", "#c5a880", "#f6f2ea", "#181920"]);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(1);
  const [activePickerColor, setActivePickerColor] = useState<string>("#c5a880");

  // Step 3: Requirements & References
  const [requirements, setRequirements] = useState<string>("");
  const [referenceLinks, setReferenceLinks] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; url: string; type: string; size?: number; previewUrl?: string }>
  >([]);

  // Auth & Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  const activeAppType = APP_TYPES.find((a) => a.id === selectedAppTypeId) || APP_TYPES[0];
  const matchedService = allServices.find((s) => s.id === activeAppType.serviceId) || allServices[0];
  const selectedPackage =
    (queryPackageId && matchedService?.packages?.find((p) => p.id === queryPackageId)) ||
    matchedService?.packages?.[0];

  const isUserAuthenticated = !!session?.user;
  const activeUser = session?.user;

  // Sync color picker with selected chip
  const handleSelectColorChip = (idx: number) => {
    setSelectedColorIdx(idx);
    setActivePickerColor(colors[idx] || "#c5a880");
  };

  const handleUpdateActiveColor = (hex: string) => {
    setActivePickerColor(hex);
    setColors((prev) => {
      const copy = [...prev];
      copy[selectedColorIdx] = hex;
      return copy;
    });
  };

  const handleAddColor = () => {
    if (colors.length >= 7) return;
    const newColor = activePickerColor;
    setColors((prev) => [...prev, newColor]);
    setSelectedColorIdx(colors.length);
  };

  const handleRemoveColor = (idxToRemove: number) => {
    if (colors.length <= 1) return;
    const updated = colors.filter((_, idx) => idx !== idxToRemove);
    setColors(updated);
    setSelectedColorIdx(Math.max(0, idxToRemove - 1));
    setActivePickerColor(updated[Math.max(0, idxToRemove - 1)] || "#c5a880");
  };

  const handleApplyPreset = (presetColors: string[]) => {
    setColors(presetColors);
    setSelectedColorIdx(1);
    setActivePickerColor(presetColors[1] || "#c5a880");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).map((f) => {
      const isImg = f.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(f.name);
      const previewUrl = isImg ? URL.createObjectURL(f) : undefined;
      return {
        name: f.name,
        url: `https://storage.nexorasolutions.com/uploads/${Math.random().toString(36).substring(2, 8)}-${f.name.replace(/\s+/g, "-")}`,
        type: f.type || "application/octet-stream",
        size: f.size,
        previewUrl,
      };
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitOrder = async () => {
    if (!isUserAuthenticated) {
      setSubmitError("Please sign in with Google before submitting your order.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        serviceId: matchedService.id,
        packageId: selectedPackage?.id || "pkg-default",
        appType: activeAppType.title,
        customAppType: activeAppType.id === "others" ? customAppType : "",
        colorThemeMode: colorMode,
        customColors: colorMode === "CUSTOM" ? colors : [],
        referenceLinks,
        requirements: requirements || `Quest order for ${activeAppType.title}. Standard specifications.`,
        uploadedFiles,
        clientName: activeUser?.name || "Client",
        clientEmail: activeUser?.email || "client@example.com",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit order");
      }

      setOrderSuccessId(data.orderId);
      setStep(5);
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[95vw] 2xl:max-w-[90vw] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16">
      {/* Wizard Header & Progress */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <div className="text-[10px] uppercase tracking-widest text-amber-800 font-mono font-semibold mb-2">
          Order Form // Project Details
        </div>
        <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 tracking-tight">
          Start Your New Project
        </h1>
        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
          Tell me what kind of app or bot you need, choose your colors, and submit your details to get started.
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="mb-14 flex items-center justify-center">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-2">
          {[
            { num: 1, label: "App Type" },
            { num: 2, label: "Color Theme" },
            { num: 3, label: "Details & Links" },
            { num: 4, label: "Review & Submit" },
          ].map((s) => (
            <React.Fragment key={s.num}>
              <button
                type="button"
                onClick={() => {
                  if (step < 5 && s.num <= step) setStep(s.num);
                }}
                disabled={step === 5}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-mono transition-all ${
                  step === s.num
                    ? "bg-neutral-900 text-white font-semibold shadow-md"
                    : step > s.num
                    ? "border border-black/[0.12] bg-white text-neutral-800 hover:border-black/25 shadow-sm"
                    : "border border-black/[0.06] bg-transparent text-neutral-400 opacity-60"
                }`}
              >
                <span>0{s.num}.</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {s.num < 4 && <div className="h-[1px] w-4 sm:w-8 bg-black/[0.08]" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* STEP 1: WHICH TYPE OF APP */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div className="border-b border-black/[0.08] pb-4">
              <span className="text-[10px] uppercase tracking-widest text-amber-800 font-mono font-semibold">
                Step 01 // Choose Project Type
              </span>
              <h2 className="text-2xl font-light text-neutral-900 tracking-tight mt-1">
                Which type of app do you need to build?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {APP_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedAppTypeId === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => setSelectedAppTypeId(type.id)}
                    className={`group relative cursor-pointer rounded-2xl border p-6 transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? "border-amber-700 bg-amber-50/60 shadow-md"
                        : "border-black/[0.08] bg-white hover:border-black/20 hover:bg-neutral-50 shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                            isSelected
                              ? "border-amber-700/40 bg-amber-100 text-amber-900"
                              : "border-black/[0.08] bg-black/[0.03] text-neutral-600 group-hover:text-black"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[9px] uppercase tracking-wider font-mono text-neutral-500">
                          {type.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-medium text-neutral-900 mb-2">{type.title}</h3>
                      <p className="text-xs text-neutral-600 leading-relaxed mb-4">{type.desc}</p>
                    </div>

                    <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-amber-800 font-mono font-medium">
                        Custom Scope
                      </span>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? "border-amber-700 bg-amber-700" : "border-neutral-300"
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5 text-white stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom description field if "Others" selected */}
            {selectedAppTypeId === "others" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-2xl border border-amber-700/30 bg-white p-6 space-y-3 shadow-sm"
              >
                <label className="block text-xs uppercase tracking-wider text-amber-800 font-mono font-semibold">
                  Describe Your Custom App / System Type:
                </label>
                <input
                  type="text"
                  value={customAppType}
                  onChange={(e) => setCustomAppType(e.target.value)}
                  placeholder="e.g. Chrome Extension, AI Trading Bot, Web Scraping Engine, Custom CRM..."
                  className="w-full rounded-xl border border-black/[0.1] bg-[#f7f6f2] px-4 py-3 text-sm text-neutral-900 placeholder-neutral-500 focus:border-amber-700 focus:bg-white focus:outline-none"
                />
              </motion.div>
            )}

            {/* Next Step CTA */}
            <div className="pt-6 flex justify-end">
              <MagneticButton
                variant="primary"
                onClick={() => setStep(2)}
                className="px-8 py-3 text-xs uppercase tracking-wider font-semibold"
              >
                <span>Continue to Color Theme</span>
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </motion.div>
        )}

        {/* STEP 2: COLOR THEME & PALETTE PICKER */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div className="border-b border-black/[0.08] pb-4">
              <span className="text-[10px] uppercase tracking-widest text-amber-800 font-mono font-semibold">
                Step 02 // Color Theme
              </span>
              <h2 className="text-2xl font-light text-neutral-900 tracking-tight mt-1">
                Pick Your Project Colors
              </h2>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setColorMode("DEV_CHOOSES")}
                className={`cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                  colorMode === "DEV_CHOOSES"
                    ? "border-amber-700 bg-amber-50/60 shadow-md"
                    : "border-black/[0.08] bg-white hover:border-black/20 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="h-4 w-4 text-amber-700" />
                    <h3 className="text-base font-medium text-neutral-900">Let Developer Choose</h3>
                  </div>
                  <span className="rounded bg-amber-100 border border-amber-300 px-2 py-0.5 text-[9px] font-mono uppercase text-amber-900 font-semibold">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  I will pick clean, modern, and high-contrast colors that look great for your project.
                </p>
              </div>

              <div
                onClick={() => setColorMode("CUSTOM")}
                className={`cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                  colorMode === "CUSTOM"
                    ? "border-amber-700 bg-amber-50/60 shadow-md"
                    : "border-black/[0.08] bg-white hover:border-black/20 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <Palette className="h-4 w-4 text-amber-700" />
                    <h3 className="text-base font-medium text-neutral-900">Pick Custom Colors</h3>
                  </div>
                  <span className="rounded bg-black/[0.06] px-2 py-0.5 text-[9px] font-mono uppercase text-neutral-700 font-medium">
                    Interactive
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Use the color wheel to select your favorite colors. You can add, edit, or remove colors to match your brand.
                </p>
              </div>
            </div>

            {/* Interactive Color Wheel & Palette Editor */}
            {colorMode === "CUSTOM" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-8 space-y-8 shadow-md"
              >
                {/* 1. Curated Quick Inspiration Presets */}
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono font-medium mb-3">
                    Quick Preset Inspirations
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleApplyPreset(preset.colors)}
                        className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-[#f7f6f2] px-3 py-2 text-xs text-neutral-700 hover:border-black/25 hover:bg-white shadow-sm transition-all"
                      >
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {preset.colors.map((c, i) => (
                            <span
                              key={i}
                              className="inline-block h-3.5 w-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-medium">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Color Palette Chips (Add / Edit / Remove) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[10px] uppercase tracking-widest text-amber-800 font-mono font-semibold">
                      Your Active Color Palette ({colors.length}/7)
                    </div>
                    <button
                      type="button"
                      onClick={handleAddColor}
                      disabled={colors.length >= 7}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:text-black font-medium transition-colors disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Color</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {colors.map((color, idx) => {
                      const isSelected = selectedColorIdx === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleSelectColorChip(idx)}
                          className={`relative cursor-pointer rounded-xl border p-3 flex items-center justify-between transition-all ${
                            isSelected
                              ? "border-amber-700 bg-amber-50 shadow-sm"
                              : "border-black/[0.08] bg-[#f7f6f2] hover:border-black/20 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="h-6 w-6 rounded-lg border border-black/20 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                            <div>
                              <div className="text-[10px] uppercase font-mono text-neutral-500">
                                {idx === 0 ? "Base" : idx === 1 ? "Primary" : idx === 2 ? "Accent" : `Color ${idx + 1}`}
                              </div>
                              <div className="text-xs font-mono text-neutral-900 font-semibold uppercase">{color}</div>
                            </div>
                          </div>

                          {colors.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveColor(idx);
                              }}
                              className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                              title="Remove color"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Color Wheel & Hex Input */}
                <div className="rounded-2xl border border-black/[0.07] bg-[#f4f2ec] p-5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner">
                  <div className="flex items-center gap-4">
                    {/* HTML5 Native Color Wheel */}
                    <div className="relative flex items-center justify-center">
                      <input
                        type="color"
                        value={activePickerColor}
                        onChange={(e) => handleUpdateActiveColor(e.target.value)}
                        className="h-14 w-14 cursor-pointer rounded-full border-2 border-white shadow-md bg-transparent p-0 transition-transform hover:scale-105"
                        title="Click to open Color Wheel"
                      />
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-neutral-600 font-mono font-medium">
                        Color Wheel Selection
                      </div>
                      <div className="text-xs text-neutral-700 mt-0.5">
                        Click the swatch to open the color wheel & adjust the hex value.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="font-mono text-xs text-neutral-600 font-medium">HEX:</span>
                    <input
                      type="text"
                      value={activePickerColor}
                      onChange={(e) => handleUpdateActiveColor(e.target.value)}
                      className="w-28 rounded-lg border border-black/[0.1] bg-white px-3 py-2 text-xs font-mono uppercase text-neutral-900 focus:border-amber-700 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                {/* 4. Live UI Mockup Preview */}
                <div className="rounded-2xl border border-black/[0.08] p-5 space-y-3 bg-white shadow-sm">
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono font-medium">
                    Live Palette Harmony Preview
                  </div>
                  <div
                    className="rounded-xl p-5 border transition-all shadow-sm"
                    style={{
                      backgroundColor: colors[0] || "#f7f6f2",
                      borderColor: colors[1] || "#927144",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: colors[1] || "#927144" }}
                      >
                        Sample Interface Card
                      </span>
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: colors[2] || "#14151a" }}
                      />
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: colors[2] || "#14151a" }}
                    >
                      This preview demonstrates how your chosen base background, primary accent, and text contrast harmoniously in production.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step Controls */}
            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-600 hover:text-black transition-colors font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <MagneticButton
                variant="primary"
                onClick={() => setStep(3)}
                className="px-8 py-3 text-xs uppercase tracking-wider font-semibold"
              >
                <span>Continue to Details & References</span>
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </motion.div>
        )}

        {/* STEP 3: ADDITIONAL INFO & REFERENCES */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div className="border-b border-black/[0.08] pb-4">
              <span className="text-[10px] uppercase tracking-widest text-amber-800 font-mono font-semibold">
                Step 03 // Project Details & Files
              </span>
              <h2 className="text-2xl font-light text-neutral-900 tracking-tight mt-1">
                Tell Me About Your Project
              </h2>
            </div>

            {/* 1. Requirements Textarea */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-neutral-800 font-mono font-semibold">
                Project Details & Key Features <span className="text-amber-800">*</span>
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={5}
                placeholder="Describe what your app should do, core features (e.g. user authentication, payment tiers, discord slash commands, web scraping targets), and any special requirements..."
                className="w-full rounded-2xl border border-black/[0.1] bg-white p-4 text-xs text-neutral-900 placeholder-neutral-500 focus:border-amber-700 focus:outline-none transition-colors shadow-sm"
              />
            </div>

            {/* 2. Reference Websites / Inspiration Links */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-neutral-800 font-mono font-semibold">
                Inspiration Links & Reference Websites
              </label>
              <input
                type="text"
                value={referenceLinks}
                onChange={(e) => setReferenceLinks(e.target.value)}
                placeholder="e.g. https://linear.app, https://stripe.com, competitor links, dribbble shots..."
                className="w-full rounded-xl border border-black/[0.1] bg-white px-4 py-3 text-xs text-neutral-900 placeholder-neutral-500 focus:border-amber-700 focus:outline-none shadow-sm"
              />
            </div>

            {/* 3. File & Asset Upload Dropzone */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-neutral-800 font-mono font-semibold">
                Upload Mockups, Wireframes or Brand Assets (Optional)
              </label>

              <div className="relative rounded-2xl border-2 border-dashed border-black/[0.15] bg-[#f8f7f4] p-8 text-center hover:border-amber-700/50 transition-colors shadow-sm">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/[0.04] text-neutral-600">
                    <Upload className="h-5 w-5 text-amber-700" />
                  </div>
                  <div className="text-xs text-neutral-700">
                    <span className="font-semibold text-neutral-900">Click to select files</span> or drag and drop
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    PNG, JPG, PDF, SVG, DOCX, ZIP up to 64MB
                  </div>
                </div>
              </div>

              {/* Uploaded File List with Visual Image Preview */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3 pt-3">
                  <div className="text-[10px] uppercase tracking-widest text-amber-800 font-mono font-semibold">
                    Attached Files & Previews ({uploadedFiles.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {uploadedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="group relative flex items-center justify-between rounded-2xl border border-black/[0.08] bg-white p-3 text-xs text-neutral-800 hover:border-amber-700/40 shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-3 truncate min-w-0">
                          {f.previewUrl ? (
                            <img
                              src={f.previewUrl}
                              alt={f.name}
                              className="h-12 w-12 rounded-xl object-cover border border-black/[0.08] shrink-0 bg-neutral-100 shadow-sm"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-xl border border-black/[0.08] bg-[#f7f6f2] flex items-center justify-center shrink-0 text-amber-800">
                              <FileText className="h-5 w-5" />
                            </div>
                          )}
                          <div className="truncate min-w-0">
                            <div className="truncate font-medium text-neutral-900">{f.name}</div>
                            <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-2 mt-0.5">
                              {f.previewUrl ? (
                                <span className="text-emerald-700 font-semibold">Image Preview Ready</span>
                              ) : (
                                <span>Document</span>
                              )}
                              {f.size && <span>• {(f.size / 1024).toFixed(1)} KB</span>}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-2 shrink-0 ml-2"
                          title="Remove file"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step Controls */}
            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-600 hover:text-black transition-colors font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <MagneticButton
                variant="primary"
                onClick={() => {
                  if (!requirements.trim()) {
                    setRequirements(`Custom development project for ${activeAppType.title}.`);
                  }
                  setStep(4);
                }}
                className="px-8 py-3 text-xs uppercase tracking-wider font-semibold"
              >
                <span>Continue to Review</span>
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </motion.div>
        )}

        {/* STEP 4: REVIEW, AUTHENTICATION & SUBMISSION */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div className="border-b border-black/[0.08] pb-4">
              <span className="text-[10px] uppercase tracking-widest text-amber-800 font-mono font-semibold">
                Step 04 // Review & Submit
              </span>
              <h2 className="text-2xl font-light text-neutral-900 tracking-tight mt-1">
                Review & Confirm Your Order
              </h2>
            </div>

            {/* Review Summary Card */}
            <div className="rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-8 space-y-6 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Project Type</div>
                  <div className="text-lg font-medium text-neutral-900 mt-1">{activeAppType.title}</div>
                  {activeAppType.id === "others" && customAppType && (
                    <div className="text-xs text-amber-800 font-mono mt-0.5 font-semibold">({customAppType})</div>
                  )}
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Colors</div>
                  <div className="flex items-center gap-2 mt-1">
                    {colorMode === "DEV_CHOOSES" ? (
                      <span className="text-xs text-amber-800 font-mono font-semibold">Developer Picks For You</span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        {colors.map((c, i) => (
                          <span
                            key={i}
                            className="h-4 w-4 rounded-full border border-black/20 shadow-sm"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Project Description</div>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed whitespace-pre-wrap">
                    {requirements || "Standard specifications as selected."}
                  </p>
                </div>

                {referenceLinks && (
                  <div className="md:col-span-2">
                    <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Reference Links</div>
                    <div className="text-xs text-amber-800 mt-1 font-mono font-semibold">{referenceLinks}</div>
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <div className="md:col-span-2">
                    <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono mb-2">
                      Attachments ({uploadedFiles.length})
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {uploadedFiles.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 rounded-xl border border-black/[0.08] bg-[#f7f6f2] p-2 pr-3 text-xs shadow-sm"
                        >
                          {f.previewUrl ? (
                            <img
                              src={f.previewUrl}
                              alt={f.name}
                              className="h-8 w-8 rounded-lg object-cover border border-black/[0.08]"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-lg border border-black/[0.08] bg-white flex items-center justify-center text-amber-800">
                              <FileText className="h-4 w-4" />
                            </div>
                          )}
                          <span className="truncate max-w-[150px] text-neutral-800 font-mono text-[11px] font-medium">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Client Authentication Gate */}
            <div className="rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-8 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-amber-800 font-mono font-semibold">
                    Account Check
                  </div>
                  <h3 className="text-base font-medium text-neutral-900 mt-1">Your Account</h3>
                </div>

                {isUserAuthenticated && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1 text-[11px] font-mono text-emerald-800 font-semibold">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Signed In</span>
                  </span>
                )}
              </div>

              {!isUserAuthenticated ? (
                <div className="space-y-4 pt-2">
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Please sign in with Google so your order is saved to your account and you can chat with me directly in your dashboard.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={() => signIn("google", { callbackUrl: "/order" })}
                      className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-full border border-black/[0.12] bg-[#f7f6f2] px-6 py-2.5 text-xs font-medium text-neutral-900 hover:border-black/30 hover:bg-white shadow-sm transition-all"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12 5c1.57 0 2.98.54 4.09 1.6l3.07-3.07C17.3 1.76 14.85 1 12 1 7.48 1 3.66 3.56 1.78 7.3l3.66 2.84C6.31 7.22 8.93 5 12 5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.17-2 3.42-4.94 3.42-8.7z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.44 14.86c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.78 7.44C.65 9.7 0 12.23 0 15s.65 5.3 1.78 7.56l3.66-2.7z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.08.72-2.45 1.16-4.22 1.16-3.07 0-5.69-2.22-6.56-5.14L1.78 16c1.88 3.74 5.7 6.3 10.22 6.3z"
                        />
                      </svg>
                      <span>Sign in with Google</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-black/[0.06] bg-[#f4f2ec] p-4 flex items-center justify-between text-xs shadow-inner">
                  <div>
                    <div className="text-neutral-900 font-semibold">{activeUser?.name}</div>
                    <div className="text-neutral-600 font-mono text-[11px]">{activeUser?.email}</div>
                  </div>
                  <span className="text-neutral-500 font-mono text-[10px]">Ready to Submit</span>
                </div>
              )}
            </div>

            {submitError && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-4 flex items-center gap-3 text-xs text-red-800 shadow-sm">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Submit & Back Controls */}
            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-600 hover:text-black transition-colors font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <MagneticButton
                variant="primary"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="px-10 py-3.5 text-xs uppercase tracking-widest font-semibold"
              >
                <span>{isSubmitting ? "Submitting Order..." : "Submit Order Now"}</span>
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </motion.div>
        )}

        {/* STEP 5: SUCCESS & DIRECT ACCESS TO MY ORDERS */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-black/[0.08] bg-white p-8 sm:p-14 text-center max-w-2xl mx-auto space-y-8 shadow-xl"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-700/30 bg-amber-50 mx-auto text-amber-800 shadow-md">
              <Check className="h-8 w-8 stroke-[2.5]" />
            </div>

            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-amber-800 font-mono font-semibold">
                Order Registered // {orderSuccessId || "PENDING"}
              </div>
              <h2 className="text-3xl font-light text-neutral-900 tracking-tight">
                Your Order Has Been Placed!
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
                I have received your order details. You can now visit your dashboard to track progress, check status, and chat with me directly.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <MagneticButton
                  variant="primary"
                  className="w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Go to My Orders & Chat with Dev</span>
                </MagneticButton>
              </Link>

              <Link href="/services" className="w-full sm:w-auto">
                <MagneticButton
                  variant="outline"
                  className="w-full sm:w-auto px-6 py-3.5 text-xs uppercase tracking-widest"
                >
                  <span>View Services</span>
                </MagneticButton>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OrderWizardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-xs font-mono text-neutral-500">
          Loading order form...
        </div>
      }
    >
      <OrderWizardContent />
    </Suspense>
  );
}
