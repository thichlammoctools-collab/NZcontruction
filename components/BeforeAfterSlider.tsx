"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { SlidersHorizontal, MapPin } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  projectName?: string;
  location?: string;
  scope?: string;
  dragHint?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  projectName,
  location,
  scope,
  dragHint = "Drag slider left or right to compare",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* SLIDER CONTAINER */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-border-light select-none cursor-ew-resize"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER IMAGE (Background / Full) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={afterImage}
            alt="After Renovation"
            className="w-full h-full object-cover object-center pointer-events-none"
          />
          {/* AFTER BADGE */}
          <div className="absolute top-4 right-4 z-10 bg-primary/80 backdrop-blur-md text-white font-bold text-xs uppercase px-3 py-1.5 rounded-md border border-white/20 shadow-sm">
            {afterLabel}
          </div>
        </div>

        {/* BEFORE IMAGE (Clipped / Foreground) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Before Renovation"
            className="absolute top-0 left-0 h-full max-w-none object-cover object-center pointer-events-none"
            style={{
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%",
            }}
          />
          {/* BEFORE BADGE */}
          <div className="absolute top-4 left-4 z-10 bg-black/75 backdrop-blur-md text-white font-bold text-xs uppercase px-3 py-1.5 rounded-md border border-white/20 shadow-sm">
            {beforeLabel}
          </div>
        </div>

        {/* SLIDER DIVIDER LINE */}
        <div
          className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* DRAG HANDLE BUTTON */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-primary shadow-2xl flex items-center justify-center border-2 border-primary hover:scale-105 transition-transform">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>

      {/* FOOTER META DETAILS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          {projectName && <strong className="text-slate-800 text-sm">{projectName}</strong>}
          {location && (
            <span className="flex items-center gap-1 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-bronze" />
              {location}
            </span>
          )}
        </div>
        <span className="italic text-slate-400">{dragHint}</span>
      </div>
    </div>
  );
}
