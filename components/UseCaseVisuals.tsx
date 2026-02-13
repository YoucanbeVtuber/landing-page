"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

// Types
interface UseCaseVisualsProps {
  currentStep: number;
}

// Layer Data matching the files we found
const LAYERS = [
  // Folder: Whole Face
  { name: "Whole Face", file: "whole_face.png", id: "face", depth: 0, isFolder: true, isOpen: true, zOrder: 10 },
  { name: "Eyes", file: "eye_iris_l.png", id: "eyes", depth: 1, isFolder: true, isOpen: true, zOrder: 20 },
  { name: "Eye Detail", file: "eye_detail", id: "eye-detail", depth: 2, zOrder: 21 },
  { name: "Mouth", file: "mouth_lips.png", id: "mouth", depth: 1, zOrder: 20 },
  // Root items
  { name: "Hair", file: "whole_hair.png", id: "hair", depth: 0, zOrder: 30 },
  { name: "Body", file: "body.png", id: "body", depth: 0, zOrder: 0 },
];

const EYE_DETAILS = [
  // eyebrows / lashes
  "eyebrow_l.png", "eyebrow_r.png",
  "eyelash_l.png", "eyelash_r.png",

  // eyes: white → iris → pupil → highlight
  "eye_white_l.png", "eye_white_r.png",
  "eye_iris_l.png", "eye_iris_r.png",
  "eye_pupil_l.png", "eye_pupil_r.png",
  "eye_highlight_l.png", "eye_highlight_r.png",
];


