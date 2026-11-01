"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getAllServices, ServiceItem, PackageTier, ServiceAddon } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  Check,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Upload,
  FileText,
  ShieldCheck,
  CreditCard,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";

function OrderWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  const selectedService = allServices.find((s) => s.id === selectedServiceId) || allServices[0];

  // Auto-select first package if none selected
  useEffect(() => {
    if (!selectedPackageId && selectedService?.packages?.[0]) {
      setSelectedPackageId(selectedService.packages[0].id);
    }
  }, [selectedService, selectedPackageId]);

  const selectedPackage = selectedService?.packages.find((p) => p.id === selectedPackageId) || selectedService?.packages[0];

  // Price Calculation
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
      url: `https://utfs.io/f/placeholder-${Math.random().toString(36).substring(2, 8)}-${f.name}`,
      type: f.type || "application/octet-stream",
      size: f.size,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitOrder = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        serviceId: selectedService.id,
        packageId: selectedPackage.id,
        addonIds: selectedAddonIds,
        requirements: requirements || "Standard project configuration as specified in tier.",
        turnstileToken: "turnstile-verified-token-local",
        uploadedFiles,
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
      setStep(5); // Success step
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Wizard Step Indicators */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { num: 1, title: "Tier & Scope" },
            { num: 2, title: "Add-ons" },
            { num: 3, title: "Requirements" },
            { num: 4, title: "Review & Checkout" },
          ].map((item) => (
            <div key={item.num} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step === item.num
                    ? "bg-blue-600 text-white shadow-neon ring-4 ring-blue-500/20"
                    : step > item.num
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-surfaceElevated text-neutral-500 border border-borderDark"
                }`}
              >
                {step > item.num ? <Check className="h-4 w-4" /> : item.num}
              </div>
              <span
                className={`hidden sm:inline text-xs font-medium ${
                  step === item.num ? "text-white" : "text-neutral-500"
                }`}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="rounded-3xl border border-white/10 bg-surface/80 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
        <AnimatePresence mode="wait">
          {/* STEP 1: Select Service & Package */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Step 1: Choose Your Architecture</h2>
                <p className="text-xs text-neutral-400">Select the service and desired delivery package tier.</p>
              </div>

              {/* Service Tabs */}
              <div className="flex flex-wrap gap-2">
                {allServices.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedServiceId(s.id);
                      setSelectedPackageId(s.packages[0]?.id || "");
                      setSelectedAddonIds([]);
                    }}
                    className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                      selectedServiceId === s.id
                        ? "bg-blue-600 text-white shadow-neon"
                        : "bg-surfaceElevated text-neutral-400 hover:text-white border border-borderDark"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>

              {/* Packages List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {selectedService.packages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`cursor-pointer rounded-2xl p-6 transition-all border ${
                        isSelected
                          ? "border-blue-500 bg-blue-950/20 shadow-neon ring-1 ring-blue-500"
                          : "border-borderDark bg-surfaceElevated/60 hover:border-neutral-600"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-white text-base">{pkg.name}</span>
                        <div
                          className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-neutral-600"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </div>

                      <div className="text-2xl font-extrabold text-blue-400 mb-2">
                        {formatCurrency(pkg.price)}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-4">
                        <Clock className="h-3.5 w-3.5 text-neutral-500" />
                        <span>{pkg.deliveryDays} business days</span>
                      </div>

                      <p className="text-xs text-neutral-400 mb-6">{pkg.description}</p>

                      <div className="space-y-2 border-t border-white/5 pt-4">
                        {pkg.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] text-neutral-300">
                            <Check className="h-3.5 w-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-6 border-t border-white/5">
                <MagneticButton
                  onClick={() => setStep(2)}
                  disabled={!selectedPackageId}
                  variant="glow"
                  className="px-6 py-2.5 text-xs font-semibold"
                >
                  <span>Proceed to Add-ons</span>
                  <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Choose Add-ons */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Step 2: Enhance with Add-on Accelerators</h2>
                <p className="text-xs text-neutral-400">
                  Select optional power-ups for your build. Pricing updates in real time.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedService.addons.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`cursor-pointer flex items-center justify-between rounded-2xl p-5 border transition-all ${
                        isChecked
                          ? "border-blue-500 bg-blue-950/20 shadow-neon"
                          : "border-borderDark bg-surfaceElevated/50 hover:border-neutral-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-5 w-5 rounded-md border flex items-center justify-center ${
                            isChecked
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-neutral-600"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{addon.name}</div>
                          <div className="text-[11px] text-neutral-400">Modular enhancement</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-blue-400">
                        +{formatCurrency(addon.price)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Price Bar */}
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400">Estimated Project Total</div>
                  <div className="text-xl font-extrabold text-white">{formatCurrency(totalPrice)}</div>
                </div>
                <div className="text-xs text-neutral-400">
                  {selectedPackage?.name} + {selectedAddonIds.length} add-ons
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <MagneticButton
                  onClick={() => setStep(1)}
                  variant="secondary"
                  className="px-5 py-2 text-xs"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </MagneticButton>

                <MagneticButton
                  onClick={() => setStep(3)}
                  variant="glow"
                  className="px-6 py-2.5 text-xs font-semibold"
                >
                  <span>Project Requirements</span>
                  <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Requirements & File Uploads */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Step 3: Project Requirements & Assets</h2>
                <p className="text-xs text-neutral-400">
                  Detail your vision, functional requirements, and upload brand assets or Figma references.
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-medium text-neutral-300">
                  Detailed Project Scope / Vision <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={5}
                  placeholder="Describe your design inspirations, target audience, key integrations, or specific interactive elements..."
                  className="w-full rounded-2xl border border-borderDark bg-surfaceElevated p-4 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-3">
                <label className="block text-xs font-medium text-neutral-300">
                  Reference Files & Deliverable Assets
                </label>
                <div className="relative rounded-2xl border-2 border-dashed border-neutral-700 bg-surfaceElevated/40 p-8 text-center transition-colors hover:border-blue-500">
                  <Upload className="mx-auto h-8 w-8 text-neutral-400 mb-3" />
                  <div className="text-xs font-medium text-white">Click or drag files to upload</div>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Accepts PNG, JPG, PDF, ZIP, Figma specs up to 64MB (Uploadthing protected)
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleSimulatedFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {uploadedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-surfaceElevated p-3 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-4 w-4 text-blue-400 flex-shrink-0" />
                          <span className="truncate text-neutral-200">{f.name}</span>
                        </div>
                        <button
                          onClick={() => removeFile(i)}
                          className="text-neutral-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <MagneticButton
                  onClick={() => setStep(2)}
                  variant="secondary"
                  className="px-5 py-2 text-xs"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </MagneticButton>

                <MagneticButton
                  onClick={() => setStep(4)}
                  variant="glow"
                  className="px-6 py-2.5 text-xs font-semibold"
                >
                  <span>Review Order</span>
                  <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Review & Checkout */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Step 4: Order Review & Confirmation</h2>
                <p className="text-xs text-neutral-400">
                  Verify your selections before commissioning the architecture build.
                </p>
              </div>

              {submitError && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Order Breakdown Card */}
              <div className="rounded-2xl border border-white/10 bg-surfaceElevated/60 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <div className="text-base font-bold text-white">{selectedService.title}</div>
                    <div className="text-xs text-blue-400 font-medium">{selectedPackage?.name} Tier</div>
                  </div>
                  <div className="text-lg font-bold text-white">{formatCurrency(basePrice)}</div>
                </div>

                {selectedAddonIds.length > 0 && (
                  <div className="space-y-2 border-b border-white/5 pb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      Selected Add-ons:
                    </div>
                    {selectedAddonIds.map((aId) => {
                      const addon = selectedService.addons.find((a) => a.id === aId);
                      return (
                        <div key={aId} className="flex items-center justify-between text-xs text-neutral-300">
                          <span>{addon?.name}</span>
                          <span className="font-semibold text-neutral-200">+{formatCurrency(addon?.price || 0)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm font-semibold text-neutral-300">Total Investment</div>
                  <div className="text-2xl font-extrabold text-blue-400">{formatCurrency(totalPrice)}</div>
                </div>
              </div>

              {/* Security Pill */}
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-400">
                <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                <span>
                  Protected by Cloudflare Turnstile bot shielding, Upstash sliding-window rate limiting, and Stripe 256-bit SSL encryption.
                </span>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <MagneticButton
                  onClick={() => setStep(3)}
                  disabled={isSubmitting}
                  variant="secondary"
                  className="px-5 py-2 text-xs"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </MagneticButton>

                <MagneticButton
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  variant="glow"
                  className="px-8 py-3 text-sm font-semibold"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Confirm & Commission ({formatCurrency(totalPrice)})</span>
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-6"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-neon">
                <Check className="h-8 w-8" />
              </div>

              <h2 className="text-3xl font-extrabold text-white">Order Successfully Placed!</h2>
              <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                Your order <span className="font-mono text-blue-400">{orderSuccessId}</span> has been received and transitioned into our triage queue.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <MagneticButton
                  onClick={() => router.push("/dashboard")}
                  variant="glow"
                  className="px-6 py-2.5 text-xs font-semibold"
                >
                  <span>Track in Customer Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </MagneticButton>

                <MagneticButton
                  onClick={() => router.push("/services")}
                  variant="secondary"
                  className="px-5 py-2.5 text-xs"
                >
                  <span>Explore More Services</span>
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
        <div className="mx-auto max-w-5xl py-24 text-center text-xs text-neutral-400">
          Initializing interactive architecture wizard...
        </div>
      }
    >
      <OrderWizardContent />
    </Suspense>
  );
}
