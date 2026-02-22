"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COPY } from "@/content/copy";
import ContactForm from "./ContactForm";
import { ArrowRight, Sparkles } from "lucide-react";



export default function PreRegisterSection() {
  const [showForm, setShowForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMobile = () => setIsMobile(mediaQuery.matches);
    updateMobile();
    mediaQuery.addEventListener("change", updateMobile);
    return () => mediaQuery.removeEventListener("change", updateMobile);
  }, []);

  useEffect(() => {
    if (!(showForm && isMobile)) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowForm(false);
    };
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showForm, isMobile]);

  const handleSuccess = () => {
    setToastMessage(COPY.preRegister.form.success);
    setShowToast(true);
    setShowForm(false);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleError = () => {
    setToastMessage(COPY.preRegister.form.error);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <section
      id="pre-register"
      className="relative overflow-hidden bg-gray-950 py-32 px-6"
    >
      {/* ── 배경 레이어 ── */}
      {/* 노이즈 오버레이 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      {/* 중앙 글로우 */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-violet-700/20 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute left-1/4 bottom-0 w-[400px] h-[300px] bg-pink-700/15 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 w-[300px] h-[200px] bg-indigo-700/15 rounded-full blur-[100px]" />

      {/* ── 콘텐츠 ── */}
      <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center text-center">

        {/* 배지 */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase text-violet-300 backdrop-blur-sm">
            <Sparkles size={12} className="text-violet-400" />
            Early Access · 한정 모집
          </span>
        </motion.div>

        {/* 헤드라인 */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mb-5 text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight text-white"
        >
          지금 신청하고
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            가장 먼저 경험하세요
          </span>
        </motion.h2>

        {/* 서브텍스트 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="mb-12 max-w-lg text-base sm:text-lg text-white/50 leading-relaxed"
        >
          사전 예약 신청자에게는 출시 즉시 알림과 함께
          <br className="hidden sm:block" />
          <strong className="text-white/80 font-semibold">무료 크레딧 100%</strong>를 드립니다.
        </motion.p>


        {/* CTA 영역 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.4 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.button
                  onClick={() => setShowForm(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-8 py-4 font-bold text-white text-lg shadow-2xl shadow-violet-900/50 transition-all duration-300 hover:shadow-violet-800/60 flex items-center justify-center gap-2"
                >
                  {/* shimmer effect */}
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_0.7s_ease_forwards]" />
                  <span>{COPY.preRegister.ctaButton}</span>
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </motion.button>
                <p className="text-xs text-white/30">
                  * 스팸 없이 출시 소식만 전해드립니다. 언제든지 구독 취소 가능.
                </p>
              </motion.div>
            ) : (
              !isMobile && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* 다크 테마용 ContactForm 래퍼 */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-1">
                    <ContactForm onSuccess={handleSuccess} onError={handleError} />
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="mt-3 text-sm text-white/30 hover:text-white/60 transition-colors w-full text-center"
                  >
                    취소
                  </button>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>

        {/* 구분선 + 부가 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex items-center gap-6 text-white/20 text-xs"
        >
          <span className="h-px flex-1 bg-white/10" />
          <span className="whitespace-nowrap">Live2D 파츠 분리 자동화 · 사전 예약</span>
          <span className="h-px flex-1 bg-white/10" />
        </motion.div>
      </div>

      {/* ── Toast ── */}
      {showToast && (
        <motion.div
          className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/10 text-white px-6 py-4 rounded-full shadow-2xl z-50 text-sm font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {toastMessage}
        </motion.div>
      )}

      {/* ── Mobile Modal ── */}
      {showForm && isMobile && (
        <motion.div
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm px-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="min-h-full flex items-start justify-center py-4">
            <motion.div
              className="relative w-full max-w-md mt-[max(12px,env(safe-area-inset-top))] mb-[max(16px,env(safe-area-inset-bottom))]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full bg-white/10 text-white text-lg leading-none hover:bg-white/20 transition-colors"
                aria-label="모달 닫기"
              >
                ×
              </button>
              <ContactForm onSuccess={handleSuccess} onError={handleError} isMobileModal />
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
