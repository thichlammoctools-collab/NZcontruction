"use client";

import React, { useState } from "react";
import { CheckCircle2, Phone } from "lucide-react";

interface QuoteFormProps {
  dict: any;
  preselectedService?: string;
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

  const [files, setFiles] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f) => f.name);
      setFiles((prev) => [...prev, ...names]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          location: formData.address,
          files,
        }),
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
    <div id="quote-section" className="w-full bg-surface-container py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-surface-container-lowest p-8 sm:p-12 rounded-2xl shadow-xl border border-border-light">
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
                  onClick={() => {
                    setStatus("idle");
                    setFiles([]);
                    setFormData({
                      name: "",
                      phone: "",
                      email: "",
                      address: "",
                      service: "renovation",
                      timeframe: "planning",
                      details: "",
                    });
                  }}
                  className="px-5 py-3 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Send Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" id="quote-form">
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    className="w-full h-11 px-4 rounded-lg bg-surface text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
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
                    className="w-full h-11 px-4 rounded-lg bg-surface text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Email & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    className="w-full h-11 px-4 rounded-lg bg-surface text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
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
                    className="w-full h-11 px-4 rounded-lg bg-surface text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Category & Timeframe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2" htmlFor="service-category">
                    {quoteDict.service} *
                  </label>
                  <select
                    id="service-category"
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg bg-surface text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
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
                    className="w-full h-11 px-4 rounded-lg bg-surface text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
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
                  className="w-full p-4 rounded-lg bg-surface text-sm text-on-surface outline-none border border-slate-200 focus:border-primary focus:bg-white transition-colors"
                ></textarea>
              </div>

              {/* File Upload Zone */}
              <label className="block p-6 bg-surface rounded-xl text-center cursor-pointer hover:bg-surface-container-high border-2 border-dashed border-slate-200 transition-colors">
                <span className="material-symbols-outlined text-[32px] text-secondary mb-2 block mx-auto">
                  cloud_upload
                </span>
                <p className="text-sm font-bold text-primary">
                  {quoteDict.upload_title || "Have plans or photos ready? (Optional)"}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {quoteDict.upload_desc || "Drop architectural PDFs or photos here, or click to browse"}
                </p>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                {files.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    {files.map((name, i) => (
                      <span key={i} className="text-xs bg-white px-2.5 py-1 rounded shadow-xs text-primary font-medium">
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </label>

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
    </div>
  );
}
