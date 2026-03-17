"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MessageSquareQuote } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Lang } from "@/content/copy";

type SlideCopy = {
  label: string;
  headline: string;
  caption: string;
  tab: string;
  image: string;
  filename: string;
  panelClassName?: string;
  imageClassName?: string;
};

const COPY: Record<
  Lang,
  {
    eyebrow: string;
    title: string;
    badgeBody: string;
    next: string;
    prev: string;
    slides: SlideCopy[];
  }
> = {
  en: {
    eyebrow: "Creator's Voice",
    title: "We evolve with riggers.",
    badgeBody: "Build in Public: We promise improvement over perfection.",
    prev: "Previous",
    next: "Next",
    slides: [
      {
        label: "01 Real rigger feedback",
        headline: "Feedback from the workflow",
        caption: "Refinement request captured directly from a beginner rigger.",
        tab: "Friction",
        image: "/social-proof/feedback-conversation.png",
        filename: "feedback-conversation.png",
      },
      {
        label: "02 Improved result",
        headline: "Sharper structure after reflection",
        caption: "Iris layer precision feedback has been reflected in the output.",
        tab: "Iteration",
        image: "/social-proof/layer-structure-iteration.png",
        filename: "layer-structure-iteration.png",
        panelClassName: "lg:min-h-[860px]",
        imageClassName: "scale-[1.08] lg:scale-[1.14]",
      },
      {
        label: "03 Encouragement",
        headline: "Creators notice fast improvement",
        caption: "A short response that proves fast feedback loops build trust.",
        tab: "Support",
        image: "/social-proof/community-encouragement.png",
        filename: "community-encouragement.png",
      },
    ],
  },
  kr: {
    eyebrow: "Creator's Voice",
    title: "우리는 리거와 함께 진화합니다.",
    badgeBody: "Build in Public: 완벽보다 개선을 약속합니다.",
    prev: "이전",
    next: "다음",
    slides: [
      {
        label: "01 리거의 실제 피드백",
        headline: "작업 현장의 고민",
        caption: "홍채 분리 정밀도에 대한 피드백이 실제 작업 맥락에서 남았습니다.",
        tab: "고민",
        image: "/social-proof/feedback-conversation.png",
        filename: "feedback-conversation.png",
      },
      {
        label: "02 개선된 결과",
        headline: "더 정교해진 결과물",
        caption: "홍채 레이어 정밀도 피드백 반영 완료.",
        tab: "개선",
        image: "/social-proof/layer-structure-iteration.png",
        filename: "layer-structure-iteration.png",
        panelClassName: "lg:min-h-[860px]",
        imageClassName: "scale-[1.08] lg:scale-[1.14]",
      },
      {
        label: "03 응원의 메시지",
        headline: "다음 버전을 기다리게 하는 한마디",
        caption: "피드백이 빠르게 반영된다는 신뢰가 응원으로 이어졌습니다.",
        tab: "응원",
        image: "/social-proof/community-encouragement.png",
        filename: "community-encouragement.png",
      },
    ],
  },
};

function SlideImage({ slide }: { slide: SlideCopy }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div
        className={`flex h-full min-h-[420px] w-full flex-col justify-between rounded-[36px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_42%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 sm:min-h-[520px] lg:min-h-[760px] ${slide.panelClassName ?? ""}`}
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white">
            <MessageSquareQuote size={12} />
            Pending asset
          </div>
          <div className="mt-5 text-[11px] font-black uppercase tracking-[0.26em] text-slate-400">
            {slide.label}
          </div>
          <div className="mt-3 text-2xl font-black tracking-tight text-slate-900">{slide.headline}</div>
        </div>
        <div className="max-w-fit bg-white px-4 py-3 text-sm font-semibold text-slate-500 shadow-sm">
          Place image here: <span className="font-black text-slate-900">{slide.filename}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-[420px] overflow-hidden rounded-[36px] bg-[#f6f7fb] sm:min-h-[520px] lg:min-h-[760px] ${slide.panelClassName ?? ""}`}
    >
      <Image
        src={slide.image}
        alt={slide.headline}
        fill
        className={`object-contain p-4 scale-[1.05] sm:p-6 lg:scale-[1.12] ${slide.imageClassName ?? ""}`}
        onError={() => setBroken(true)}
      />
    </div>
  );
}

export default function CreatorsVoiceSection({ lang }: { lang: Lang }) {
  const content = COPY[lang];
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const activeSlide = content.slides[activeIndex];

  const move = (direction: -1 | 1) => {
    const total = content.slides.length;
    setDirection(direction);
    setActiveIndex((current) => (current + direction + total) % total);
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % content.slides.length);
    }, 5200);

    return () => window.clearInterval(id);
  }, [content.slides.length]);

  return (
    <section className="overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_34%,#eef2ff_100%)] px-6 py-36">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:grid lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="order-1 overflow-hidden rounded-[40px] bg-[#f6f7fb] lg:order-2"
        >
          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeSlide.image}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 54 : -54 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -54 : 54 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500 sm:left-6 sm:top-6">
                  {activeSlide.label}
                </div>
                <SlideImage slide={activeSlide} />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/88 to-transparent px-4 pb-4 pt-20 sm:px-6 sm:pb-6">
                  <p className="max-w-xl text-sm font-semibold leading-7 text-slate-700 sm:text-base">
                    {activeSlide.caption}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              aria-label={content.prev}
              onClick={() => move(-1)}
              className="absolute left-2 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/84 text-slate-700 backdrop-blur-sm transition-colors hover:bg-white sm:left-4"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              aria-label={content.next}
              onClick={() => move(1)}
              className="absolute right-2 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/84 text-slate-700 backdrop-blur-sm transition-colors hover:bg-white sm:right-4"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="order-2 lg:sticky lg:top-24 lg:order-1"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-indigo-600 shadow-sm">
            <MessageSquareQuote size={14} />
            {content.eyebrow}
          </div>
          <h2 className="mt-7 max-w-lg text-4xl font-[950] tracking-[-0.06em] text-slate-950 sm:text-5xl">
            {content.title}
          </h2>

          <p className="mt-6 max-w-md text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
            {content.badgeBody}
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:max-w-md">
            {content.slides.map((slide, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={slide.image}
                  type="button"
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1);
                    setActiveIndex(index);
                  }}
                  className={`rounded-[22px] px-4 py-4 text-left transition-all ${
                    active ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`text-[10px] font-black uppercase tracking-[0.22em] ${
                      active ? "text-indigo-200" : "text-slate-400"
                    }`}
                  >
                    0{index + 1}
                  </div>
                  <div className="mt-2 text-sm font-black tracking-tight">{slide.tab}</div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
