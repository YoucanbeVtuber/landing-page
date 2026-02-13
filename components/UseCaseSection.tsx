"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import { COPY } from "@/content/copy";
import UseCaseVisuals from "./UseCaseVisuals";

export default function UseCaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Track scroll through entire 500vh runway (100vh per step approx)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Determine current step based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const stepCount = COPY.useCase.steps.length;
    const stepIndex = Math.floor(latest * stepCount);
    // Clamp between 0 and stepCount - 1
    const clampedStep = Math.max(0, Math.min(stepIndex, stepCount - 1));
    setCurrentStep(clampedStep);
  });

  return (
    <section
      ref={sectionRef}
      className="relative h-[500vh] bg-[#0a0a0f]"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-start overflow-hidden pt-32">
        <div className="container mx-auto px-6 h-full flex flex-col md:flex-row items-center gap-12">
          
          {/* Left: Text Content - Changes based on current Step */}
          <div className="w-full md:w-1/2 flex flex-col justify-center order-2 md:order-1 relative h-64">
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
                 <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                   {step.title}
                 </h2>
                 <p className="text-xl text-purple-200 leading-relaxed whitespace-pre-line">
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
