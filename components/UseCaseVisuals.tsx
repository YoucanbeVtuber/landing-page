"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

// Types
interface UseCaseVisualsProps {
  currentStep: number;
  stackMode?: boolean;
}

// Layer Data matching the files we found
const LAYERS = [
  { name: "Whole Face", file: "whole_face.png", id: "face", depth: 0, isFolder: true, isOpen: true, zOrder: 10 },
  { name: "Eyes", file: "eye_iris_l.png", id: "eyes", depth: 1, isFolder: true, isOpen: true, zOrder: 20 },
  { name: "Eye Detail", file: "eye_detail", id: "eye-detail", depth: 2, zOrder: 21 },
  { name: "Mouth", file: "mouth_lips.png", id: "mouth", depth: 1, zOrder: 20 },
  { name: "Hair", file: "whole_hair.png", id: "hair", depth: 0, zOrder: 30 },
  { name: "Body", file: "body.png", id: "body", depth: 0, zOrder: 0 },
];

const EYE_DETAILS = [
  "eyebrow_l.png", "eyebrow_r.png",
  "eyelash_l.png", "eyelash_r.png",
  "eye_white_l.png", "eye_white_r.png",
  "eye_iris_l.png", "eye_iris_r.png",
  "eye_pupil_l.png", "eye_pupil_r.png",
  "eye_highlight_l.png", "eye_highlight_r.png",
];


