"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, Phone, X, Eye, FileText, UploadCloud } from "lucide-react";

interface QuoteFormProps {
  dict: any;
  preselectedService?: string;
}

interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl?: string;
  isImage: boolean;
}

export default function QuoteForm({ dict, preselectedService }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service: preselectedService || "renovation",
    timeframe: "planning",
    details: "",
  });

  const [fileList, setFileList] = useState<UploadedFileItem[]>([]);
  const [previewModalImg, setPreviewModalImg] = useState<{ url: string; name: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // Revoke object URLs on unmount or file removal to prevent memory leaks
  useEffect(() => {
    return () => {
      fileList.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, [fileList]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const addFiles = (newFiles: FileList | File[]) => {
    const items: UploadedFileItem[] = [];
    const maxFiles = 10;
    const remainingSlots = maxFiles - fileList.length;
    if (remainingSlots <= 0) return;

    const filesToProcess = Array.from(newFiles).slice(0, remainingSlots);

    for (const file of filesToProcess) {
      const isImg = file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|avif)$/i.test(file.name);
      let previewUrl: string | undefined = undefined;
      if (isImg) {
        try {
          previewUrl = URL.createObjectURL(file);
        } catch {
          previewUrl = undefined;
        }
      }
      items.push({
        id: `${file.name}-${file.size}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        size: file.size,
        previewUrl,
        isImage: isImg,
      });
    }

    setFileList((prev) => [...prev, ...items]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeFile = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFileList((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const resetForm = () => {
    fileList.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setFileList([]);
    setStatus("idle");
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      service: "renovation",
      timeframe: "planning",
      details: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const body = new FormData();
      body.append("name", formData.name);
      body.append("phone", formData.phone);
      body.append("email", formData.email);
      body.append("address", formData.address);
      body.append("location", formData.address);
      body.append("service", formData.service);
      body.append("timeframe", formData.timeframe);
      body.append("details", formData.details);

      fileList.forEach((item) => {
        body.append("files", item.file);
      });

      const res = await fetch("/api/quote", {
        method: "POST",
        body,
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const quoteDict = dict.quote;

  return (
    <div id="quote-section" className="w-full bg-surface-container py-14 sm:py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-surface-container-lowest p-5 sm:p-8 lg:p-12 rounded-2xl shadow-xl border border-border-light">
          {/* HEADER */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <span className="h-0.5 w-6 bg-secondary"></span>
              <span className="text-xs uppercase tracking-widest text-secondary font-bold">
                {quoteDict.badge}
              </span>
              <span className="h-0.5 w-6 bg-secondary"></span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              {quoteDict.title}
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2 leading-relaxed">
              {quoteDict.subtitle}
            </p>
          </div>

          {status === "success" ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-primary">{quoteDict.success_title}</h3>
              <p className="text-sm text-slate-600 max-w-md">{quoteDict.success_msg}</p>
              <div className="pt-4 flex flex-wrap gap-4 justify-center">
                <a
                  href="tel:0276666510"
                  className="inline-flex items-center gap-2 bg-primary text-white font-bold text-xs uppercase px-5 py-3 rounded-lg"
                >
                  <Phone className="w-4 h-4 text-bronze" />
                  <span>Call: 027 666 6510</span>
                </a>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-3 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Send Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" id="quote-form">
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2" htmlFor="client-name">
                    {quoteDict.name} *
                  </label>
                  <input
                    id="client-name"
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Campbell"
                    className="w-full h-11 px-4 rounded-lg bg-surface text-base sm:text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2" htmlFor="client-phone">
                    {quoteDict.phone} *
                  </label>
                  <input
                    id="client-phone"
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 021 123 4567"
                    className="w-full h-11 px-4 rounded-lg bg-surface text-base sm:text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Email & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2" htmlFor="client-email">
                    {quoteDict.email} *
                  </label>
                  <input
                    id="client-email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. john@domain.co.nz"
                    className="w-full h-11 px-4 rounded-lg bg-surface text-base sm:text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2" htmlFor="client-address">
                    {quoteDict.address || "Project Address / Suburb"} *
                  </label>
                  <input
                    id="client-address"
                    required
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Remuera, Auckland"
                    className="w-full h-11 px-4 rounded-lg bg-surface text-base sm:text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Category & Timeframe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2" htmlFor="service-category">
                    {quoteDict.service} *
                  </label>
                  <select
                    id="service-category"
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg bg-surface text-base sm:text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
                  >
                    <option value="" disabled>
                      {quoteDict.service_placeholder || "Select primary trade..."}
                    </option>
                    <option value="renovation">Full Home Renovation</option>
                    <option value="bathroom">Bathroom Renovation</option>
                    <option value="joinery">Custom Cabinets & Joinery</option>
                    <option value="flooring">Flooring Installation / Restorations</option>
                    <option value="doors">Doors & Architectural Openings</option>
                    <option value="painting">Interior & Exterior Painting</option>
                    <option value="plastering">Plastering & Gib Stopping</option>
                    <option value="equipment">Trade / Equipment Hire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2" htmlFor="timeframe">
                    {quoteDict.timeframe || "Anticipated Start Date"}
                  </label>
                  <select
                    id="timeframe"
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg bg-surface text-base sm:text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
                  >
                    <option value="immediate">
                      {quoteDict.timeframe_options?.immediate || "Immediately (Next 2-4 Weeks)"}
                    </option>
                    <option value="quarter">
                      {quoteDict.timeframe_options?.quarter || "1 to 3 Months"}
                    </option>
                    <option value="planning">
                      {quoteDict.timeframe_options?.planning || "Planning Stage / 3-6 Months"}
                    </option>
                    <option value="future">
                      {quoteDict.timeframe_options?.future || "Next Year / Feasibility Study"}
                    </option>
                  </select>
                </div>
              </div>

              {/* Project Scope & Requirements */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2" htmlFor="project-notes">
                  {quoteDict.details}
                </label>
                <textarea
                  id="project-notes"
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder={
                    quoteDict.details_placeholder ||
                    "Briefly describe what you're looking to achieve (e.g. removing a wall between kitchen and living, installing full bathroom, consent status, architect plans ready)..."
                  }
                  className="w-full p-4 rounded-lg bg-surface text-base sm:text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
                ></textarea>
              </div>

              {/* File Upload Zone with Live Image Previews */}
              <div className="space-y-3">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 bg-surface rounded-xl text-center cursor-pointer transition-all border-2 border-dashed ${
                    isDragging
                      ? "border-secondary bg-secondary/5 scale-[1.01]"
                      : "border-slate-200 hover:bg-surface-container-high hover:border-slate-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-[32px] text-secondary mb-2 block mx-auto">
                    cloud_upload
                  </span>
                  <p className="text-sm font-bold text-primary">
                    {quoteDict.upload_title || "Have plans or photos ready? (Optional)"}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {quoteDict.upload_desc || "Drop architectural PDFs or photos here, or click to browse"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Hỗ trợ: JPG, PNG, WebP, GIF, PDF (Tối đa 10 tệp)
                  </p>
                  <input
                    ref={fileInputRef}
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Previews List */}
                {fileList.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium px-1">
                      <span>Đã chọn ({fileList.length} tệp)</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileList.forEach((item) => {
                            if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
                          });
                          setFileList([]);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors text-[11px] font-semibold"
                      >
                        Xóa tất cả
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {fileList.map((item) => (
                        <div
                          key={item.id}
                          className="relative group bg-white rounded-xl border border-slate-200 p-2 shadow-xs hover:shadow-md transition-all flex flex-col items-center"
                        >
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={(e) => removeFile(item.id, e)}
                            title="Xóa tệp"
                            className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          {/* Image Thumbnail or PDF Icon */}
                          {item.isImage && item.previewUrl ? (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewModalImg({ url: item.previewUrl!, name: item.name });
                              }}
                              className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-100 cursor-pointer group/thumb"
                            >
                              <img
                                src={item.previewUrl}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Eye className="w-5 h-5 drop-shadow" />
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-square w-full rounded-lg bg-red-50 flex flex-col items-center justify-center text-red-500">
                              <FileText className="w-8 h-8 mb-1" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">PDF</span>
                            </div>
                          )}

                          {/* Filename & size */}
                          <div className="mt-2 text-center w-full">
                            <p
                              className="text-[11px] font-medium text-primary truncate"
                              title={item.name}
                            >
                              {item.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {formatFileSize(item.size)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button & Trust Proof */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-bold text-sm px-8 py-3.5 rounded-lg hover:bg-slate-800 transition-all shadow-md disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>{status === "submitting" ? quoteDict.submitting : quoteDict.submit}</span>
                </button>

                <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]">lock</span>
                  <span>{quoteDict.confidential || "100% Confidential • Zero Obligation"}</span>
                </div>
              </div>

              {status === "error" && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-xs">
                  Failed to send your request. Please call us directly at 027 666 6510.
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {previewModalImg && (
        <div
          onClick={() => setPreviewModalImg(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center bg-slate-900 rounded-2xl p-2 sm:p-4 shadow-2xl border border-slate-700"
          >
            <div className="w-full flex items-center justify-between pb-3 px-2 text-white">
              <span className="text-xs sm:text-sm font-semibold truncate max-w-md">
                {previewModalImg.name}
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto max-h-[78vh] rounded-lg">
              <img
                src={previewModalImg.url}
                alt={previewModalImg.name}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
