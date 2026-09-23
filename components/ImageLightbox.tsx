"use client";

import React, { useState, useEffect, useCallback } from "react";

interface GalleryImageItem {
  title?: { en: string; vi: string } | string;
  desc?: { en: string; vi: string } | string;
  image: string;
}

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImageItem[];
  initialIndex?: number;
  locale: "en" | "vi";
}

export default function ImageLightbox({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  locale,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const isVi = locale === "vi";

  // Sync initialIndex when changed
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
    }
  }, [isOpen, initialIndex]);

  // Navigate functions
  const handlePrev = useCallback(() => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      // Swiped left -> next
      handleNext();
    } else if (diff < -50) {
      // Swiped right -> prev
      handlePrev();
    }
    setTouchStart(null);
  };

  if (!isOpen || images.length === 0) return null;

  const currentItem = images[currentIndex];
  const title =
    typeof currentItem?.title === "object"
      ? isVi
        ? currentItem.title.vi
        : currentItem.title.en
      : currentItem?.title || "";
  const desc =
    typeof currentItem?.desc === "object"
      ? isVi
        ? currentItem.desc.vi
        : currentItem.desc.en
      : currentItem?.desc || "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || "Image Lightbox"}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md select-none animate-fadeIn"
      onClick={onClose}
    >
      {/* TOP BAR */}
      <div
        className="w-full flex items-center justify-between px-4 sm:px-8 py-4 z-20 text-white bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider text-slate-200 border border-white/10">
            {isVi ? `Ảnh ${currentIndex + 1} / ${images.length}` : `${currentIndex + 1} of ${images.length}`}
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400">
            {isVi ? "Dùng phím mũi tên ← → để chuyển ảnh" : "Use ← → arrow keys to navigate"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            title={isZoomed ? (isVi ? "Thu nhỏ (100%)" : "Fit to screen") : (isVi ? "Phóng to chi tiết" : "Zoom in")}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] block">
              {isZoomed ? "zoom_out" : "zoom_in"}
            </span>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            title={isVi ? "Đóng (Phím Esc)" : "Close (Esc)"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all text-xs font-medium border border-white/20"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span className="hidden sm:inline">ESC</span>
          </button>
        </div>
      </div>

      {/* MAIN IMAGE DISPLAY AREA */}
      <div
        className="relative flex-1 flex items-center justify-center px-2 sm:px-16 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
            className="absolute left-2 sm:left-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/50 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/10 active:scale-95"
          >
            <span className="material-symbols-outlined text-[28px]">chevron_left</span>
          </button>
        )}

        {/* Current Image */}
        <div
          className={`relative max-w-full max-h-[72vh] flex items-center justify-center transition-transform duration-300 ease-out cursor-pointer ${
            isZoomed ? "scale-125 sm:scale-150 cursor-zoom-out overflow-auto" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed((prev) => !prev)}
        >
          <img
            src={currentItem.image}
            alt={title}
            className="max-h-[70vh] sm:max-h-[74vh] max-w-[94vw] sm:max-w-[85vw] object-contain rounded-lg shadow-2xl transition-opacity duration-200"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
            className="absolute right-2 sm:right-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/50 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/10 active:scale-95"
          >
            <span className="material-symbols-outlined text-[28px]">chevron_right</span>
          </button>
        )}
      </div>

      {/* BOTTOM BAR: CAPTION & THUMBNAILS */}
      <div
        className="w-full px-4 sm:px-8 py-4 z-20 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Caption */}
        {(title || desc) && (
          <div className="text-center max-w-2xl px-4">
            {title && (
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {title}
              </h4>
            )}
            {desc && (
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed line-clamp-2">
                {desc}
              </p>
            )}
          </div>
        )}

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 no-scrollbar">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIsZoomed(false);
                  setCurrentIndex(i);
                }}
                className={`relative shrink-0 w-14 h-10 sm:w-16 sm:h-12 rounded-md overflow-hidden transition-all border-2 ${
                  i === currentIndex
                    ? "border-secondary ring-2 ring-secondary/50 scale-105 opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img
                  src={img.image}
                  alt={typeof img.title === "object" ? (isVi ? img.title.vi : img.title.en) : img.title || ""}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