export default function UseCaseVisuals({
  currentStep,
  stackMode = false,
}: UseCaseVisualsProps) {
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [isSplitting, setIsSplitting] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEyeExpanded, setIsEyeExpanded] = useState(false);
  
  const targetText = "앞머리만 분리해줘";

  useEffect(() => {
    setActiveLayerIndex(0);
    setIsSplitting(true);
    setTypedText("");
    setShowConfirm(false);
    setIsConfirmed(false);
    setIsGenerating(false);
    setIsEyeExpanded(false);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 1) {
      setIsSplitting(true);
      const timer = setTimeout(() => {
        setIsSplitting(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleLayerSelect = (index: number) => {
    if (currentStep === 1 && !isSplitting) {
       setActiveLayerIndex(index);
       if (LAYERS[index].id === "eye-detail") {
           setIsEyeExpanded(false);
           setTimeout(() => setIsEyeExpanded(true), 100);
       } else {
           setIsEyeExpanded(false);
       }
    }
  };

  useEffect(() => {
    if (currentStep === 2) {
      const typeStartDelay = 2000;
      const typeTimeout = setTimeout(() => {
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
          if (currentIndex <= targetText.length) {
            setTypedText(targetText.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(typeInterval);
            setTimeout(() => setShowConfirm(true), 500);
          }
        }, 100);
      }, typeStartDelay);
      return () => { clearTimeout(typeTimeout); };
    }
  }, [currentStep]);

  const handleConfirm = () => {
      if (isGenerating || isConfirmed) return;
      setShowConfirm(false);
      setIsGenerating(true);
      setTimeout(() => {
          setIsGenerating(false);
          setIsConfirmed(true);
      }, 1500);
  };

  useEffect(() => {
    if (showConfirm) {
        const timer = setTimeout(() => { handleConfirm(); }, 1500);
        return () => clearTimeout(timer);
    }
  }, [showConfirm]);


  return (
    <div
      className={`relative w-full ${
        stackMode
          ? "h-[56vh] max-h-[560px]"
          : "h-[72vh] max-h-[700px]"
      } sm:h-auto sm:aspect-square max-w-[92vw] sm:max-w-lg mx-auto bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-200`}
    >
      
      {/* Background Grid (light transparency pattern) */}
      <div className="absolute inset-0 opacity-40" 
        style={{ 
          backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }} 
      />

      <AnimatePresence mode="wait">
        {/* --- Step 0: Upload --- */}
        {currentStep === 0 && (
          <motion.div 
            key="step0"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Drop Zone */}
                <motion.div 
                    className="relative w-44 h-44 sm:w-64 sm:h-64 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-white/80"
                >
                    <p className="text-gray-400 text-xs sm:text-base absolute mt-24 sm:mt-32">Drop Image Here</p>
                </motion.div>

                {/* Draggable File Icon */}
                <motion.div
                    className="absolute flex flex-col items-center gap-2 p-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10"
                    initial={{ x: 120, y: 120, scale: 1, opacity: 0 }}
                    animate={{ 
                        x: [120, 120, 0, 0],
                        y: [120, 120, 0, 0], 
                        scale: [1, 0.9, 0.9, 1],
                        opacity: [0, 1, 1, 1]
                    }}
                    transition={{ 
                        duration: 3,
                        times: [0, 0.2, 0.6, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 1
                    }}
                >
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <Image 
                            src="/hero/layers/base.png" 
                            alt="File Icon" 
                            fill 
                            className="object-cover"
                        />
                    </div>
                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">character.psd</span>
                </motion.div>

                {/* Cursor */}
                <motion.div
                    className="absolute z-20 pointer-events-none"
                    initial={{ x: 150, y: 150, opacity: 0 }}
                    animate={{ 
                        x: [150, 120, 0, 20],
                        y: [150, 120, 0, 20],
                        scale: [1, 0.8, 0.8, 1],
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{ 
                        duration: 3,
                        times: [0, 0.2, 0.6, 1],
                        ease: "circInOut",
                        repeat: Infinity,
                        repeatDelay: 1
                    }}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                        <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19169L17.4741 12.3673H5.65376Z" fill="white" stroke="#374151" strokeWidth="1.5"/>
                    </svg>
                </motion.div>
            </div>
          </motion.div>
        )}

        {/* --- Step 1 & 2: Split & Select/Edit --- */}
        {(currentStep === 1 || currentStep === 2) && (
            <motion.div 
              key="step-ui"
              className="absolute inset-0 flex flex-col sm:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
            {/* Progress Bar Overlay */}
            <AnimatePresence>
                {((currentStep === 1 && isSplitting) || (currentStep === 2 && isGenerating)) && (
                    <motion.div 
                        key="loading-overlay"
                        className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="text-gray-700 font-semibold mb-3 text-sm">처리 중...</div>
                        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left: Canvas Area */}
            <div className="w-full sm:w-2/3 h-[62%] sm:h-auto relative flex items-center justify-center p-2 sm:p-4 bg-gray-100">
              <div className="relative w-full h-full">

                {currentStep === 1 && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isSplitting ? 1 : 0.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src="/hero/layers/base.png"
                      alt="Background Reference"
                      fill
                      className={`object-contain ${isSplitting ? '' : 'grayscale'}`}
                    />
                  </motion.div>
                )}

                <motion.div
                  key={currentStep === 1 ? `${currentStep}-${activeLayerIndex}` : `step2-image`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                    {isSplitting && currentStep === 1 ? null : (
                    <>
                    {LAYERS[currentStep === 1 ? activeLayerIndex : LAYERS.findIndex(l => l.id === "hair")].id === "eye-detail" ? (
                        <div className="relative w-full h-full bg-gray-50 flex items-center justify-center overflow-hidden perspective-1000">
                            <motion.div 
                                className="relative w-full h-full preserve-3d"
                                initial={{ scale: 1.2, opacity: 0, rotateX: 0, rotateY: 0 }}
                                animate={{ 
                                    scale: isEyeExpanded ? 1.0 : 1.8, 
                                    opacity: 1,
                                    rotateX: isEyeExpanded ? 10 : 0,
                                    rotateY: isEyeExpanded ? -15 : 0,
                                    y: isEyeExpanded ? 20 : 0
                                }}
                                transition={{ duration: 0.8 }}
                                style={{ transformOrigin: "50% 35%" }}
                            >
                                {EYE_DETAILS.map((file, i) => {
                                    const zOffset = (i - EYE_DETAILS.length / 2) * 15;
                                    const yOffset = (i - EYE_DETAILS.length / 2) * 5;
                                    return (
                                        <motion.div
                                            key={file}
                                            className="absolute inset-0 flex items-center justify-center transform-style-3d"
                                            animate={{
                                                z: isEyeExpanded ? zOffset : 0,
                                                y: isEyeExpanded ? yOffset : 0,
                                            }}
                                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                                        >
                                            <div className="relative w-full h-full opacity-90">
                                                <Image
                                                    src={`/hero/layers/${file}`}
                                                    alt="Eye Detail"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                            <div className="absolute bottom-4 left-0 right-0 text-center text-purple-600 text-sm font-semibold">
                                Detailed Layer Split
                            </div>
                        </div>
                    ) : (
                        <div className="relative w-full h-full preserve-3d perspective-1000 flex items-center justify-center">
                            <motion.div 
                                className="relative w-full h-full transform-style-3d"
                                initial={{ rotateX: 0, rotateY: 0, scale: 0.8 }}
                                animate={{ 
                                    rotateX: 10, 
                                    rotateY: -30,
                                    scale: 0.9 
                                }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                {LAYERS.filter(l => l.id !== "eye-detail")
                                    .sort((a, b) => (a.zOrder || 0) - (b.zOrder || 0))
                                    .map((layer, index) => {
                                        const isActive = currentStep === 1 && activeLayerIndex === LAYERS.findIndex(l => l.id === layer.id);
                                        const isHair = layer.id === "hair";
                                        const isHairActive = currentStep === 2 && isHair;
                                        const isHighlighted = isActive || isHairActive;

                                        return (
                                            <motion.div
                                                key={layer.id}
                                                className="absolute inset-0 flex items-center justify-center transform-style-3d will-change-transform"
                                                initial={{ opacity: 0, z: 0 }}
                                                animate={{ 
                                                    opacity: isHighlighted ? 1 : 0.7,
                                                    z: index * 40 + (isHighlighted ? 30 : 0),
                                                    y: isHighlighted ? -5 : 0, 
                                                    x: isHighlighted ? 5 : 0,
                                                }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                                style={{ zIndex: isHighlighted ? 100 : index }}
                                            >
                                                <div className={`relative w-full h-full ${isHighlighted ? 'drop-shadow-2xl brightness-105' : 'brightness-95'}`}>
                                                    <Image
                                                        src={
                                                            layer.id === "hair" && currentStep === 2 && isConfirmed
                                                            ? "/hero/layers/hair_front.png"
                                                            : `/hero/layers/${layer.file}`
                                                        }
                                                        alt={layer.name}
                                                        fill
                                                        className="object-contain"
                                                        priority={index < 3}
                                                    />
                                                </div>
                                            </motion.div>
                                        );
                                })}

                                {currentStep === 2 && isConfirmed && (
                                    <motion.div
                                        className="absolute inset-0 z-0 opacity-10 transform-style-3d"
                                        animate={{ z: -100 }}
                                    >
                                        <Image
                                            src="/hero/layers/whole_hair.png"
                                            alt="Original Layer"
                                            fill
                                            className="object-contain grayscale"
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    )}
                    </>
                    )}
                </motion.div>
              </div>
              
              {/* Input Overlay for Step 2 */}
              {currentStep === 2 && !isGenerating && !isConfirmed && (
                <motion.div 
                  className="absolute bottom-3 sm:bottom-8 left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-64 bg-white p-2 sm:p-3 rounded-xl shadow-lg border border-gray-200 z-20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  <div className="text-xs text-gray-400 mb-1 font-medium">Edit Layer</div>
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1 bg-gray-50 border border-gray-200 px-2 py-1 text-xs sm:text-sm text-gray-800 h-8 flex items-center overflow-hidden rounded-lg">
                      {typedText}<span className="animate-pulse text-purple-500">|</span>
                    </div>
                    {showConfirm && (
                        <motion.button 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: isConfirmed ? 0.95 : 1, opacity: 1 }}
                            className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${isConfirmed ? 'bg-green-500' : 'bg-purple-600'} text-white`}
                            onClick={handleConfirm}
                        >
                            {isConfirmed ? 'Done' : 'Confirm'}
                        </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Layer List UI */}
            <div className="w-full sm:w-1/3 h-[38%] sm:h-auto bg-white border-t sm:border-t-0 sm:border-l border-gray-200 p-1.5 sm:p-2 flex flex-col gap-1 overflow-y-visible sm:overflow-y-auto">
              <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Layers</div>
              {LAYERS.map((layer, idx) => (
                <motion.div
                  key={layer.id}
                  onClick={() => handleLayerSelect(idx)}
                  className={`p-1.5 sm:p-2 rounded-lg text-[11px] sm:text-xs leading-tight flex items-center gap-1.5 sm:gap-2 transition-all duration-200 cursor-pointer ${
                    (currentStep === 1 && idx === activeLayerIndex) || (currentStep === 2 && layer.id === "hair") 
                      ? "bg-purple-50 text-purple-700 font-bold ring-1 ring-purple-300" 
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                  style={{ marginLeft: `${(layer.depth || 0) * 6}px` }}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                      {(layer.depth === 0 && layer.isFolder) ? (
                          <span className="text-[10px] text-gray-400">▼</span>
                      ) : layer.depth > 0 ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                      ) : (
                          <div className="w-3 h-3 border border-gray-300 bg-gray-100 rounded-sm" />
                      )}
                  </div>
                  <span>{layer.name}</span>
                </motion.div>
              ))}
            </div>

            {/* Cursor for Step 2 */}
            {currentStep === 2 && (
              <motion.div
                className="absolute z-50 pointer-events-none hidden sm:block"
                initial={{ x: 300, y: 300, opacity: 0 }}
                animate={{ 
                    x: [300, 390, 390, 400],
                    y: [300, 160, 160, 400],
                    opacity: [0, 1, 1, 0],
                    scale: [1, 1, 0.8, 1]
                }}
                transition={{ 
                    duration: 2.0,
                    times: [0, 0.4, 0.5, 1],
                    ease: "easeInOut"
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                  <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19169L17.4741 12.3673H5.65376Z" fill="white" stroke="#374151" strokeWidth="1.5"/>
                </svg>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* --- Step 3: Export --- */}
        {currentStep === 3 && (
          <motion.div 
            key="step3"
            className="absolute inset-0 flex items-center justify-center bg-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
             {LAYERS.filter(l => l.id !== "eye-detail").map((layer, index) => {
                 const angle = (index / 5) * Math.PI * 2;
                 const radius = 120;
                 const startX = Math.cos(angle) * radius;
                 const startY = Math.sin(angle) * radius;

                 return (
                     <motion.div
                        key={layer.id}
                        className="absolute w-16 h-16 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md z-10"
                        initial={{ x: startX, y: startY, opacity: 0, scale: 0 }}
                        animate={{ 
                            x: [startX, startX, 0], 
                            y: [startY, startY, 10],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0.2] 
                        }}
                        transition={{ 
                            duration: 2,
                            times: [0, 0.2, 1],
                            ease: "easeInOut",
                            delay: index * 0.1
                        }}
                     >
                        <Image
                            src={`/hero/layers/${layer.file}`}
                            alt={layer.name}
                            fill
                            className="object-cover"
                        />
                     </motion.div>
                 );
             })}

             <motion.div
                className="absolute flex flex-col items-center z-20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
             >
                <div className="relative">
                    <motion.div
                        className="text-8xl"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ delay: 2.2, duration: 0.3 }}
                    >
                        📁
                    </motion.div>
                    <motion.div
                        className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2.5, type: "spring" }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17L4 12" />
                        </svg>
                    </motion.div>
                </div>
                
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.3 }}
                    className="text-gray-800 font-bold mt-4 text-center"
                >
                    <p className="text-lg">All Layers Ready</p>
                    <p className="text-sm text-gray-400">Character.psd</p>
                </motion.div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
