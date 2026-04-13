"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Image as ImageIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import type { Lang } from "@/content/copy";

const EASE = [0.16, 1, 0.3, 1] as const;
const UPLOAD_ART_PREVIEW_SRC = "/workflow/upload-art-preview.png";

function StepIcon({
  icon: Icon,
  index,
  imageSrc,
}: {
  icon: typeof ImageIcon;
  index: number;
  imageSrc?: string;
}) {
  const [imageMissing, setImageMissing] = useState(false);

  if (imageSrc && !imageMissing) {
    return (
      <div className="mb-8 flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] border border-slate-200 bg-white p-2 shadow-sm transition-all duration-500 group-hover:shadow-lg">
        <Image
          src={imageSrc}
          alt="Upload art preview"
          width={96}
          height={96}
          className="h-full w-full rounded-[22px] object-contain"
          onError={() => setImageMissing(true)}
        />
      </div>
    );
  }

  return (
    <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] border border-slate-100 bg-white shadow-sm transition-all duration-500 group-hover:shadow-lg">
      <Icon className="text-[oklch(52%_0.19_315)]" size={32} />
    </div>
  );
}

const COPY = {
  en: {
    eyebrow: "How it works",
    title: "How it works",
    steps: [
      {
        icon: ImageIcon,
        imageSrc: UPLOAD_ART_PREVIEW_SRC,
        step: "01",
        title: "Upload",
        desc: "Upload your masterpiece.",
      },
      {
        icon: Sparkles,
        step: "02",
        title: "Precision Analysis",
        desc: "We analyze your art into a rigging-optimized structure.",
      },
      {
        icon: Download,
        step: "03",
        title: "Start Rigging",
        desc: "Start rigging immediately with a neatly organized PSD.",
      },
    ],
  },
  kr: {
    eyebrow: "How it works",
    title: "How it works",
    steps: [
      {
        icon: ImageIcon,
        imageSrc: UPLOAD_ART_PREVIEW_SRC,
        step: "01",
        title: "작품 업로드",
        desc: "당신의 마스터피스를 업로드하세요.",
      },
      {
        icon: Sparkles,
        step: "02",
        title: "자동 분리",
        desc: "가려진 부분 복원부터 리깅용 파츠 분리까지 한 번에 끝냅니다.",
      },
      {
        icon: Download,
        step: "03",
        title: "다운로드",
        desc: "정돈된 PSD로 즉시 리깅을 시작하세요.",
      },
    ],
  },
} as const;

export default function UseCaseSection({ lang }: { lang: Lang }) {
  const content = COPY[lang];

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">

        {/* ── Header ── */}
        <motion.div
          className="mb-16 text-center sm:mb-20"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <h2
            className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl"
            style={{ fontFamily: "var(--font-gloock), var(--font-noto-serif-kr), Georgia, serif" }}
          >
            {content.title}
          </h2>
        </motion.div>

        {/* ── Steps ── */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 relative">
          {content.steps.map((step, index) => {
            const Icon = step.icon;
            const imageSrc = "imageSrc" in step ? step.imageSrc : undefined;

            return (
              <motion.div
                key={step.title}
                className="flex flex-col items-center group relative z-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.1, ease: EASE }}
              >
                <StepIcon icon={Icon} index={index} imageSrc={imageSrc} />
                <p
                  className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[oklch(52%_0.19_315)]/60"
                  style={{ fontFamily: "var(--font-hanken), system-ui, sans-serif" }}
                >
                  {step.step}
                </p>
                <h3
                  className="mb-3 text-xl font-black tracking-tight text-slate-900"
                  style={{ fontFamily: "var(--font-hanken), system-ui, sans-serif" }}
                >
                  {step.title}
                </h3>
                <p
                  className="max-w-[220px] text-sm leading-relaxed text-slate-500"
                  style={{ fontFamily: "var(--font-hanken), system-ui, sans-serif" }}
                >
                  {step.desc}
                </p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[78%] w-full h-px border-t border-dashed border-slate-200 -z-10" />
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
