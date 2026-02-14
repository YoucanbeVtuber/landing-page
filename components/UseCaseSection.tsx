"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { COPY } from "@/content/copy";
import UseCaseVisuals from "./UseCaseVisuals";

export default function UseCaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCards, setActiveCards] = useState<Record<number, boolean>>({});
  const [playTokens, setPlayTokens] = useState<Record<number, number>>({});

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMobile = () => setIsMobile(mediaQuery.matches);
    updateMobile();
    mediaQuery.addEventListener("change", updateMobile);
    return () => mediaQuery.removeEventListener("change", updateMobile);
  }, []);

  // Track scroll through entire 500vh runway (100vh per step approx)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Determine current step based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isMobile) return;
    const stepCount = COPY.useCase.steps.length;
    const stepIndex = Math.floor(latest * stepCount);
    // Clamp between 0 and stepCount - 1
    const clampedStep = Math.max(0, Math.min(stepIndex, stepCount - 1));
    setCurrentStep(clampedStep);
  });

  if (isMobile) {
    return (
      <section className="relative bg-[#0a0a0f] px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-10">
          {COPY.useCase.steps.map((step, index) => (
            <motion.article
              key={step.title}
              className="rounded-2xl border border-gray-800 bg-[#12121a] p-4"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
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
              <h2 className="text-2xl font-bold mb-3 text-white whitespace-pre-line">
                {step.title}
              </h2>
              <p className="text-base text-purple-200 leading-relaxed whitespace-pre-line mb-4">
                {step.description}
              </p>
              {activeCards[index] ? (
                <UseCaseVisuals
                  key={`${index}-${playTokens[index] ?? 0}`}
                  currentStep={index}
                  stackMode
                />
              ) : (
                <div className="w-full h-[56vh] max-h-[560px] rounded-xl border border-gray-800 bg-gray-900/40" />
              )}
            </motion.article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[520vh] md:h-[500vh] bg-[#0a0a0f]"
    >
      <div className="sticky top-[72px] md:top-0 h-[calc(100vh-72px)] md:h-screen flex flex-col items-center justify-start overflow-visible md:overflow-hidden pt-8 md:pt-32">
        <div className="container mx-auto px-4 md:px-6 h-full flex flex-col md:flex-row items-center gap-6 md:gap-12">
          
          {/* Left: Text Content - Changes based on current Step */}
          <div className="w-full md:w-1/2 flex flex-col justify-center order-2 md:order-1 relative min-h-[12rem] md:h-64">
             {COPY.useCase.steps.map((step, index) => (
               <motion.div
                 key={index}
                 className="absolute top-0 left-0 w-full"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ 
                   opacity: currentStep === index ? 1 : 0,
                   x: currentStep === index ? 0 : -20,
                   pointerEvents: currentStep === index ? "auto" : "none"
                 }}
                 transition={{ duration: 0.5 }}
               >
                 <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-6 text-white whitespace-pre-line">
                   {step.title}
                 </h2>
                 <p className="text-base md:text-xl text-purple-200 leading-relaxed whitespace-pre-line">
                   {step.description}
                 </p>
               </motion.div>
             ))}
          </div>

          {/* Right: Visuals - Sticky and Animated */}
          <div className="w-full md:w-1/2 order-1 md:order-2 flex items-center justify-center">
            <UseCaseVisuals currentStep={currentStep} />
          </div>

        </div>

        {/* Vertical Scroll Progress Indicator (Left Side) - Simple Pill Style */}
        <div className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 hidden md:flex">
            {COPY.useCase.steps.map((_, idx) => (
                <motion.div 
                    key={idx}
                    className={`w-1 rounded-full bg-gray-600 transition-all duration-300`}
                    animate={{ 
                        height: idx === currentStep ? 32 : 8, // h-8 vs h-2
                        backgroundColor: idx === currentStep ? "#a855f7" : "#4b5563",
                        opacity: idx === currentStep ? 1 : 0.5
                    }}
                />
            ))}
        </div>
      </div>
    </section>
  );
}
