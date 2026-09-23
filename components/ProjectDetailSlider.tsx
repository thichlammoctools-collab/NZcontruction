"use client";

import React, { useState, useRef, useCallback } from "react";

interface ProjectDetailSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  hintText: string;
}

export default function ProjectDetailSlider({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  hintText,
}: ProjectDetailSliderProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      updatePosition(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={boxRef}
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-surface-container-low select-none group touch-none border border-border-light cursor-ew-resize"
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
    >
      <div className="relative aspect-[16/9] lg:aspect-[21/10] w-full overflow-hidden">
        {/* AFTER IMAGE (Base) */}
        <img
          src={afterImage}
          alt="After renovation: Completed Transformation"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* BEFORE IMAGE (Clipped Overlay with CSS Clip-path) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{
            clipPath: `inset(0 ${100 - position}% 0 0)`,
          }}
        >
          <img
            src={beforeImage}
            alt="Before renovation: Original State"
            className="w-full h-full object-cover"
          />
        </div>

        {/* FLOATING BADGES */}
        <div className="absolute top-5 left-5 pointer-events-none z-10">
          <span className="px-3.5 py-1.5 bg-surface-container-lowest/90 backdrop-blur-md text-on-surface text-xs rounded uppercase tracking-wider font-semibold shadow-md flex items-center gap-1.5 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-outline"></span>
            {beforeLabel}
          </span>
        </div>

        <div className="absolute top-5 right-5 pointer-events-none z-10">
          <span className="px-3.5 py-1.5 bg-secondary/95 backdrop-blur-md text-on-secondary text-xs rounded uppercase tracking-wider font-semibold shadow-md flex items-center gap-1.5 border border-secondary-fixed">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
            {afterLabel}
          </span>
        </div>

        {/* DRAGGABLE DIVIDER LINE & CIRCULAR HANDLE */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-20 flex items-center justify-center"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-0.5 h-full bg-surface-container-lowest/90 shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
          <div className="absolute w-11 h-11 rounded-full bg-surface-container-lowest text-primary shadow-[0_4px_16px_rgba(0,0,0,0.3)] flex items-center justify-center border-2 border-secondary transition-transform group-hover:scale-110 active:scale-95 cursor-ew-resize">
            <svg className="w-5 h-5 fill-current text-primary" viewBox="0 0 24 24">
              <path d="M8 7l-5 5 5 5V7zm8 0v10l5-5-5-5z"></path>
            </svg>
          </div>
        </div>

        {/* RANGE INPUT FOR ACCESSIBILITY & SMOOTH TOUCH CONTROL */}
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label={hintText}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0 p-0"
        />
      </div>
    </div>
  );
}
