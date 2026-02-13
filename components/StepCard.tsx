"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import type { UseCaseStep, ProgressRange } from "@/types/useCase";

interface StepCardProps {
  step: UseCaseStep;
  index: number;
  scrollProgress: MotionValue<number>;
  progressRange: ProgressRange;
}

export default function StepCard({ step, index, scrollProgress, progressRange }: StepCardProps) {
  const { start, end } = progressRange;

  // Calculate safe offsets that won't create non-monotonic ranges
  const fadeInStart = Math.max(0, start - 0.05);
  const fadeOutStart = Math.min(1, end - 0.05);
  const fadeOutEnd = Math.min(1, end);

  // Opacity: fade in at step start, fade out at step end
  const opacity = useTransform(
    scrollProgress,
    [fadeInStart, start, fadeOutStart, fadeOutEnd],
    [0, 1, 1, 0]
  );

  // Vertical position: slide up on entrance
  const y = useTransform(
    scrollProgress,
    [fadeInStart, start],
    [40, 0]
  );

  // Scale: slight zoom effect
  const scale = useTransform(
    scrollProgress,
    [fadeInStart, start, fadeOutStart, fadeOutEnd],
    [0.95, 1, 1, 0.95]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity, y, scale }}
    >
      <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
        {/* Step Number */}
        <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
          Step {index + 1}
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          {step.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-lg mb-8">
          {step.description}
        </p>

        {/* Visual Mock UI */}
        <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-2xl p-6 min-h-[200px] flex items-center justify-center border border-gray-100">
          <MockVisual type={step.visualType} scrollProgress={scrollProgress} progressRange={progressRange} />
        </div>
      </div>
    </motion.div>
  );
}

// Mock visual components for each step type
function MockVisual({ 
  type, 
  scrollProgress, 
  progressRange 
}: { 
  type: UseCaseStep['visualType'];
  scrollProgress: MotionValue<number>;
  progressRange: ProgressRange;
}) {
  const midpoint = (progressRange.start + progressRange.end) / 2;

  // "Click" animation trigger
  const clickScale = useTransform(
    scrollProgress,
    [midpoint - 0.02, midpoint, midpoint + 0.02],
    [1, 0.95, 1]
  );

  switch (type) {
    case 'upload':
      return (
        <div className="text-center">
          <motion.div 
            className="w-32 h-32 border-4 border-dashed border-purple-300 rounded-2xl flex items-center justify-center mb-4 mx-auto"
            style={{ scale: clickScale }}
          >
            <span className="text-4xl">📁</span>
          </motion.div>
          <p className="text-sm text-gray-500">파일을 드래그하거나 클릭</p>
        </div>
      );

    case 'split':
      return (
        <div className="grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="aspect-square bg-purple-200/50 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      );

    case 'select':
      return (
        <div className="grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`aspect-square rounded-lg ${
                i === 2 ? 'bg-purple-400 ring-4 ring-purple-500' : 'bg-purple-200/50'
              }`}
              style={i === 2 ? { scale: clickScale } : {}}
            />
          ))}
        </div>
      );

    case 'input':
      return (
        <div className="w-full max-w-md">
          <motion.div 
            className="bg-white border-2 border-purple-300 rounded-xl p-4 text-gray-700"
            style={{ scale: clickScale }}
          >
            앞머리만 분리해줘
          </motion.div>
        </div>
      );

    case 'result':
      return (
        <div className="grid grid-cols-3 gap-3">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className={`aspect-square rounded-lg ${
                i === 6 ? 'bg-green-400' : 'bg-purple-200/50'
              }`}
              initial={{ opacity: i === 6 ? 0 : 1, scale: i === 6 ? 0.5 : 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i === 6 ? 0.3 : 0 }}
            />
          ))}
        </div>
      );

    case 'export':
      return (
        <motion.div 
          className="text-center"
          style={{ scale: clickScale }}
        >
          <div className="w-24 h-24 bg-gradient-purple rounded-2xl flex items-center justify-center mb-4 mx-auto text-white text-4xl">
            ⬇️
          </div>
          <p className="text-purple-700 font-semibold">character.psd</p>
        </motion.div>
      );

    default:
      return null;
  }
}
