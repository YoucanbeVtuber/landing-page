"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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

  // Move layers up to overlap text as user scrolls
  const translateY = useTransform(scrollYProgress, [0, 0.5], [0, -350]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[500vh] bg-gradient-to-b from-[#0a0a0f] via-[#1a1a3e] to-[#0f0f28]"
    >
      {/* Sticky container that stays fixed while scrolling through 300vh runway */}
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-start px-6 pt-32">
        {/* Copy */}
        <motion.div
          className="text-center mb-12 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-hero-mobile md:text-hero font-bold mb-6 whitespace-pre-line text-white">
            {COPY.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-purple-200 whitespace-pre-line max-w-2xl mx-auto">
            {COPY.hero.subtitle}
          </p>
        </motion.div>

        {/* Image Container with 3D transforms */}
        <motion.div 
          className="relative w-full max-w-md md:max-w-lg lg:max-w-xl perspective-1000 z-20"
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
    </section>
  );
}
