"use client";

import { useState } from "react";
import { ChevronRight, Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ContactForm from "./ContactForm";
import DiscordInviteCard from "./DiscordInviteCard";
import type { Lang } from "@/content/copy";

const TEXT = {
  en: {
    titleTop: "One click.",
    titleAccent: "Live2D layers.",
    subtitle: "Turn your illustration into rigging-ready PSD.",
    reserveCta: "Join the Limited Beta",
    reserveGift: "Join the waitlist and receive 100% free credits.",
    reserveNote: "* Launch updates only. No spam.",
    cancel: "Cancel",
  },
  kr: {
    titleTop: "원클릭.",
    titleAccent: "Live2D 레이어.",
    subtitle: "일러스트를 바로 리깅 가능한 PSD로 변환하세요.",
    reserveCta: "얼리 액세스 신청하기",
    reserveGift: "사전 예약 시 무료 크레딧 100% 증정",
    reserveNote: "* 스팸 없이 출시 소식만 전해드립니다.",
    cancel: "취소",
  },
} as const;

export default function HeroRegisterSection({ lang }: { lang: Lang }) {
  const text = TEXT[lang];
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const handleSuccess = () => {
    setIsSubmitted(true);
    setShowContactForm(true);
  };

  return (
    <section id="hero-section" className="relative overflow-hidden bg-[#f7f8fc] px-4 pb-28 pt-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-violet-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute right-[8%] top-[22%] h-64 w-64 rounded-full bg-sky-200/40 blur-[100px]" />
      <div className="pointer-events-none absolute left-[8%] bottom-[8%] h-80 w-80 rounded-full bg-pink-200/40 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="mx-auto max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-6xl font-[950] tracking-[-0.07em] text-slate-950 sm:text-7xl lg:text-[6.75rem] lg:leading-[0.9]"
          >
            <span className="block sm:whitespace-nowrap">{text.titleTop}</span>
            <span className="block text-indigo-600 sm:whitespace-nowrap">{text.titleAccent}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="mx-auto mt-8 max-w-xl text-lg font-bold tracking-tight text-slate-400 opacity-80 sm:text-2xl"
          >
            {text.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className={`mx-auto mt-12 flex min-h-[180px] w-full flex-col items-center ${isSubmitted ? "max-w-3xl" : "max-w-xl"}`}
          >
            {!showContactForm ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.24 }}
                className="flex flex-col items-center"
              >
                <div className="rounded-[32px] border border-white/90 bg-white/45 p-3 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/80 backdrop-blur-xl">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setShowContactForm(true);
                    }}
                    className="flex items-center justify-center gap-3 rounded-[24px] bg-[#111827] px-12 py-5 text-lg font-black text-white shadow-2xl transition-all hover:-translate-y-0.5 hover:bg-slate-800 active:scale-[0.99]"
                  >
                    <span>{text.reserveCta}</span>
                    <ChevronRight size={20} className="text-indigo-300" />
                  </button>
                </div>

                <div className="mt-7 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                    <Sparkles size={12} className="text-indigo-500" />
                    <span>{text.reserveGift}</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-300">{text.reserveNote}</p>
                </div>
              </motion.div>
            ) : isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.24 }}
                className="w-full"
              >
                <DiscordInviteCard lang={lang} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.24 }}
                className="w-full max-w-md"
              >
                <div className="mx-auto w-full">
                  <ContactForm
                    onSuccess={handleSuccess}
                    onError={() => {}}
                    lang={lang}
                  />
                </div>
                <button
                  onClick={() => {
                    setShowContactForm(false);
                    setIsSubmitted(false);
                  }}
                  className="mt-4 text-sm font-medium text-slate-400 transition-colors hover:text-slate-600"
                >
                  {text.cancel}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="relative mx-auto mt-16 max-w-6xl"
        >
          <div className="overflow-hidden rounded-[48px] border border-slate-100 bg-white p-3 shadow-[0_56px_120px_-24px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
            <div className="overflow-hidden rounded-[38px] bg-slate-950">
              <video
                src="/landing-hero.mp4"
                className="aspect-[16/10] w-full object-cover lg:aspect-[21/9]"
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
