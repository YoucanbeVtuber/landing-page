"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import HeroUploadSection from "@/components/HeroUploadSection";
import LayerLogicSection from "@/components/LayerLogicSection";
import PrecisionSection from "@/components/PrecisionSection";
import UseCaseSection from "@/components/UseCaseSection";
import CreatorsVoiceSection from "@/components/CreatorsVoiceSection";
import PreRegisterSection from "@/components/PreRegisterSection";
import type { Lang } from "@/content/copy";

export default function Home() {
  const [lang, setLang] = useState<Lang>("kr");

  return (
    <main className="overflow-x-hidden">
      <div className="fixed right-6 top-6 z-[70]">
        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 text-[11px] font-bold text-slate-600 shadow-sm backdrop-blur-md">
          <Languages size={14} />
          {(["en", "kr"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLang(option)}
              className={`rounded-full px-3 py-1.5 transition-all ${
                lang === option
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <HeroUploadSection lang={lang} />
      <LayerLogicSection lang={lang} />
      <PrecisionSection lang={lang} />
      <UseCaseSection lang={lang} />
      <CreatorsVoiceSection lang={lang} />
      <PreRegisterSection lang={lang} />
    </main>
  );
}
