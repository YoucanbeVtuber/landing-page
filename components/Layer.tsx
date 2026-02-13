"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import Image from "next/image";

interface LayerProps {
  fileName: string;
  index: number;
  totalLayers: number;
  scrollProgress: MotionValue<number>;
}

export default function Layer({ fileName, index, totalLayers, scrollProgress }: LayerProps) {
  // Increased depth for more dramatic separation (was 15px, now 400px per layer)
  const baseDepth = (index - totalLayers / 2) * 400; // z-axis depth in pixels
  
  // Wider horizontal offset for better depth perception
  const baseX = (index - totalLayers / 2) * 20; // horizontal offset
  
  // Vertical offset for additional dimension
  const baseY = (index - totalLayers / 2) * 15; // vertical offset

  // Y-axis rotation - creates "cards fanning out" effect (left/right)
  const baseRotateY = (index - totalLayers / 2) * 5; // degrees

  // X-axis rotation - creates "viewing from above/below" effect (up/down tilt)
  const baseRotateX = 0; //(index - totalLayers / 2) * 8; // degrees

  // Z-axis rotation - creates "twist" effect as layers separate
  const baseRotateZ = 0; //(index - totalLayers / 2) * 5; // degrees

  // Animate depth separation based on scroll (0.2 to 1.0 range for faster response)
  const translateZ = useTransform(
    scrollProgress,
    [0.2, 1.0],
    [0, baseDepth]
  );

  const translateX = useTransform(
    scrollProgress,
    [0.2, 1.0],
    [0, baseX]
  );

  const translateY = useTransform(
    scrollProgress,
    [0.2, 1.0],
    [0, baseY]
  );

  // Animate Y-axis rotation (left/right fanning effect)
  const rotateY = useTransform(
    scrollProgress,
    [0.2, 1.0],
    [0, baseRotateY]
  );

  // Animate X-axis rotation (viewing angle effect)
  const rotateX = useTransform(
    scrollProgress,
    [0.2, 1.0],
    [0, baseRotateX]
  );

  // Animate Z-axis rotation (twist effect)
  const rotateZ = useTransform(
    scrollProgress,
    [0.2, 1.0],
    [0, baseRotateZ]
  );

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{
        translateZ,
        translateX,
        translateY,
        rotateY,
        rotateX,
        rotateZ,
      }}
    >
      <div 
        className={`relative w-full h-full ${
          fileName.includes('mouth') || fileName.includes('lips') 
            ? '' 
            : 'drop-shadow-md'
        }`}
      >
        <Image
          src={`/hero/layers/${fileName}`}
          alt={fileName.replace('.png', '')}
          fill
          className="object-contain"
          loading="lazy"
        />
      </div>
    </motion.div>
  );
}
