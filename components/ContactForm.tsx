"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { COPY } from "@/content/copy";
import { isValidEmail } from "@/utils/validators";
import { supabase } from "@/lib/supabase";
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
}

export default function ContactForm({
  onSuccess,
  onError,
  isMobileModal = false,
  onEmailSubmitted,
}: ContactFormProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [roleDetail, setRoleDetail] = useState("");
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setError(COPY.preRegister.form.validation.emailRequired);
      return;
    }

    if (!isValidEmail(normalizedEmail) || normalizedEmail.length > 254) {
      setError(COPY.preRegister.form.validation.emailInvalid);
      return;
    }

    if (!isPrivacyAgreed) {
      setError(COPY.preRegister.form.validation.privacyRequired);
      return;
    }

    if (!role) {
      setError("역할을 선택해주세요");
      return;
    }

    if (role === "other" && !roleDetail.trim()) {
      setError("기타 역할을 입력해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase
        .from("registrations")
        .insert({
          type: "early_access",
          email: normalizedEmail,
          role,
          role_detail: role === "other" ? roleDetail.trim() : null,
        });

      if (dbError) throw dbError;

      window.localStorage.setItem(RESERVED_EMAIL_STORAGE_KEY, normalizedEmail);
      if (onEmailSubmitted) onEmailSubmitted(normalizedEmail);
      setIsPrivacyAgreed(false);
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
      className={`bg-white border border-purple-100 shadow-xl shadow-purple-100/50 mx-auto w-full ${
        isMobileModal
          ? "rounded-2xl p-4 sm:p-6 max-w-md"
          : "rounded-3xl p-8 max-w-md"
      }`}
    >
      <div className={isMobileModal ? "mb-4" : "mb-6"}>
        <input
          type="email"
          name="entry.195494443"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={COPY.preRegister.form.emailPlaceholder}
          className={`w-full px-4 bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-colors ${
            isMobileModal ? "py-3.5 text-base" : "py-3"
          }`}
          required
        />
      </div>

      <div className={`text-left ${isMobileModal ? "mb-4" : "mb-6"}`}>
        <p className="text-sm font-semibold text-gray-700 mb-2">어떤 역할로 활동하고 계신가요?</p>
        <div className="space-y-2">
          {USER_ROLE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 w-full p-3 rounded-xl border cursor-pointer transition-all ${
                role === option.value
                  ? "border-purple-300 bg-purple-50/60"
                  : "border-gray-200 bg-white hover:border-purple-200"
              }`}
            >
              <input
                type="radio"
                name="userRole"
                value={option.value}
                checked={role === option.value}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="h-4 w-4 border border-gray-300 text-purple-500 focus:ring-purple-400"
                required
              />
              <span className="text-sm font-medium text-gray-700">{option.label}</span>
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
            placeholder="직접 입력해주세요"
            className={`mt-3 w-full px-4 bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-colors ${
              isMobileModal ? "py-3.5 text-base" : "py-3"
            }`}
            required
          />
        )}
      </div>

      <div className={`text-left ${isMobileModal ? "mb-4" : "mb-5"}`}>
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={isPrivacyAgreed}
            onChange={(e) => setIsPrivacyAgreed(e.target.checked)}
            className="h-4 w-4 rounded border border-gray-300 bg-white checked:bg-purple-500 checked:border-purple-500 focus:ring-1 focus:ring-purple-400 focus:ring-offset-0"
          />
          <span>
            <button
              type="button"
              onClick={() => setShowPrivacyPolicy((prev) => !prev)}
              className="underline underline-offset-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              {COPY.preRegister.form.privacy.linkText}
            </button>{" "}
            {COPY.preRegister.form.privacy.label.replace(
              COPY.preRegister.form.privacy.linkText,
              ""
            )}
          </span>
        </label>

        {showPrivacyPolicy && (
          <motion.div
            className="mt-2 text-[11px] text-gray-500 leading-relaxed space-y-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs text-gray-700 font-medium">
              {COPY.preRegister.form.privacy.title}
            </p>
            <p>{COPY.preRegister.form.privacy.purpose}</p>
            <p>{COPY.preRegister.form.privacy.items}</p>
            <p>{COPY.preRegister.form.privacy.retention}</p>
            <p>{COPY.preRegister.form.privacy.rights}</p>
          </motion.div>
        )}
      </div>

      {error && (
        <motion.p
          className={`text-red-500 ${isMobileModal ? "text-xs mb-3" : "text-sm mb-4"}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
          isMobileModal ? "py-3 text-base" : "py-2.5"
        }`}
        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? "처리 중..." : COPY.preRegister.form.submit}
      </motion.button>
    </form>
  );
}
