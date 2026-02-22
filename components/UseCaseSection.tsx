"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { COPY } from "@/content/copy";
import UseCaseVisuals from "./UseCaseVisuals";

// 각 스텝별 디자인 토큰
const stepDesigns = [
  {
    accent: "from-violet-500 to-purple-600",
    accentLight: "bg-violet-50",
    accentText: "text-violet-600",
    accentBorder: "border-violet-100",
    badgeLabel: "STEP 01",
    titleSize: "text-2xl sm:text-3xl",
    titleWeight: "font-black",
    descStyle: "text-base",
  },
  {
    accent: "from-pink-500 to-rose-500",
    accentLight: "bg-pink-50",
    accentText: "text-pink-600",
    accentBorder: "border-pink-100",
    badgeLabel: "STEP 02",
    titleSize: "text-xl sm:text-2xl",
    titleWeight: "font-extrabold",
    descStyle: "text-sm",
  },
  {
    accent: "from-amber-400 to-orange-500",
    accentLight: "bg-amber-50",
    accentText: "text-amber-600",
    accentBorder: "border-amber-100",
    badgeLabel: "STEP 03",
    titleSize: "text-2xl sm:text-3xl",
    titleWeight: "font-black",
    descStyle: "text-base",
  },
  {
    accent: "from-emerald-500 to-teal-500",
    accentLight: "bg-emerald-50",
    accentText: "text-emerald-600",
    accentBorder: "border-emerald-100",
    badgeLabel: "STEP 04",
    titleSize: "text-xl sm:text-2xl",
    titleWeight: "font-extrabold",
    descStyle: "text-sm",
  },
];

export default function UseCaseSection() {
  const [activeCards, setActiveCards] = useState<Record<number, boolean>>({});
  const [playTokens, setPlayTokens] = useState<Record<number, number>>({});

  return (
    <section className="relative bg-white px-4 py-24 overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-purple-100/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-pink-100/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold tracking-widest uppercase mb-4">
          How It Works
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {COPY.useCase.sectionTitle}
        </h2>
        <p className="text-gray-500 text-lg max-w-lg mx-auto">
          {COPY.useCase.sectionSubtitle}
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {COPY.useCase.steps.map((step, index) => {
          const design = stepDesigns[index % stepDesigns.length];

          return (
            <motion.article
              key={step.title}
              className={`relative rounded-3xl border ${design.accentBorder} bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
              onViewportEnter={() => {
                setActiveCards((prev) => ({ ...prev, [index]: true }));
                setPlayTokens((prev) => ({
                  ...prev,
                  [index]: (prev[index] ?? 0) + 1,
                }));
              }}
              onViewportLeave={() => {
                setActiveCards((prev) => ({ ...prev, [index]: false }));
              }}
            >
              {/* 상단 그라디언트 스트라이프 */}
              <div className={`h-1 w-full bg-gradient-to-r ${design.accent}`} />

              <div className="p-6">
                {/* Step header */}
                <div className="flex items-start gap-4 mb-5">
                  {/* 스텝 넘버 - 배지 스타일 */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br ${design.accent} shadow-md`}>
                      <span className="text-white text-sm font-black">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* 레이블 */}
                    <span className={`inline-block text-[10px] font-bold tracking-[0.18em] uppercase ${design.accentText} mb-1`}>
                      {design.badgeLabel}
                    </span>

                    {/* 제목 - 스텝마다 크기/굵기 변주 */}
                    <h3 className={`${design.titleSize} ${design.titleWeight} text-gray-900 leading-tight`}>
                      {step.title}
                    </h3>

                    {/* 설명 - 왼쪽 강조선 포인트 */}
                    <div className="mt-2 relative pl-3">
                      <div className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-gradient-to-b ${design.accent}`} />
                      <p className={`${design.descStyle} text-gray-500 leading-relaxed whitespace-pre-line`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual */}
                {activeCards[index] ? (
                  <UseCaseVisuals
                    key={`${index}-${playTokens[index] ?? 0}`}
                    currentStep={index}
                    stackMode
                  />
                ) : (
                  <div className={`w-full h-[50vh] max-h-[480px] rounded-2xl border ${design.accentBorder} ${design.accentLight} opacity-40`} />
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
