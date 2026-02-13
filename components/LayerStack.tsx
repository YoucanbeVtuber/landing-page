"use client";

import { MotionValue } from "framer-motion";
import { HERO_LAYER_ORDER } from "@/constants/heroLayers";
import Layer from "./Layer";

interface LayerStackProps {
  scrollProgress: MotionValue<number>;
}

export default function LayerStack({ scrollProgress }: LayerStackProps) {
  return (
    <div className="relative w-full h-full preserve-3d">
      {HERO_LAYER_ORDER.map((fileName, index) => (
        <Layer
          key={fileName}
          fileName={fileName}
          index={index}
          totalLayers={HERO_LAYER_ORDER.length}
          scrollProgress={scrollProgress}
        />
      ))}
    </div>
  );
}
