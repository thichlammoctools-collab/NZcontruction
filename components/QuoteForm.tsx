"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";

interface QuoteFormProps {
  dict: any;
  preselectedService?: string;
}

export default function QuoteForm({ dict, preselectedService }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: preselectedService || "renovations",
    location: "",
    details: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

  return (
    <div id="quote" className="w-full bg-white rounded-3xl p-8 sm:p-10 border border-border-light shadow-xl">
      {status === "success" ? (
        <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-primary">{dict.quote.success_title}</h3>
          <p className="text-sm text-slate-600 max-w-md">{dict.quote.success_msg}</p>
          <div className="pt-4 flex gap-4">
            <a
              href="tel:0276666510"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold text-xs uppercase px-5 py-3 rounded-lg"
            >
              <Phone className="w-4 h-4 text-bronze" />
              <span>Call: 027 666 6510</span>
            </a>
            <button
              onClick={() => {
                setStatus("idle");
                setFormData({
                  name: "",
                  phone: "",
                  email: "",
                  service: "renovations",
                  location: "",
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {dict.quote.name} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Smith"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {dict.quote.phone} *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="021 XXX XXXX"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {dict.quote.email}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.co.nz"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {dict.quote.location} *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Remuera, Auckland"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              {dict.quote.service}
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary bg-slate-50 focus:bg-white transition-colors"
            >
              <option value="renovations">{dict.services.items.renovations.title}</option>
              <option value="bathrooms">{dict.services.items.bathrooms.title}</option>
              <option value="cabinets">{dict.services.items.cabinets.title}</option>
              <option value="flooring">{dict.services.items.flooring.title}</option>
              <option value="doors">{dict.services.items.doors.title}</option>
              <option value="painting">{dict.services.items.painting.title}</option>
              <option value="hiring">{dict.services.items.hiring.title}</option>
              <option value="maintenance">{dict.services.items.maintenance.title}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              {dict.quote.details}
            </label>
            <textarea
              rows={4}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Tell us about your project timeline, approximate dimensions, and what you would like to achieve..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary bg-slate-50 focus:bg-white transition-colors"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-4 rounded-xl bg-bronze hover:bg-bronze-dark text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{status === "submitting" ? dict.quote.submitting : dict.quote.submit}</span>
          </button>
        </form>
      )}
    </div>
  );
}
