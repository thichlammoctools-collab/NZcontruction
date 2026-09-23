"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  projectName?: string;
  location?: string;
  duration?: string;
  scope?: string;
  dragHint?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "BEFORE : 1980s Original Layout",
  afterLabel = "AFTER : NS Building Transformation",
  projectName = "Grey Lynn Bungalow",
  location,
  duration = "9 Weeks",
  scope,
  dragHint = "Drag the handle to compare structural before & after",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(896);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("touchmove", handleGlobalTouchMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [isDragging, handleMove]);

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* SLIDER CONTAINER */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] rounded-xl overflow-hidden shadow-2xl select-none touch-none bg-surface-dim cursor-ew-resize border border-border-light"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* "AFTER" BASE IMAGE */}
        <img
          src={afterImage}
          alt="After NS Building transformation"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
        <div className="absolute top-4 right-4 bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-bold z-10 shadow-md">
          {afterLabel}
        </div>

        {/* "BEFORE" CLIPPED LAYER */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden z-10"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Before renovation"
            className="absolute top-0 left-0 h-full max-w-none object-cover pointer-events-none"
            style={{ width: `${containerWidth}px` }}
          />
          <div className="absolute top-4 left-4 bg-inverse-surface/90 text-inverse-on-surface px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
            {beforeLabel}
          </div>
        </div>

        {/* DRAGGER BAR */}
        <div
          className="absolute inset-y-0 w-1 bg-white z-20 shadow-[0_0_12px_rgba(0,0,0,0.6)] flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary shadow-xl flex items-center justify-center border-2 border-white">
            <span className="material-symbols-outlined text-[18px]">code</span>
          </div>
        </div>
      </div>

      {/* SLIDER HINT & META */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-border-light">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-secondary text-[22px]">swap_horiz</span>
          <span className="text-xs sm:text-sm text-on-surface-variant font-medium">
            {dragHint}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-on-surface">
          <span>
            Project: <strong className="text-primary">{projectName}</strong>
          </span>
          {location && (
            <>
              <span className="text-outline-variant">•</span>
              <span className="text-on-surface-variant font-medium">{location}</span>
            </>
          )}
          {duration && (
            <>
              <span className="text-outline-variant">•</span>
              <span>
                Duration: <strong className="text-primary">{duration}</strong>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
