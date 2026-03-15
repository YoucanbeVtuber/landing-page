"use client";

import { motion } from "framer-motion";
import { ChevronDown, FolderOpen, Image as ImageIcon, Target } from "lucide-react";
import type { Lang } from "@/content/copy";

type PrecisionItem = {
  key: string;
  title: string;
  description: string;
  folder: string;
  layers: Array<{ name: string; indent: number; active?: boolean }>;
  beforeLabel: string;
  afterLabel: string;
  beforeSrc: string;
  afterSrc: string;
  reverse?: boolean;
};

function LayerItem({
  name,
  indent,
  active = false,
}: {
  name: string;
  indent: number;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono border-b border-slate-50 transition-colors ${
        active ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"
      }`}
      style={{ paddingLeft: `${indent * 12 + 12}px` }}
    >
      <span className={`h-2 w-2 rounded-full ${active ? "bg-indigo-500" : "bg-slate-300"}`} />
      <span className="truncate">{name}</span>
      {active && <div className="ml-auto w-1 h-1 rounded-full bg-indigo-500" />}
    </div>
  );
}

function ComparisonImage({
  src,
  label,
  fileName,
  fallbackText,
}: {
  src: string;
  label: string;
  fileName: string;
  fallbackText: string;
}) {
  return (
    <div className="relative flex-1 overflow-hidden rounded-[36px] border border-slate-100 bg-slate-50 p-6 text-center sm:rounded-[40px] sm:p-8 lg:rounded-[48px] lg:p-12">
      <span className="mb-6 inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
        {label}
      </span>
      <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[28px] bg-white sm:min-h-[360px] sm:rounded-[32px] lg:h-[320px] lg:min-h-0">
        <img
          src={src}
          alt={label}
          className="h-full w-full object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallback = e.currentTarget.nextElementSibling as HTMLDivElement | null;
            if (fallback) fallback.classList.remove("hidden");
          }}
        />
        <div className="hidden absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white px-6 text-center">
          <ImageIcon size={54} className="text-slate-200" />
          <div className="text-sm font-semibold text-slate-500">{fileName}</div>
          <div className="max-w-[240px] text-xs leading-6 text-slate-400">{fallbackText}</div>
        </div>
      </div>
    </div>
  );
}

function ComparisonPanel({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  fallbackText,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  fallbackText: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:h-[500px] md:flex-row">
      <ComparisonImage
        src={beforeSrc}
        label={beforeLabel}
        fileName={beforeSrc.replace("/precision/", "")}
        fallbackText={fallbackText}
      />
      <ComparisonImage
        src={afterSrc}
        label={afterLabel}
        fileName={afterSrc.replace("/precision/", "")}
        fallbackText={fallbackText}
      />
    </div>
  );
}

const precisionItems: PrecisionItem[] = [
  {
    key: "iris",
    title: "홍채 & 동공",
    description:
      "베이스, 동공, 하이라이트를 각각의 리깅용 레이어로 분리합니다.",
    folder: "Character_Head",
    beforeLabel: "Original illustration",
    afterLabel: "Smart Extraction",
    beforeSrc: "/precision/iris-before.png",
    afterSrc: "/precision/iris-after.png",
    layers: [
      { name: "Face_Base", indent: 1 },
      { name: "Eye_L_Group", indent: 1, active: true },
      { name: "Eye_L_Highlight", indent: 2, active: true },
      { name: "Eye_L_Pupil", indent: 2, active: true },
      { name: "Eye_L_Iris_Base", indent: 2, active: true },
      { name: "Eye_L_Sclera", indent: 2, active: true },
      { name: "Eye_R_Group", indent: 1 },
      { name: "Hair_Group", indent: 1 },
    ],
  },
  {
    key: "brow",
    title: "눈썹 다분할",
    description:
      "부드럽고 유연한 표정 변화를 위해 여러 파츠로 나뉩니다.",
    folder: "Eyebrows",
    beforeLabel: "Flat object",
    afterLabel: "Smart Segmentation",
    beforeSrc: "/precision/brow-before.png",
    afterSrc: "/precision/brow-after.png",
    reverse: true,
    layers: [
      { name: "Eyebrow_L_Group", indent: 1, active: true },
      { name: "Brow_L_Inner", indent: 2, active: true },
      { name: "Brow_L_Middle", indent: 2, active: true },
      { name: "Brow_L_Outer", indent: 2, active: true },
      { name: "Eyebrow_R_Group", indent: 1 },
    ],
  },
  {
    key: "mouth",
    title: "입 내부 구조",
    description:
      "입술에서 완벽히 분리된 혀와 치아 레이어를 지원합니다.",
    folder: "Mouth_Group",
    beforeLabel: "Closed lip",
    afterLabel: "Interior Reconstruction",
    beforeSrc: "/precision/mouth-before.png",
    afterSrc: "/precision/mouth-after.png",
    layers: [
      { name: "Mouth_Upper_Lip", indent: 1 },
      { name: "Mouth_Interior_Group", indent: 1, active: true },
      { name: "Teeth_Upper", indent: 2, active: true },
      { name: "Teeth_Lower", indent: 2, active: true },
      { name: "Tongue", indent: 2, active: true },
      { name: "Mouth_Inside_Base", indent: 2, active: true },
      { name: "Mouth_Lower_Lip", indent: 1 },
    ],
  },
];

const SECTION_COPY = {
  en: {
    heading: "Unmatched Precision",
    title: "Unmatched Precision",
    subtitle:
      "Every essential part is separated into a professional layer structure for rigging.",
    fallbackText: "Place this file in the public/precision folder and it will appear here.",
    items: {
      iris: {
        title: "Iris & Pupil",
        description: "Separated into Base, Pupil, and Highlights for deep parallax.",
      },
      brow: {
        title: "Expressive Brows",
        description: "Multi-segment splitting for smooth, elastic facial movement.",
      },
      mouth: {
        title: "Mouth Interior",
        description: "Lips, teeth, and tongue groups perfectly isolated.",
      },
    },
  },
  kr: {
    heading: "Unmatched Precision",
    title: "압도적인 정밀도",
    subtitle: "리깅에 필요한 모든 디테일을 전문적인 레이어 구조로 분리합니다.",
    fallbackText: "이 파일을 public/precision 폴더에 넣으면 여기서 바로 표시됩니다.",
    items: {
      iris: {
        title: "홍채 & 동공",
        description: "베이스, 동공, 하이라이트를 각각의 리깅용 레이어로 분리합니다.",
      },
      brow: {
        title: "눈썹 다분할",
        description: "부드럽고 유연한 표정 변화를 위해 여러 파츠로 나뉩니다.",
      },
      mouth: {
        title: "입 내부 구조",
        description: "입술에서 완벽히 분리된 혀와 치아 레이어를 지원합니다.",
      },
    },
  },
} as const;

export default function PrecisionSection({ lang }: { lang: Lang }) {
  const sectionCopy = SECTION_COPY[lang];
  const items = precisionItems.map((item) => ({
    ...item,
    title: sectionCopy.items[item.key as keyof typeof sectionCopy.items].title,
    description: sectionCopy.items[item.key as keyof typeof sectionCopy.items].description,
  })
  );

  return (
    <section className="py-48 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-32">
        <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-[12px] tracking-[0.4em] uppercase mb-6">
          <Target size={16} />
          {sectionCopy.heading}
        </div>
        <h2 className="text-5xl md:text-6xl font-[900] tracking-tighter text-slate-900 mb-8 leading-tight">
          {sectionCopy.title}
        </h2>
        <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
          {sectionCopy.subtitle}
        </p>
      </div>

      <div className="space-y-64">
        {items.map((item, index) => {
          const panel = (
            <ComparisonPanel
              beforeSrc={item.beforeSrc}
              afterSrc={item.afterSrc}
              beforeLabel={item.beforeLabel}
              afterLabel={item.afterLabel}
              fallbackText={sectionCopy.fallbackText}
            />
          );

          const info = (
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden self-start">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FolderOpen size={12} className="text-slate-300" /> {item.folder}
                </span>
                <ChevronDown size={12} className="text-slate-300" />
              </div>
              <div className="py-2">
                {item.layers.map((layer) => (
                  <LayerItem
                    key={layer.name}
                    name={layer.name}
                    indent={layer.indent}
                    active={layer.active}
                  />
                ))}
              </div>
              <div className="p-6 bg-slate-50/50">
                <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          );

          return (
            <motion.div
              key={item.key}
              className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
            >
              {item.reverse ? (
                <>
                  <div className="order-2 lg:order-1 lg:col-span-4">{info}</div>
                  <div className="order-1 lg:order-2 lg:col-span-8">{panel}</div>
                </>
              ) : (
                <>
                  <div className="lg:col-span-8">{panel}</div>
                  <div className="lg:col-span-4">{info}</div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
