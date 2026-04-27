"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Lang } from "@/content/copy";

const TEXT = {
  en: {
    footerLabel: "Privacy Policy",
    footerNote: "Analytics and registration notice",
    title: "Privacy Policy",
    intro:
      "This site processes limited information needed to operate the page, understand usage patterns, and handle early-access requests.",
    analyticsTitle: "Information collected",
    analyticsBody:
      "We collect page visit information such as page path, referrer, country, browser, operating system, and device type for statistical purposes. This information is used in aggregate and does not identify you directly.",
    registrationTitle: "What we store when you apply",
    registrationBody:
      "When you submit the early-access form, we store the language you selected on the site and the access path from the page URL so we can review the request and follow up appropriately.",
    consentNote:
      "By using this service and submitting the form, you are considered to have agreed to the collection and use described in this policy.",
    close: "Close",
  },
  kr: {
    footerLabel: "개인정보처리방침",
    footerNote: "분석 및 신청 안내",
    title: "개인정보처리방침",
    intro:
      "본 사이트는 페이지 운영, 이용 현황 확인, 얼리엑세스 신청 처리를 위해 필요한 정보만 처리합니다.",
    analyticsTitle: "수집하는 정보",
    analyticsBody:
      "본 사이트는 통계 확인을 위해 페이지 경로, 유입 경로, 국가, 브라우저, 운영체제, 기기 유형 등의 방문 정보를 수집할 수 있습니다. 해당 정보는 통계 목적으로만 활용되며 직접적인 개인 식별에 사용되지 않습니다.",
    registrationTitle: "얼리엑세스 신청 시 저장하는 정보",
    registrationBody:
      "얼리엑세스 신청을 제출하면, 사이트에서 선택한 언어와 페이지 URL의 접속 경로를 저장합니다. 이는 신청 내용을 확인하고 안내를 드리기 위한 용도입니다.",
    consentNote:
      "본 서비스를 이용하거나 신청 양식을 제출하는 경우, 본 방침에 따른 정보 수집 및 이용에 동의한 것으로 봅니다.",
    close: "닫기",
  },
} as const;

export default function SiteFooter({ lang }: { lang: Lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const text = TEXT[lang];

  useEffect(() => {
    if (!isOpen) return;

    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  return (
    <>
      <footer className="border-t border-slate-200 bg-white px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="text-lg font-black tracking-tight text-slate-900">LIVINGCEl</p>
            <p className="mt-1 text-sm text-slate-500">{text.footerNote}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            {text.footerLabel}
          </button>
        </div>
      </footer>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="privacy-policy-title"
              className="relative w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_90px_-24px_rgba(15,23,42,0.5)] sm:rounded-[34px]"
              initial={{ y: 28, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 18, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative overflow-hidden border-b border-slate-100 bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_100%)] px-6 py-5 sm:px-8 sm:py-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_30%)]" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="max-w-xl">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[oklch(52%_0.19_315)]">
                      {text.footerLabel}
                    </p>
                    <h2
                      id="privacy-policy-title"
                      className="mt-2 text-[1.75rem] font-black leading-[1.05] tracking-tight text-slate-900 sm:text-3xl"
                      style={{ fontFamily: "var(--font-gloock), var(--font-noto-serif-kr), Georgia, serif" }}
                    >
                      {text.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
                      {text.intro}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    aria-label={text.close}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-12rem)] space-y-6 overflow-y-auto px-6 py-6 text-sm leading-7 text-slate-600 sm:max-h-[calc(100vh-16rem)] sm:px-8 sm:py-7">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      {text.analyticsTitle}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{text.analyticsBody}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      {text.registrationTitle}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{text.registrationBody}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      {lang === "kr" ? "수집 항목" : "Information"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {lang === "kr" ? "방문 통계" : "Visit statistics"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      {lang === "kr" ? "저장 항목" : "Stored fields"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {lang === "kr" ? "언어, 접속 경로" : "Language and access path"}
                    </p>
                  </div>
                </div>

                <p className="text-xs leading-6 text-slate-500">
                  {text.consentNote}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
