"use client";

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { COPY } from "@/content/copy";
import LayerStack from "./LayerStack";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll progress within this section
  // Track scroll through entire 300vh runway
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // No opacity animations - layers always visible

  return (
    <section
      ref={sectionRef}
      className="relative h-[300vh] bg-gradient-to-b from-white to-purple-50/30"
    >
      {/* Sticky container that stays fixed while scrolling through 300vh runway */}
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center px-6">
        {/* Copy */}
        <motion.div
          className="text-center mb-12 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-hero-mobile md:text-hero font-bold mb-6 whitespace-pre-line">
            {COPY.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 whitespace-pre-line max-w-2xl mx-auto">
            {COPY.hero.subtitle}
          </p>
        </motion.div>

        {/* Image Container with 3D transforms */}
        <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl perspective-1000">
          {/* Layer Stack - starts visible, no fade effect */}
          <div className="relative w-full aspect-square">
            <LayerStack scrollProgress={scrollYProgress} />
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          ↓ 스크롤하여 레이어 분해 보기
        </motion.div>
      </div>
    </section>
  );
}
