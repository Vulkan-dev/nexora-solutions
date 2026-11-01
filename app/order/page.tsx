"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllServices } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  Check,
  Clock,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  CreditCard,
  Trash2,
  AlertCircle,
  LogIn,
  Zap,
  UserCheck,
} from "lucide-react";

function OrderWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: authStatus, update } = useSession();
  const allServices = getAllServices();

  const initialServiceId = searchParams.get("serviceId") || allServices[0]?.id;
  const initialPackageId = searchParams.get("packageId") || "";

  const [step, setStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackageId);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string; type: string; size?: number }>>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [simulatingAuth, setSimulatingAuth] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  const selectedService = allServices.find((s) => s.id === selectedServiceId) || allServices[0];

  useEffect(() => {
    if (!selectedPackageId && selectedService?.packages?.[0]) {
      setSelectedPackageId(selectedService.packages[0].id);
    }
  }, [selectedService, selectedPackageId]);

  const selectedPackage = selectedService?.packages.find((p) => p.id === selectedPackageId) || selectedService?.packages[0];

  const basePrice = selectedPackage?.price || 0;
  const addonsTotal = selectedAddonIds.reduce((sum, addonId) => {
    const addon = selectedService?.addons.find((a) => a.id === addonId);
    return sum + (addon ? addon.price : 0);
  }, 0);
  const totalPrice = basePrice + addonsTotal;

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).map((f) => ({
      name: f.name,
      url: `https://utfs.io/f/atelier-${Math.random().toString(36).substring(2, 8)}-${f.name}`,
      type: f.type || "application/octet-stream",
      size: f.size,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const [simulatedSession, setSimulatedSession] = useState<{ user: { name: string; email: string; role: string } } | null>(null);
  const isUserAuthenticated = !!(session?.user || simulatedSession?.user);
  const activeUser = session?.user || simulatedSession?.user;

  const handleSimulatedClientLogin = async () => {
    setSimulatingAuth(true);
    try {
      const res = await signIn("simulated-auth", {
        role: "CUSTOMER",
        name: "Alexandra Vance",
        email: "alexandra.vance@atelier-client.com",
        redirect: false,
      });

      // Instantly activate authenticated state without reloading page or losing steps
      setSimulatedSession({
        user: {
          name: "Alexandra Vance",
          email: "alexandra.vance@atelier-client.com",
          role: "CUSTOMER",
        },
      });

      // Trigger session sync
      if (typeof update === "function") {
        await update();
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setSimulatingAuth(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!isUserAuthenticated) {
      setSubmitError("Please sign in with Google or use test simulation before submitting your commission.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        serviceId: selectedService.id,
        packageId: selectedPackage.id,
        addonIds: selectedAddonIds,
        requirements: requirements || "Standard architectural specifications as selected.",
        uploadedFiles,
        clientName: activeUser?.name || "Alexandra Vance",
        clientEmail: activeUser?.email || "alexandra.vance@atelier-client.com",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit commission");
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
    <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16 py-16">
      {/* Wizard Step Navigation */}
      <div className="mb-12 border-b border-white/[0.08] pb-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { num: 1, title: "Tier" },
            { num: 2, title: "Enhancements" },
            { num: 3, title: "Briefing" },
            { num: 4, title: "Review & Access" },
          ].map((item) => (
            <div key={item.num} className="flex items-center gap-3">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono transition-all ${
                  step === item.num
                    ? "bg-cream-100 text-neutral-900 font-bold"
                    : step > item.num
                    ? "bg-white/10 text-cream-200"
                    : "text-neutral-500 border border-white/[0.08]"
                }`}
              >
                {step > item.num ? "✓" : item.num}
              </div>
              <span
                className={`text-xs uppercase tracking-widest ${
                  step === item.num ? "text-cream-100" : "text-neutral-500"
                }`}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-white/[0.08] bg-surface p-8 sm:p-12">
        <AnimatePresence mode="wait">
          {/* STEP 1: Select Service & Package */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <div className="text-[10px] uppercase tracking-widest text-cream-400 font-mono mb-2">
                  Step 01 // Configuration
                </div>
                <h2 className="text-2xl font-light text-white">Select Discipline & Production Tier</h2>
                <p className="text-xs text-neutral-400 mt-1">Choose the service and desired edition level.</p>
              </div>

              {/* Service Category Buttons */}
              <div className="flex flex-wrap gap-2">
                {allServices.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedServiceId(s.id);
                      setSelectedPackageId(s.packages[0]?.id || "");
                      setSelectedAddonIds([]);
                    }}
                    className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider transition-all ${
                      selectedServiceId === s.id
                        ? "bg-cream-100 text-neutral-900 font-semibold"
                        : "bg-surfaceElevated text-neutral-400 hover:text-white border border-white/[0.08]"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>

              {/* Packages List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {selectedService.packages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`cursor-pointer rounded-xl p-6 transition-all border ${
                        isSelected
                          ? "border-white/40 bg-surfaceElevated shadow-atelier"
                          : "border-white/[0.08] bg-surfaceElevated/40 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-white text-sm">{pkg.name}</span>
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-cream-300 bg-cream-100 text-neutral-900"
                              : "border-neutral-600"
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />}
                        </div>
                      </div>

                      <div className="text-2xl font-light text-white font-serif mb-2">
                        {formatCurrency(pkg.price)}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mb-4 font-mono">
                        <Clock className="h-3 w-3 text-cream-400" />
                        <span>{pkg.deliveryDays} business days</span>
                      </div>

                      <p className="text-xs text-neutral-400 mb-6 leading-relaxed">{pkg.description}</p>

                      <div className="space-y-2 border-t border-white/[0.06] pt-4">
                        {pkg.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] text-neutral-300">
                            <span className="h-1 w-1 rounded-full bg-cream-400 flex-shrink-0 mt-1" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-6 border-t border-white/[0.08]">
                <MagneticButton
                  onClick={() => setStep(2)}
                  disabled={!selectedPackageId}
                  variant="primary"
                  className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold"
                >
                  <span>Continue to Enhancements</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </MagneticButton>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Choose Add-ons */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <div className="text-[10px] uppercase tracking-widest text-cream-400 font-mono mb-2">
                  Step 02 // Enhancements
                </div>
                <h2 className="text-2xl font-light text-white">Select Optional Enhancements</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Attach bespoke production add-ons. Investment calculations update automatically.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedService.addons.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`cursor-pointer flex items-center justify-between rounded-xl p-5 border transition-all ${
                        isChecked
                          ? "border-white/30 bg-surfaceElevated"
                          : "border-white/[0.08] bg-surfaceElevated/50 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-4 w-4 rounded-sm border flex items-center justify-center ${
                            isChecked
                              ? "border-cream-300 bg-cream-100 text-neutral-900"
                              : "border-neutral-600"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{addon.name}</div>
                          <div className="text-[11px] text-neutral-500 font-mono">Bespoke Addition</div>
                        </div>
                      </div>
                      <div className="text-sm font-serif text-cream-200">
                        +{formatCurrency(addon.price)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Bar */}
              <div className="rounded-xl border border-white/[0.08] bg-surfaceElevated p-5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Commission Investment</div>
                  <div className="text-2xl font-light text-white font-serif">{formatCurrency(totalPrice)}</div>
                </div>
                <div className="text-xs text-neutral-400 font-mono">
                  {selectedPackage?.name} + {selectedAddonIds.length} Add-on(s)
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                <MagneticButton
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="px-5 py-2 text-xs uppercase tracking-wider"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </MagneticButton>

                <MagneticButton
                  onClick={() => setStep(3)}
                  variant="primary"
                  className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold"
                >
                  <span>Project Briefing</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </MagneticButton>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Requirements & File Uploads */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <div className="text-[10px] uppercase tracking-widest text-cream-400 font-mono mb-2">
                  Step 03 // Briefing & Materials
                </div>
                <h2 className="text-2xl font-light text-white">Project Vision & Reference Files</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Specify aesthetic references, brand guidelines, and attach design assets or Figma links.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-mono">
                  Commission Brief & Design Objectives
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={5}
                  placeholder="Outline your creative vision, brand identity, key references, or bespoke functional requirements..."
                  className="w-full rounded-xl border border-white/[0.08] bg-surfaceElevated p-4 text-xs text-white placeholder-neutral-500 focus:border-white/30 focus:outline-none"
                />
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-mono">
                  Reference Materials (Figma, PDF, Brand Assets)
                </label>
                <div className="relative rounded-xl border border-dashed border-white/[0.15] bg-surfaceElevated/30 p-8 text-center transition-colors hover:border-white/30">
                  <Upload className="mx-auto h-6 w-6 text-neutral-400 mb-2" />
                  <div className="text-xs text-white font-medium">Select or drag files here</div>
                  <p className="text-[10px] text-neutral-500 mt-1 font-mono">
                    Direct asset dropzone for references and guidelines
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleSimulatedFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {uploadedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-surfaceElevated p-3 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-4 w-4 text-cream-300 flex-shrink-0" />
                          <span className="truncate text-neutral-200">{f.name}</span>
                        </div>
                        <button
                          onClick={() => removeFile(i)}
                          className="text-neutral-500 hover:text-white transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                <MagneticButton
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="px-5 py-2 text-xs uppercase tracking-wider"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </MagneticButton>

                <MagneticButton
                  onClick={() => setStep(4)}
                  variant="primary"
                  className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold"
                >
                  <span>Review & Client Verification</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </MagneticButton>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Review & Client Ingress Gate */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <div className="text-[10px] uppercase tracking-widest text-cream-400 font-mono mb-2">
                  Step 04 // Review & Access
                </div>
                <h2 className="text-2xl font-light text-white">Review & Confirm Commission</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Authenticate as a client to register your commission and access your private progress timeline.
                </p>
              </div>

              {submitError && (
                <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Order Breakdown Card */}
              <div className="rounded-xl border border-white/[0.08] bg-surfaceElevated p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div>
                    <div className="text-base font-normal text-white">{selectedService.title}</div>
                    <div className="text-xs text-cream-300 font-mono mt-0.5">{selectedPackage?.name} Tier</div>
                  </div>
                  <div className="text-lg font-serif text-white">{formatCurrency(basePrice)}</div>
                </div>

                {selectedAddonIds.length > 0 && (
                  <div className="space-y-2 border-b border-white/[0.06] pb-4">
                    <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
                      Selected Enhancements:
                    </div>
                    {selectedAddonIds.map((aId) => {
                      const addon = selectedService.addons.find((a) => a.id === aId);
                      return (
                        <div key={aId} className="flex items-center justify-between text-xs text-neutral-300">
                          <span>{addon?.name}</span>
                          <span className="font-serif text-cream-200">+{formatCurrency(addon?.price || 0)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono">Total Commission Investment</div>
                  <div className="text-3xl font-light text-white font-serif">{formatCurrency(totalPrice)}</div>
                </div>
              </div>

              {/* User Authentication Gate (Mandatory before submitting) */}
              <div className="rounded-xl border border-white/[0.08] bg-surfaceElevated/70 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-neutral-300 font-mono">
                      Client Authentication Status
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      {isUserAuthenticated
                        ? `Authenticated as ${activeUser?.name || activeUser?.email}`
                        : "Sign in with Google before confirming your commission."}
                    </div>
                  </div>
                  {isUserAuthenticated && (
                    <div className="flex items-center gap-1.5 text-xs text-cream-200 font-mono">
                      <UserCheck className="h-4 w-4" />
                      <span>Verified Client</span>
                    </div>
                  )}
                </div>

                {!isUserAuthenticated && (
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    {/* Real Google OAuth Login */}
                    <button
                      onClick={() => signIn("google", { callbackUrl: "/order" })}
                      className="flex-1 flex items-center justify-center gap-2.5 rounded-full border border-white/10 bg-surface px-5 py-3 text-xs text-white hover:border-white/25 transition-all"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
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
                      <span className="uppercase tracking-wider text-[11px]">Sign in with Google</span>
                    </button>

                    {/* Test Simulation Button */}
                    <button
                      onClick={handleSimulatedClientLogin}
                      disabled={simulatingAuth}
                      className="flex-1 flex items-center justify-center gap-2 rounded-full border border-cream-400/40 bg-cream-100/10 px-5 py-3 text-xs text-cream-200 hover:bg-cream-100/20 transition-all font-mono"
                    >
                      <Zap className="h-3.5 w-3.5 text-cream-300" />
                      <span>{simulatingAuth ? "Simulating..." : "⚡ Test Mode: Simulate Client Login"}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                <MagneticButton
                  onClick={() => setStep(3)}
                  disabled={isSubmitting}
                  variant="outline"
                  className="px-5 py-2 text-xs uppercase tracking-wider"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </MagneticButton>

                <MagneticButton
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || !isUserAuthenticated}
                  variant="primary"
                  className="px-8 py-3 text-xs uppercase tracking-widest font-semibold disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <span>Registering Commission...</span>
                  ) : !isUserAuthenticated ? (
                    <span>Please Authenticate to Confirm</span>
                  ) : (
                    <>
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Confirm Commission ({formatCurrency(totalPrice)})</span>
                    </>
                  )}
                </MagneticButton>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Success Confirmation */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-6"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 text-neutral-900 shadow-sm">
                <Check className="h-7 w-7" />
              </div>

              <h2 className="text-3xl font-light text-white">Commission Confirmed</h2>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                Your commission reference <span className="font-mono text-cream-200">{orderSuccessId}</span> has been entered into our atelier production queue.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <MagneticButton
                  onClick={() => router.push("/dashboard")}
                  variant="primary"
                  className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold"
                >
                  <span>Open Client Suite</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </MagneticButton>

                <MagneticButton
                  onClick={() => router.push("/services")}
                  variant="outline"
                  className="px-5 py-2.5 text-xs uppercase tracking-wider"
                >
                  <span>Return to Index</span>
                </MagneticButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function OrderWizardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl py-24 text-center text-xs text-neutral-400 font-mono uppercase tracking-widest">
          Loading Atelier Commission Suite...
        </div>
      }
    >
      <OrderWizardContent />
    </Suspense>
  );
}
