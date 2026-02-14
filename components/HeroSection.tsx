"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { COPY } from "@/content/copy";
import LayerStack from "./LayerStack";
import ContactForm from "./ContactForm";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
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
      if (e.key === "Escape") {
        setShowForm(false);
      }
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

  // Track scroll progress within this section
  // Track scroll through entire 300vh runway
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Move layers up to overlap text as user scrolls
  const translateY = useTransform(
    scrollYProgress,
    [0, 0.5],
    [0, isMobile ? -180 : -350]
  );

  // Handle form success
  const handleSuccess = () => {
    setToastMessage(COPY.preRegister.form.success);
    setShowToast(true);
    setShowForm(false);

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  // Handle form error
  const handleError = () => {
    setToastMessage(COPY.preRegister.form.error);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[320vh] md:h-[400vh] bg-gradient-to-b from-[#0a0a0f] via-[#1a1a3e] to-[#0f0f28]"
    >
      {/* Sticky container that stays fixed while scrolling through 300vh runway */}
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-start px-6 pt-24 md:pt-32">
        {/* Copy */}
        <motion.div
          className="text-center mb-8 md:mb-12 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-hero-mobile md:text-hero font-bold mb-6 whitespace-pre-line text-white">
            {COPY.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-purple-200 whitespace-pre-line max-w-2xl mx-auto mb-8">
            {COPY.hero.subtitle}
          </p>

          {/* Pre-registration CTA button or Form */}
          {!showForm ? (
            <div className="flex flex-col items-center gap-3">
              <motion.button
                onClick={() => setShowForm(true)}
                className="px-10 py-4 bg-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-purple-500/30 hover:bg-purple-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                얼리 액세스 신청
              </motion.button>
              <p className="text-xs md:text-sm text-purple-100/80">
                출시 알림과 함께 무료 크레딧을 드립니다
              </p>
            </div>
          ) : (
            !isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ContactForm onSuccess={handleSuccess} onError={handleError} />
              </motion.div>
            )
          )}
        </motion.div>

        {/* Image Container with 3D transforms */}
        <motion.div 
          className="relative w-full max-w-[85vw] sm:max-w-md md:max-w-lg lg:max-w-xl perspective-1000 z-20"
          style={{ y: translateY }}
        >
          {/* Layer Stack - starts visible, no fade effect */}
          <div className="relative w-full aspect-square">
            <LayerStack scrollProgress={scrollYProgress} />
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 text-sm text-purple-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          
        </motion.div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <motion.div
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-purple-500/30 text-white px-6 py-4 rounded-full shadow-2xl z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {toastMessage}
        </motion.div>
      )}

      {showForm && isMobile && (
        <motion.div
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm px-4 overflow-y-auto"
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
                className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full bg-black/40 text-white text-lg leading-none"
                aria-label="모달 닫기"
              >
                ×
              </button>
              <ContactForm
                onSuccess={handleSuccess}
                onError={handleError}
                isMobileModal
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
