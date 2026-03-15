"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { COPY, type Lang } from "@/content/copy";
import { isValidEmail } from "@/utils/validators";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import {
  RESERVED_EMAIL_STORAGE_KEY,
  ROLE_DETAIL_STORAGE_KEY,
  ROLE_STORAGE_KEY,
  USER_ROLE_OPTIONS,
  UserRole,
} from "@/utils/roles";

interface ContactFormProps {
  onSuccess: () => void;
  onError: () => void;
  isMobileModal?: boolean;
  onEmailSubmitted?: (email: string) => void;
  lang: Lang;
}

export default function ContactForm({
  onSuccess,
  onError,
  isMobileModal = false,
  onEmailSubmitted,
  lang,
}: ContactFormProps) {
  const copy = COPY[lang].preRegister;
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [roleDetail, setRoleDetail] = useState("");
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const roleLabels =
    lang === "en"
      ? {
          live2d_illustrator: "Live2D Illustrator",
          rigger: "Rigger",
          vtuber_creator: "VTuber Creator",
          other: "Other",
        }
      : null;

  useEffect(() => {
    const cachedEmail = window.localStorage.getItem(RESERVED_EMAIL_STORAGE_KEY);
    const cachedRole = window.localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
    const cachedRoleDetail = window.localStorage.getItem(ROLE_DETAIL_STORAGE_KEY);

    if (cachedEmail) {
      setEmail(cachedEmail);
    }
    if (cachedRole && USER_ROLE_OPTIONS.some((option) => option.value === cachedRole)) {
      setRole(cachedRole);
    }
    if (cachedRoleDetail) {
      setRoleDetail(cachedRoleDetail);
    }
  }, []);

  useEffect(() => {
    if (role) {
      window.localStorage.setItem(ROLE_STORAGE_KEY, role);
    } else {
      window.localStorage.removeItem(ROLE_STORAGE_KEY);
    }
  }, [role]);

  useEffect(() => {
    const normalizedRoleDetail = roleDetail.trim();
    if (normalizedRoleDetail) {
      window.localStorage.setItem(ROLE_DETAIL_STORAGE_KEY, normalizedRoleDetail);
    } else {
      window.localStorage.removeItem(ROLE_DETAIL_STORAGE_KEY);
    }
  }, [roleDetail]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError(copy.form.validation.emailRequired);
      return;
    }

    if (!isValidEmail(normalizedEmail) || normalizedEmail.length > 254) {
      setError(copy.form.validation.emailInvalid);
      return;
    }

    if (!role) {
      setError(copy.form.roleRequired);
      return;
    }

    if (role === "other" && !roleDetail.trim()) {
      setError(copy.form.otherRequired);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isSupabaseConfigured || !supabase) {
        window.localStorage.setItem(RESERVED_EMAIL_STORAGE_KEY, normalizedEmail);
        if (onEmailSubmitted) onEmailSubmitted(normalizedEmail);
        setShowPrivacyPolicy(false);
        onSuccess();
        return;
      }

      const { error: dbError } = await supabase.from("registrations").insert({
        type: "early_access",
        email: normalizedEmail,
        role,
        role_detail: role === "other" ? roleDetail.trim() : null,
      });

      if (dbError) throw dbError;

      window.localStorage.setItem(RESERVED_EMAIL_STORAGE_KEY, normalizedEmail);
      if (onEmailSubmitted) onEmailSubmitted(normalizedEmail);
      setShowPrivacyPolicy(false);
      onSuccess();
    } catch {
      onError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`mx-auto w-full border border-white/80 bg-white/92 shadow-[0_40px_80px_-20px_rgba(15,23,42,0.12)] ring-1 ring-slate-100/80 backdrop-blur-xl ${
        isMobileModal
          ? "max-w-md rounded-[28px] p-4 sm:p-6"
          : "max-w-md rounded-[40px] p-7 sm:p-8"
      }`}
    >
      {!isSupabaseConfigured && (
        <div className="mb-6 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
          {copy.form.previewMode}
        </div>
      )}

      <div className={isMobileModal ? "mb-4" : "mb-6"}>
        <div className="relative group">
          <Mail
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-500"
            size={18}
          />
          <input
            type="email"
            name="entry.195494443"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.form.emailPlaceholder}
            className={`w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 ${
              isMobileModal ? "py-4 text-base" : "py-4 text-base font-semibold"
            }`}
            required
          />
        </div>
      </div>

      <div className={`text-left ${isMobileModal ? "mb-4" : "mb-6"}`}>
        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
          {copy.form.rolePrompt}
        </p>
        <div className="space-y-3">
          {USER_ROLE_OPTIONS.map((option, index) => (
            <label
              key={option.value}
              className={`group flex w-full cursor-pointer items-center justify-between gap-3 rounded-[20px] border-2 p-4 transition-all ${
                role === option.value
                  ? "border-indigo-500 bg-indigo-50/70 shadow-sm"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="userRole"
                value={option.value}
                checked={role === option.value}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="sr-only"
                required
              />
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border text-[11px] font-black ${
                    role === option.value
                      ? "border-indigo-500 bg-white text-indigo-600"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  0{index + 1}
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {roleLabels ? roleLabels[option.value] : option.label}
                </span>
              </div>
              <CheckCircle2
                size={18}
                className={
                  role === option.value
                    ? "text-indigo-500"
                    : "text-slate-200 transition-colors group-hover:text-slate-300"
                }
              />
            </label>
          ))}
        </div>
        {role === "other" && (
          <motion.input
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            type="text"
            value={roleDetail}
            onChange={(e) => setRoleDetail(e.target.value)}
            placeholder={copy.form.otherPlaceholder}
            className={`mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 ${
              isMobileModal ? "py-4 text-base" : "py-4 text-base"
            }`}
            required
          />
        )}
      </div>

      {error && (
        <motion.p
          className={`text-red-500 ${isMobileModal ? "mb-3 text-xs" : "mb-4 text-sm"}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] font-black text-white shadow-2xl transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 ${
          isMobileModal ? "py-4 text-base" : "py-4 text-lg"
        }`}
        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
      >
        <span>{isSubmitting ? copy.form.loading : copy.form.submit}</span>
        {!isSubmitting && <ArrowRight size={18} className="text-indigo-300" />}
      </motion.button>

      <div className="mt-3 text-left">
        <p className="text-[11px] leading-5 text-gray-500">
          {copy.form.privacy.implicitConsent}{" "}
          <button
            type="button"
            onClick={() => setShowPrivacyPolicy((prev) => !prev)}
            className="underline underline-offset-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            {copy.form.privacy.linkText}
          </button>
        </p>

        {showPrivacyPolicy && (
          <motion.div
            className="mt-2 space-y-1 text-[11px] leading-relaxed text-gray-500"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs font-medium text-gray-700">{copy.form.privacy.title}</p>
            <p>{copy.form.privacy.purpose}</p>
            <p>{copy.form.privacy.items}</p>
            <p>{copy.form.privacy.retention}</p>
            <p>{copy.form.privacy.rights}</p>
          </motion.div>
        )}
      </div>
    </form>
  );
}
