"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { COPY } from "@/content/copy";
import ContactForm from "./ContactForm";

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

  const handleSuccess = () => {
    setToastMessage(COPY.preRegister.form.success);
    setShowToast(true);
    setShowForm(false);

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleError = () => {
    setToastMessage(COPY.preRegister.form.error);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" as const } 
    },
  };

  return (
    <section id="pre-register" className="relative min-h-[80vh] py-32 px-6 bg-[#0a0a0f] overflow-hidden flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-6 whitespace-pre-line"
          >
            {COPY.preRegister.title}
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-purple-200 mb-12 max-w-2xl mx-auto whitespace-pre-line"
          >
            {COPY.preRegister.subtitle}
          </motion.p>

          <motion.div variants={itemVariants}>
            {!showForm ? (
              <motion.button
                onClick={() => setShowForm(true)}
                className="px-10 py-4 bg-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-purple-500/30 hover:bg-purple-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {COPY.preRegister.ctaButton}
              </motion.button>
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
