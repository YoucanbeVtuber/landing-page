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
    <section id="pre-register" className="px-4 pb-28 pt-10">
      <div className="mx-auto max-w-6xl rounded-[56px] bg-[#111827] px-6 py-16 shadow-[0_48px_120px_-50px_rgba(15,23,42,0.9)] sm:px-10 lg:px-20 lg:py-24">
        <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-[linear-gradient(135deg,#0f172a,#111827_45%,#1e1b4b)] px-6 py-16 text-center sm:px-10">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[140px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-pink-500/10 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-violet-300 backdrop-blur-sm">
                <Sparkles size={13} className="text-violet-400" />
                {text.badge}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-8 text-4xl font-black leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {copy.title}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mx-auto mt-12 w-full max-w-md"
            >
              <motion.button
                type="button"
                onClick={scrollToHero}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-black text-slate-900 transition"
              >
                <span>{copy.ctaButton}</span>
                <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
