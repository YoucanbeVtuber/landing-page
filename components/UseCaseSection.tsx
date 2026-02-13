"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { COPY } from "@/content/copy";
import StepCard from "./StepCard";
import type { UseCaseStep } from "@/types/useCase";

const VISUAL_TYPES: UseCaseStep['visualType'][] = [
  'upload',
  'split',
  'select',
  'input',
  'result',
  'export',
];

export default function UseCaseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll through entire 400vh runway for smooth step transitions
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh] bg-white"
    >
      {/* Sticky container for step cards */}
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl w-full">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {COPY.useCase.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600">
              {COPY.useCase.sectionSubtitle}
            </p>
          </motion.div>

          {/* Step Cards */}
          <div className="relative">
            {COPY.useCase.steps.map((step, index) => {
              // Define progress range for each step
              const stepStart = index / COPY.useCase.steps.length;
              const stepEnd = (index + 1) / COPY.useCase.steps.length;

              return (
                <StepCard
                  key={index}
                  step={{
                    ...step,
                    visualType: VISUAL_TYPES[index],
                  }}
                  index={index}
                  scrollProgress={scrollYProgress}
                  progressRange={{ start: stepStart, end: stepEnd }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
