"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  Upload,
  Link as LinkIcon,
  X,
  Check,
  Loader2,
  ExternalLink,
  Image as ImageIcon,
  AlertCircle,
  Copy,
} from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  aspectRatio?: "wide" | "video" | "square" | "portrait" | "auto";
  helperText?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  placeholder = "https://... hoặc tải ảnh từ máy tính",
  required = false,
  aspectRatio = "wide",
  helperText,
}: ImageUploadProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Aspect ratio helper classes
  const aspectClasses = {
    wide: "aspect-[21/9] max-h-48",
    video: "aspect-[16/9] max-h-48",
    square: "aspect-square max-h-48",
    portrait: "aspect-[3/4] max-h-56",
    auto: "max-h-52",
  }[aspectRatio];

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Basic client validation
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      setErrorMessage("Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WebP, GIF, AVIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(
        `File quá lớn (${(file.size / (1024 * 1024)).toFixed(1)}MB). Giới hạn tối đa là 10MB.`
      );
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Không thể tải ảnh lên máy chủ.");
      }

      // Successful upload
      onChange(data.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMessage(err.message || "Đã xảy ra lỗi khi tải ảnh lên.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleCopyLink = () => {
    if (!value) return;
    const fullUrl = value.startsWith("http")
      ? value
      : `${typeof window !== "undefined" ? window.location.origin : ""}${value}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      {/* Label & Mode Switcher */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {label && (
          <label className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>{label}</span>
            {required && <span className="text-red-400">*</span>}
          </label>
        )}

        <div className="flex items-center p-0.5 bg-slate-900 border border-slate-700/80 rounded-lg text-[11px] font-medium ml-auto">
          <button
            type="button"
            onClick={() => {
              setMode("upload");
              setErrorMessage(null);
            }}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              mode === "upload"
                ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Tải từ máy</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("url");
              setErrorMessage(null);
            }}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              mode === "url"
                ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Dán link URL</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Current Image Preview Card if image exists */}
      {value ? (
        <div className="relative rounded-xl border border-slate-700 bg-slate-900/90 overflow-hidden shadow-lg p-2.5 group">
          <div
            className={`relative w-full ${aspectClasses} rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center`}
          >
            <img
              src={value}
              alt="Hình ảnh đã chọn"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
              <button
                type="button"
                onClick={() => {
                  if (mode === "upload") {
                    fileInputRef.current?.click();
                  } else {
                    const newUrl = prompt("Nhập URL ảnh mới:", value);
                    if (newUrl !== null) onChange(newUrl.trim());
                  }
                }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Đổi ảnh</span>
              </button>

              <button
                type="button"
                onClick={() => onChange("")}
                className="px-3 py-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
              >
                <X className="w-3.5 h-3.5" />
                <span>Xoá ảnh</span>
              </button>
            </div>
          </div>

          {/* Info bar beneath preview */}
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
            <span
              className="text-slate-400 font-mono truncate max-w-[240px] sm:max-w-xs text-[11px]"
              title={value}
            >
              {value}
            </span>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                title="Sao chép link ảnh"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                title="Mở ảnh trong tab mới"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                title="Xoá ảnh"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Input State */
        <div>
          {mode === "upload" ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-amber-400 bg-amber-500/10 scale-[1.01]"
                  : "border-slate-700 hover:border-amber-400/70 bg-slate-900/60 hover:bg-slate-900"
              } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
            >
              {isUploading ? (
                <div className="py-3 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
                  <span className="text-xs font-semibold text-slate-200">
                    Đang tải ảnh lên máy chủ...
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Vui lòng chờ trong giây lát
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">
                      Nhấp để chọn ảnh hoặc kéo thả vào đây
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Hỗ trợ PNG, JPG, WebP, GIF, AVIF (Tối đa 10MB)
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg border border-slate-600 transition-colors"
                  >
                    Chọn file từ máy
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Mode "url" */
            <div className="space-y-1.5">
              <div className="relative">
                <input
                  type="url"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-amber-400 focus:outline-none placeholder:text-slate-500"
                />
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400">
                Dán đường link ảnh trực tiếp (https://...) từ Unsplash, Google Photos hoặc website khác.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Helper Text */}
      {helperText && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
}
