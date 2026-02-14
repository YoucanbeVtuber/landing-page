"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { COPY } from "@/content/copy";
import { isValidEmail } from "@/utils/validators";

interface ContactFormProps {
  onSuccess: () => void;
  onError: () => void;
  isMobileModal?: boolean;
}

export default function ContactForm({
  onSuccess,
  onError,
  isMobileModal = false,
}: ContactFormProps) {
  const [email, setEmail] = useState("");
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleFormAction =
    "https://docs.google.com/forms/d/1MjgUwdwWVM99_yye543kDS-kLvewxwwn_bgymEuVnoA/formResponse";

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

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("entry.195494443", normalizedEmail);

      await fetch(googleFormAction, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      setEmail("");
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
      className={`bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 shadow-2xl mx-auto w-full ${
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
          className={`w-full px-4 bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-400 rounded-xl focus:border-purple-500 focus:bg-gray-750 focus:outline-none transition-colors ${
            isMobileModal ? "py-3.5 text-base" : "py-3"
          }`}
          required
        />
      </div>

      <div className={`text-left ${isMobileModal ? "mb-4" : "mb-5"}`}>
        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isPrivacyAgreed}
            onChange={(e) => setIsPrivacyAgreed(e.target.checked)}
            className="h-4 w-4 rounded border border-gray-600 bg-gray-900 checked:bg-purple-500 checked:border-purple-500 focus:ring-1 focus:ring-purple-400 focus:ring-offset-0"
          />
          <span>
            <button
              type="button"
              onClick={() => setShowPrivacyPolicy((prev) => !prev)}
              className="underline underline-offset-2 text-purple-300 hover:text-purple-200 transition-colors"
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
            className="mt-2 text-[11px] text-gray-400 leading-relaxed space-y-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs text-gray-200 font-medium">
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
        className={`w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
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
