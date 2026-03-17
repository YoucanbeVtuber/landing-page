"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Image as ImageIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import type { Lang } from "@/content/copy";

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
      <div className="mb-10 flex h-28 w-28 items-center justify-center overflow-hidden rounded-[36px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-2 shadow-sm ring-1 ring-slate-100 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl">
        <Image
          src={imageSrc}
          alt="Upload art preview"
          width={112}
          height={112}
          className="h-full w-full rounded-[28px] object-contain"
          onError={() => setImageMissing(true)}
        />
      </div>
    );
  }

  return (
    <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-[36px] border border-slate-100 bg-slate-50 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl">
      <Icon
        className={
          index === 1 ? "text-indigo-600" : index === 2 ? "text-indigo-900" : "text-slate-900"
        }
        size={36}
      />
    </div>
  );
}

const COPY = {
  en: {
    title: "How it works",
    steps: [
      {
        icon: ImageIcon,
        imageSrc: UPLOAD_ART_PREVIEW_SRC,
        title: "Upload",
        desc: "Upload your masterpiece.",
      },
      {
        icon: Sparkles,
        title: "Precision Analysis",
        desc: "We analyze your art into a rigging-optimized structure.",
      },
      {
        icon: Download,
        title: "Start Rigging",
        desc: "Start rigging immediately with a neatly organized PSD.",
      },
    ],
  },
  kr: {
    title: "How it works",
    steps: [
      {
        icon: ImageIcon,
        imageSrc: UPLOAD_ART_PREVIEW_SRC,
        title: "작품 업로드",
        desc: "당신의 마스터피스를 업로드하세요.",
      },
      {
        icon: Sparkles,
        title: "자동 분리",
        desc: "가려진 부분 복원부터 리깅용 파츠 분리까지 한 번에 끝냅니다.",
      },
      {
        icon: Download,
        title: "다운로드",
        desc: "정돈된 PSD로 즉시 리깅을 시작하세요.",
      },
    ],
  },
} as const;

export default function UseCaseSection({ lang }: { lang: Lang }) {
  const content = COPY[lang];

  return (
    <section className="bg-white py-40 border-y border-slate-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-[900] mb-24 tracking-tight text-slate-900">
          {content.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 relative">
          {content.steps.map((step, index) => {
            const Icon = step.icon;
            const imageSrc = "imageSrc" in step ? step.imageSrc : undefined;

            return (
              <motion.div
                key={step.title}
                className="flex flex-col items-center group relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <StepIcon icon={Icon} index={index} imageSrc={imageSrc} />
                <div className="text-slate-300 font-mono text-[11px] font-bold mb-4 tracking-[0.5em]">
                  STEP 0{index + 1}
                </div>
                <h3 className="font-bold text-2xl tracking-tight text-slate-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-base text-slate-500 max-w-[240px] leading-relaxed font-medium">
                  {step.desc}
                </p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[80%] w-full h-[1px] border-t border-dashed border-slate-200 -z-10 opacity-60" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
