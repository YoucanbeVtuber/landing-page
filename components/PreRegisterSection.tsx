"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { COPY, type Lang } from "@/content/copy";

const TEXT = {
  en: {
    badge: "Beta launch",
  },
  kr: {
    badge: "Beta launch",
  },
} as const;

export default function PreRegisterSection({ lang }: { lang: Lang }) {
  const copy = COPY[lang].preRegister;
  const text = TEXT[lang];

  const scrollToHero = () => {
    const hero = document.getElementById("hero-section");
    hero?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="pre-register" className="px-5 pb-24 pt-8 sm:px-8 sm:pb-32">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[36px] bg-[#0f172a] px-8 py-20 text-center shadow-[0_32px_80px_-24px_rgba(15,23,42,0.6)] sm:px-12 sm:py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[oklch(52%_0.19_315)]/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 translate-x-1/4 translate-y-1/4 rounded-full bg-[oklch(72%_0.14_75)]/10 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[oklch(72%_0.14_315)]"
              style={{ fontFamily: "var(--font-hanken), system-ui, sans-serif" }}
            >
              <Sparkles size={12} className="text-[oklch(72%_0.14_315)]" />
              {text.badge}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-8 text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-5xl"
            style={{ fontFamily: "var(--font-gloock), var(--font-noto-serif-kr), Georgia, serif" }}
          >
            {copy.title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mx-auto mt-10 w-full max-w-xs"
          >
            <motion.button
              type="button"
              onClick={scrollToHero}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-black text-slate-900 shadow-lg transition"
              style={{ fontFamily: "var(--font-hanken), system-ui, sans-serif" }}
            >
              <span>{copy.ctaButton}</span>
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