export default function UseCaseVisuals({ currentStep }: UseCaseVisualsProps) {
  // --- Split Step State ---
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [isSplitting, setIsSplitting] = useState(true); // Loading state for Split

  // --- Input Step State ---
  const [typedText, setTypedText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // Loading state for Edit
  const [isEyeExpanded, setIsEyeExpanded] = useState(false); // State for Eye Detail expansion
  
  const targetText = "앞머리만 분리해줘";

  // Reset states when step changes
  useEffect(() => {
    setActiveLayerIndex(0);
    setIsSplitting(true);
    setTypedText("");
    setShowConfirm(false);
    setIsConfirmed(false);
    setIsConfirmed(false);
    setIsGenerating(false);
    setIsEyeExpanded(false);
  }, [currentStep]);

  // --- Split Step Animation Sequence ---
  useEffect(() => {
    if (currentStep === 1) {
      // 1. Start Progress Bar
      setIsSplitting(true);
      const timer = setTimeout(() => {
        setIsSplitting(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);



  // Click on Sidebar Layer
  const handleLayerSelect = (index: number) => {
    if (currentStep === 1 && !isSplitting) {
       setActiveLayerIndex(index);
       
       // If selecting Eye Detail, trigger expansion automatically
       if (LAYERS[index].id === "eye-detail") {
           setIsEyeExpanded(false); // Reset first for re-trigger
           setTimeout(() => setIsEyeExpanded(true), 100);
       } else {
           setIsEyeExpanded(false);
       }
    }
  };



  // --- Combined Select & Input Step Animation Sequence ---
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

      return () => {
        clearTimeout(typeTimeout);
      };
    }
  }, [currentStep]);

  // Handle Confirm -> Generate Sequence
  const handleConfirm = () => {
      // Prevent double trigger if already processing
      if (isGenerating || isConfirmed) return;

      // 1. Hide Button, Show Progress
      setShowConfirm(false);
      setIsGenerating(true);
      
      // 2. Wait for Progress (1.5s)
      setTimeout(() => {
          setIsGenerating(false);
          setIsConfirmed(true);
      }, 1500);
  };

  // Auto-trigger Confirm after delay
  useEffect(() => {
    if (showConfirm) {
        const timer = setTimeout(() => {
            handleConfirm();
        }, 1500); // Wait 1.5s before auto-clicking
        return () => clearTimeout(timer);
    }
  }, [showConfirm]);


  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
      
      {/* Background Grid (Photoshop-like transparency) */}
      <div className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: 'radial-gradient(#4a4a4a 1px, transparent 1px)', 
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
                    className="relative w-64 h-64 border-4 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-gray-800/50"
                >
                    <p className="text-gray-400 absolute mt-32">Drop Image Here</p>
                </motion.div>

                {/* Draggable File Icon */}
                <motion.div
                    className="absolute flex flex-col items-center gap-2 p-2 bg-gray-800 rounded-lg shadow-xl border border-gray-600 z-10"
                    initial={{ x: 120, y: 120, scale: 1, opacity: 0 }}
                    animate={{ 
                        x: [120, 120, 0, 0], // Start -> Stay -> Drag to Center -> Stay
                        y: [120, 120, 0, 0], 
                        scale: [1, 0.9, 0.9, 1], // Normal -> Grab -> Dragging -> Drop
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
                    {/* Inner image container */}
                    <div className="relative w-20 h-20 bg-gray-900 rounded overflow-hidden">
                        <Image 
                            src="/hero/layers/base.png" 
                            alt="File Icon" 
                            fill 
                            className="object-cover"
                        />
                    </div>
                    {/* File Name */}
                    <span className="text-xs text-gray-300 font-mono bg-black/50 px-1 rounded">character.psd</span>
                </motion.div>

                {/* Cursor */}
                <motion.div
                    className="absolute z-20 pointer-events-none"
                    initial={{ x: 150, y: 150, opacity: 0 }}
                    animate={{ 
                        x: [150, 120, 0, 20], // Start -> To File -> To Center -> Move Away
                        y: [150, 120, 0, 20],
                        scale: [1, 0.8, 0.8, 1], // Click effect
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
                        <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19169L17.4741 12.3673H5.65376Z" fill="white" stroke="black" strokeWidth="1.5"/>
                    </svg>
                </motion.div>
            </div>
          </motion.div>
        )}

        {/* --- Step 1 & 2: Split & Select/Edit --- */}
        {(currentStep === 1 || currentStep === 2) && (
          <motion.div 
            key="step-ui"
            className="absolute inset-0 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left: Canvas Area */}
            <div className="w-2/3 relative flex items-center justify-center p-4 bg-[#1e1e1e]">
              <div className="relative w-full h-full"> 
                
                {/* Progress Bar Overlay (for processing/generating) */}
                <AnimatePresence>
                    {((currentStep === 1 && isSplitting) || (currentStep === 2 && isGenerating)) && (
                        <motion.div 
                            key="loading-overlay"
                            className="absolute inset-0 z-30 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="text-white font-semibold mb-2">
                                {currentStep === 1 ? "Processing..." : "Generating..."}
                            </div>
                            <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
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

                {/* Background Image for Step 1 (Split) - Show Base Image During Processing */}
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

                {/* Image Display Logic */}
                <motion.div
                  key={currentStep === 1 ? `${currentStep}-${activeLayerIndex}` : `step2-image`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                  // onClick={handleLayerClick} // Disabled image click
                >
                    {/* Hide active layer during splitting (Show only base) */}
                    {isSplitting && currentStep === 1 ? null : (
                    <>
                    {/* Special Case: Eye Detail View */}
                    {LAYERS[currentStep === 1 ? activeLayerIndex : LAYERS.findIndex(l => l.id === "hair")].id === "eye-detail" ? (
                        <div className="relative w-full h-full bg-gray-900 flex items-center justify-center overflow-hidden perspective-1000">
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
                                style={{ transformOrigin: "50% 35%" }} // Focus slighty higher for eyes
                            >
                                {EYE_DETAILS.map((file, i) => {
                                    // Calculate 3D positions for expansion
                                    const zOffset = (i - EYE_DETAILS.length / 2) * 15; // Reduced from 40
                                    const yOffset = (i - EYE_DETAILS.length / 2) * 5;  // Keep slight vertical stack (Slight vertical stack)
                                    
                                    // Determine if active layer (just use index for now, or highlight center?)
                                    // Make all layers more opaque/clear as requested
                                    
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
                            <div className="absolute bottom-4 left-0 right-0 text-center text-purple-300 text-sm font-bold">
                                Detailed Layer Split
                            </div>
                        </div>
                    ) : (
                        <div className="relative w-full h-full preserve-3d perspective-1000 flex items-center justify-center">
                            {/* Render Main Layers in 3D Stack (Sorted by Z-Order) */}
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
                                        const isHairActive = currentStep === 2 && isHair; // Special case for Step 2 editing hair

                                        // Determine if this layer should be highlighted
                                        const isHighlighted = isActive || isHairActive;

                                        return (
                                            <motion.div
                                                key={layer.id}
                                                className="absolute inset-0 flex items-center justify-center transform-style-3d will-change-transform"
                                                initial={{ opacity: 0, z: 0 }}
                                                animate={{ 
                                                    opacity: isHighlighted ? 1 : 0.7, // Increased from 0.4
                                                    z: index * 40 + (isHighlighted ? 30 : 0), // Base Z separation + Active Pop
                                                    y: isHighlighted ? -5 : 0, 
                                                    x: isHighlighted ? 5 : 0, // Reduced shift
                                                }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                                style={{ zIndex: isHighlighted ? 100 : index }}
                                            >
                                                <div className={`relative w-full h-full ${isHighlighted ? 'drop-shadow-2xl brightness-110' : 'brightness-75'}`}>
                                                    <Image
                                                        src={
                                                            // Allow Step 2 to swap Hair for edited version
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

                                {/* Ghost Image (Original Hair) if Confirmed in Step 2 */}
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
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-600 z-20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }} // Wait for cursor selection
                >
                  <div className="text-xs text-gray-400 mb-1">Edit Layer</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-900 border border-gray-700 px-2 py-1 text-sm text-white h-8 flex items-center">
                      {typedText}<span className="animate-pulse">|</span>
                    </div>
                    {showConfirm && (
                        <motion.button 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: isConfirmed ? 0.95 : 1, opacity: 1 }}
                            className={`px-3 py-1 text-xs rounded transition-colors ${isConfirmed ? 'bg-green-600' : 'bg-purple-600'} text-white`}
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
            <div className="w-1/3 bg-[#252525] border-l border-gray-700 p-2 flex flex-col gap-1 overflow-y-auto">
              <div className="text-xs text-gray-400 mb-2 font-semibold">Layers</div>
              {LAYERS.map((layer, idx) => (
                <motion.div
                  key={layer.id}
                  onClick={() => handleLayerSelect(idx)}
                  className={`p-2 rounded text-xs flex items-center gap-2 transition-colors duration-300 cursor-pointer hover:bg-gray-600 ${
                    (currentStep === 1 && idx === activeLayerIndex) || (currentStep === 2 && layer.id === "hair") 
                      ? "bg-purple-600 text-white font-bold ring-1 ring-purple-400" 
                      : "bg-gray-700 text-gray-300"
                  }`}
                  style={{ marginLeft: `${(layer.depth || 0) * 12}px` }}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                      {(layer.depth === 0 && layer.isFolder) ? (
                          <span className="text-[10px]">▼</span>
                      ) : layer.depth > 0 ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                      ) : (
                          <div className="w-3 h-3 border border-gray-500 bg-white/10" />
                      )}
                  </div>
                  <span>{layer.name}</span>
                </motion.div>
              ))}
            </div>

            {/* Cursor for Step 2 (Select Animation) */}
            {currentStep === 2 && (
              <motion.div
                className="absolute z-50 pointer-events-none"
                initial={{ x: 300, y: 300, opacity: 0 }} // Start outside
                animate={{ 
                    x: [300, 390, 390, 400],
                    y: [300, 160, 160, 400], // Layer 3 y-pos approx
                    opacity: [0, 1, 1, 0],
                    scale: [1, 1, 0.8, 1] // Click effect at 160
                }}
                transition={{ 
                    duration: 2.0,
                    times: [0, 0.4, 0.5, 1],
                    ease: "easeInOut"
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                  <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19169L17.4741 12.3673H5.65376Z" fill="white" stroke="black" strokeWidth="1.5"/>
                </svg>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* --- Step 3: Export --- */}
        {currentStep === 3 && (
          <motion.div 
            key="step3"
            className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
             {/* Animating Layers into Folder */}
             {LAYERS.filter(l => l.id !== "eye-detail").map((layer, index) => {
                 // Calculate random start positions around center
                 const angle = (index / 5) * Math.PI * 2;
                 const radius = 120;
                 const startX = Math.cos(angle) * radius;
                 const startY = Math.sin(angle) * radius;

                 return (
                     <motion.div
                        key={layer.id}
                        className="absolute w-16 h-16 bg-gray-800 rounded border border-gray-600 overflow-hidden shadow-lg z-10"
                        initial={{ x: startX, y: startY, opacity: 0, scale: 0 }}
                        animate={{ 
                            x: [startX, startX, 0], 
                            y: [startY, startY, 10], // Move into folder center
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0.2] 
                        }}
                        transition={{ 
                            duration: 2,
                            times: [0, 0.2, 1],
                            ease: "easeInOut",
                            delay: index * 0.1 // Stagger start
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

             {/* Folder Icon - Opens then Closes/Fills */}
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
                    {/* Success Checkmark */}
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
                    className="text-white font-bold mt-4 text-center"
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
