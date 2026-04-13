"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Lang } from "@/content/copy";

const EASE = [0.16, 1, 0.3, 1] as const;

// Add more entries here as proof videos become available
const PROOF_VIDEOS = [
  { src: "/workflow/after.mp4" },
  // { src: "/workflow/proof-2.mp4" },
];

const COPY = {
  kr: {
    eyebrow: "데뷔까지 한 걸음",
    headline: "다운로드한 PSD는\n바로 리깅 가능합니다.",
    riggerNote: "리깅 작가 연결도 도와드립니다.",
  },
  en: {
    eyebrow: "One step to debut",
    headline: "Download the PSD.\nStart rigging immediately.",
    riggerNote: "We can connect you with a rigger, too.",
  },
} as const;

export default function MotionSection({ lang }: { lang: Lang }) {
  const c = COPY[lang] ?? COPY.en;
  const [index, setIndex] = useState(0);
  const hasMultiple = PROOF_VIDEOS.length > 1;

  const prev = () =>
    setIndex((i) => (i - 1 + PROOF_VIDEOS.length) % PROOF_VIDEOS.length);
  const next = () =>
    setIndex((i) => (i + 1) % PROOF_VIDEOS.length);

  return (
    <section className="bg-[#f7f8fc] py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">

        {/* ── Header ── */}
        <motion.div
          className="mb-12 text-center sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <p
            className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[oklch(52%_0.19_315)]"
            style={{ fontFamily: "var(--font-hanken), system-ui, sans-serif" }}
          >
            {c.eyebrow}
          </p>
          <h2
            className="whitespace-pre-line text-3xl font-black leading-[1.12] tracking-tight text-slate-900 sm:text-4xl"
            style={{
              fontFamily:
                "var(--font-gloock), var(--font-noto-serif-kr), Georgia, serif",
            }}
          >
            {c.headline}
          </h2>
        </motion.div>

        {/* ── Video area ── */}
        <motion.div
          className="relative mx-auto w-full max-w-3xl"
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        >
          {/* Prev / Next arrows — only when multiple videos */}
          {hasMultiple && (
            <>
              <button
                onClick={prev}
                className="-ml-3 absolute left-0 top-1/2 z-10 -translate-x-full -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-md transition hover:text-slate-900"
                aria-label="Previous video"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="-mr-3 absolute right-0 top-1/2 z-10 translate-x-full -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-md transition hover:text-slate-900"
                aria-label="Next video"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Video */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="overflow-hidden rounded-3xl bg-slate-100 shadow-[0_24px_80px_-20px_rgba(15,23,42,0.14)]"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                key={PROOF_VIDEOS[index].src}
                src={PROOF_VIDEOS[index].src}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators — only when multiple videos */}
          {hasMultiple && (
            <div className="mt-5 flex justify-center gap-2">
              {PROOF_VIDEOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-5 bg-[oklch(52%_0.19_315)]"
                      : "w-1.5 bg-slate-300"
                  }`}
                  aria-label={`Video ${i + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Rigger note ── */}
        <motion.p
          className="mt-8 text-center text-[13px] text-slate-400"
          style={{ fontFamily: "var(--font-hanken), system-ui, sans-serif" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.35 }}
        >
          {c.riggerNote}
        </motion.p>

      </div>
    </section>
  );
}
