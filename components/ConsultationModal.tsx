"use client";

import React, { useState } from "react";
import { CheckCircle2, X, Send } from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: "en" | "vi";
  projectTitle: string;
}

export default function ConsultationModal({
  isOpen,
  onClose,
  locale,
  projectTitle,
}: ConsultationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    suburb: "Remuera",
    scope: "architectural-renovation",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  if (!isOpen) return null;

  const isVi = locale === "vi";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          location: formData.suburb,
          service: formData.scope,
          details: `Requested on-site consultation from project case study: ${projectTitle}`,
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

  return (
    <div className="fixed inset-0 z-50 bg-primary/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl p-6 lg:p-8 max-w-lg w-full text-on-surface shadow-2xl relative border border-border-light animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-light mb-6">
          <div>
            <h3 className="text-xl font-bold text-primary">
              {isVi ? "Yêu Cầu Khảo Sát Tận Nơi" : "Request On-Site Feasibility"}
            </h3>
            <span className="text-xs text-on-surface-variant block mt-0.5">
              {isVi ? "Dự án Remuera & Khu vực Auckland" : "Remuera & Greater Auckland Projects"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === "success" ? (
          <div className="p-6 bg-secondary-container text-on-secondary-container rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-secondary mx-auto" />
            <h4 className="text-lg font-bold">
              {isVi ? "Đã Tiếp Nhận Thông Tin" : "Inquiry Received"}
            </h4>
            <p className="text-xs sm:text-sm">
              {isVi
                ? "Đội ngũ thợ trưởng NS Building sẽ liên hệ trong 24 giờ để xếp lịch khảo sát thực tế cùng bạn."
                : "Our lead builder will call you within 24 hours to schedule your on-site consultation."}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-5 py-2 bg-secondary text-on-secondary text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
            >
              {isVi ? "Đóng" : "Close"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1" htmlFor="modal-name">
                {isVi ? "Họ và Tên" : "Your Full Name"} *
              </label>
              <input
                id="modal-name"
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Marcus Campbell"
                className="w-full h-11 px-3.5 bg-surface-container-lowest rounded text-on-surface text-sm focus:outline-none border border-border-light focus:border-primary shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1" htmlFor="modal-phone">
                {isVi ? "Số Điện Thoại" : "Phone Number"} *
              </label>
              <input
                id="modal-phone"
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="021 000 0000"
                className="w-full h-11 px-3.5 bg-surface-container-lowest rounded text-on-surface text-sm focus:outline-none border border-border-light focus:border-primary shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1" htmlFor="modal-suburb">
                {isVi ? "Khu Vực Công Trình (Suburb)" : "Property Suburb"}
              </label>
              <input
                id="modal-suburb"
                type="text"
                value={formData.suburb}
                onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                placeholder="e.g. Remuera, Epsom, Takapuna"
                className="w-full h-11 px-3.5 bg-surface-container-lowest rounded text-on-surface text-sm focus:outline-none border border-border-light focus:border-primary shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1" htmlFor="modal-scope">
                {isVi ? "Quy Mô Dự Kiến" : "Scope of Project"}
              </label>
              <select
                id="modal-scope"
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                className="w-full h-11 px-3.5 bg-surface-container-lowest rounded text-on-surface text-sm focus:outline-none border border-border-light focus:border-primary shadow-xs"
              >
                <option value="architectural-renovation">
                  {isVi ? "Cải tạo toàn bộ kiến trúc nhà" : "Architectural Full Home Renovation"}
                </option>
                <option value="structural-extension">
                  {isVi ? "Cơi nới & Mở rộng kết cấu" : "Structural Addition & Extension"}
                </option>
                <option value="custom-new-build">
                  {isVi ? "Xây dựng nhà mới trọn gói" : "Custom Architectural New Build"}
                </option>
                <option value="kitchen-bathroom">
                  {isVi ? "Tủ bếp, Đồ gỗ & Phòng tắm cao cấp" : "Premium Joinery, Kitchen & Bathroom"}
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full h-12 bg-primary-container text-on-primary font-bold text-sm rounded-xl hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-sm mt-4 disabled:opacity-50"
            >
              <span>
                {status === "submitting"
                  ? isVi
                    ? "Đang gửi..."
                    : "Submitting..."
                  : isVi
                  ? "Gửi Yêu Cầu Khảo Sát"
                  : "Submit Consultation Request"}
              </span>
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>

            <p className="text-[11px] text-on-surface-variant text-center mt-2">
              {isVi
                ? "Cam kết bảo mật thông tin. Tiêu chuẩn bảo hành 10 năm Master Builders."
                : "Strict privacy assured. Master Builders 10-Year Guarantee standard."}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
