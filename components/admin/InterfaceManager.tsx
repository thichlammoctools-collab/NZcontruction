"use client";

import React, { useState } from "react";
import {
  Save,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
  Phone,
  Mail,
  Sliders,
  Eye,
  Layers,
  ArrowRight,
  Lock,
  Key,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import BeforeAfterSlider from "../BeforeAfterSlider";
import ImageUpload from "./ImageUpload";

interface InterfaceManagerProps {
  initialData: {
    siteSettings: any;
    hero: { vi: any; en: any };
    contact: any;
    before_after: { vi: any; en: any };
    toggles: any;
  };
  onSaveSuccess: () => void;
}

export default function InterfaceManager({
  initialData,
  onSaveSuccess,
}: InterfaceManagerProps) {
  const [subTab, setSubTab] = useState<
    "hero" | "contact" | "before_after" | "toggles" | "security"
  >("hero");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Password change state
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Hero state
  const [heroVi, setHeroVi] = useState({
    badge: initialData?.hero?.vi?.badge || "",
    title_line1: initialData?.hero?.vi?.title_line1 || "",
    title_line2: initialData?.hero?.vi?.title_line2 || "",
    subtitle: initialData?.hero?.vi?.subtitle || "",
    cta_quote: initialData?.hero?.vi?.cta_quote || "",
    cta_work: initialData?.hero?.vi?.cta_work || "",
  });

  const [heroEn, setHeroEn] = useState({
    badge: initialData?.hero?.en?.badge || "",
    title_line1: initialData?.hero?.en?.title_line1 || "",
    title_line2: initialData?.hero?.en?.title_line2 || "",
    subtitle: initialData?.hero?.en?.subtitle || "",
    cta_quote: initialData?.hero?.en?.cta_quote || "",
    cta_work: initialData?.hero?.en?.cta_work || "",
  });

  const [heroBgImage, setHeroBgImage] = useState(
    initialData?.siteSettings?.heroBackgroundImage ||
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAC4zySIsBFsCxbPwZoDwuqZtLQWpoTxQeVfs9GkcCOv8krWekpp7w-Sr4GIn4XjONGNLOByEmndm0tLOLyjs8PwH7QRkKbuuMMi34H0gnPxaPMwqQFVlSToJiD5aGeB16_nvb2zbNYsBr_w-OG4ktIRiEp6kaeOBtvN58A62ECHeBxKOEYa4sU7H5HmQaAugC9OSRbuHdHIOXPkFDOyfyHz-acP9xjnkESnozm5pyPzrINXZNh1K03Cg"
  );

  // Contact state
  const [contactData, setContactData] = useState({
    brandName: initialData?.contact?.brandName || "NS Building Ltd",
    director: initialData?.contact?.director || "Nguyễn Sơn",
    lbpLicense: initialData?.contact?.lbpLicense || "BP128842",
    phone: initialData?.contact?.phone || "027 666 6510",
    mobile: initialData?.contact?.mobile || "021 153 1510",
    whatsapp: initialData?.contact?.whatsapp || "64211531510",
    facebook: initialData?.contact?.facebook || "https://www.facebook.com/nsbuildingnz",
    facebookMessenger: initialData?.contact?.facebookMessenger || "https://m.me/nsbuildingnz",
    email: initialData?.contact?.email || "contact@nsbuilding.co.nz",
    location_vi: initialData?.contact?.location_vi || "Auckland & Toàn New Zealand",
    location_en: initialData?.contact?.location_en || "Auckland & Across New Zealand",
  });

  // Before & After showcase state
  const [baDataVi, setBaDataVi] = useState({
    badge: initialData?.before_after?.vi?.badge || "Minh Chứng Chuyển Đổi Thực Tế",
    title: initialData?.before_after?.vi?.title || "Thấy Rõ Sự Khác Biệt",
    subtitle: initialData?.before_after?.vi?.subtitle || "Cảm nhận giá trị, ánh sáng và luồng sinh khí mới được khai phóng qua tay nghề thợ xây dựng có tâm và có tầm.",
    project_name: initialData?.before_after?.vi?.project_name || "Nhà Bungalow Grey Lynn",
    duration: initialData?.before_after?.vi?.duration || "Thời gian: 9 Tuần",
    before_label: initialData?.before_after?.vi?.before_label || "TRƯỚC : Hiện Trạng Cũ",
    after_label: initialData?.before_after?.vi?.after_label || "SAU : Hoàn Thiện",
    before_img:
      initialData?.before_after?.vi?.before_img ||
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXABoUjRVTOvCaWAGi2H-BcvFn-oX99AAXLbmUQBB9sE7hmOXpO79DDCNFIN9w8sPUwgG724xXDzHK_F-UfAagexlYAhsLExy4UfzeQeqANxleDFzSZtNvL2dyj9UxTnqyAlSkpSNVZ6mOKWxwXSUUKtKGY5SFJusUYIgyFNER7qY7XL_m1kfFPaI3oaSHKfxy9ZsEQ-Q8dPgCW3-N_wzKeu-LCNLBoaGwOAXGu4lJ",
    after_img:
      initialData?.before_after?.vi?.after_img ||
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjzDaHaS2jbKklc2kERlQeGcZt0S643DcIPnvqjnZTr7An7oYBfl15hlloiziUsgvh5Wk1EmxcfJ4ZeqDSL19MHDVbdkmvJiKz3FLOLyKal3R_cgeHEuf1PORQASZ6OAmL7nonhNRXgqvKzTRrKj-9W0zECDwNJlbW5SGXE-am9m4CbCs9PVuXYYTgJ-N0dDSQh3z93CJ8SJ3ZnveKd9LQW58tezEDmwhcCIFWclkC",
  });

  const [baDataEn, setBaDataEn] = useState({
    badge: initialData?.before_after?.en?.badge || "Proven Project Transformation",
    title: initialData?.before_after?.en?.title || "See The Difference",
    subtitle: initialData?.before_after?.en?.subtitle || "Experience the value, natural light, and renewed vitality unlocked through dedicated, high-standard craftsmanship.",
    project_name: initialData?.before_after?.en?.project_name || "Grey Lynn Bungalow Renovation",
    duration: initialData?.before_after?.en?.duration || "Duration: 9 Weeks",
    before_label: initialData?.before_after?.en?.before_label || "BEFORE : Original Layout",
    after_label: initialData?.before_after?.en?.after_label || "AFTER : NS Building Transformation",
  });

  const [baPreviewLang, setBaPreviewLang] = useState<"vi" | "en">("vi");

  // Toggles state
  const [toggles, setToggles] = useState({
    showBeforeAfter: initialData?.toggles?.showBeforeAfter ?? true,
    showReviews: initialData?.toggles?.showReviews ?? true,
    showQuoteForm: initialData?.toggles?.showQuoteForm ?? true,
    showChatWidget: initialData?.toggles?.showChatWidget ?? true,
    showWhatsappBtn: initialData?.toggles?.showWhatsappBtn ?? true,
    showFacebookBtn: initialData?.toggles?.showFacebookBtn ?? true,
    showPricingSection: initialData?.toggles?.showPricingSection ?? true,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    try {
      const payload = {
        siteSettings: {
          heroBackgroundImage: heroBgImage,
        },
        hero: {
          vi: heroVi,
          en: heroEn,
          backgroundImage: heroBgImage,
        },
        contact: contactData,
        before_after: {
          vi: baDataVi,
          en: {
            ...baDataEn,
            before_img: baDataVi.before_img,
            after_img: baDataVi.after_img,
            drag_hint: initialData?.before_after?.en?.drag_hint || "Drag the handle to compare structural before & after",
          },
        },
        toggles,
      };

      const res = await fetch("/api/admin/interface", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Lỗi khi lưu cấu hình giao diện");
      }

      setSaveSuccess(true);
      onSaveSuccess();
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Không thể lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSubTab("hero")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            subTab === "hero"
              ? "border-amber-400 text-amber-400 bg-amber-400/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Banner Hero &amp; Khẩu Hiệu</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab("contact")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            subTab === "contact"
              ? "border-amber-400 text-amber-400 bg-amber-400/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Liên Hệ &amp; Thương Hiệu</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab("before_after")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            subTab === "before_after"
              ? "border-amber-400 text-amber-400 bg-amber-400/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tiêu Điểm Before / After</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab("toggles")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            subTab === "toggles"
              ? "border-amber-400 text-amber-400 bg-amber-400/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Tùy Chọn Bật/Tắt Khối</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab("security")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            subTab === "security"
              ? "border-amber-400 text-amber-400 bg-amber-400/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Mật Khẩu & Bảo Mật</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Đã lưu thành công cấu hình giao diện và đồng bộ trực tiếp lên website!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-400">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SUBTAB 1: HERO */}
        {subTab === "hero" && (
          <div className="space-y-6">
            {/* Hero Image URL & Preview */}
            <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Ảnh Nền Hero (Background Image)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Ảnh chất lượng cao hiển thị ở đầu trang chủ tạo ấn tượng thị giác đầu tiên cho khách hàng.
              </p>

              <ImageUpload
                label="Ảnh nền banner chính"
                required
                value={heroBgImage}
                onChange={setHeroBgImage}
                aspectRatio="wide"
                helperText="Tải file ảnh độ phân giải cao từ máy tính (khuyên dùng 1920x1080 hoặc tỷ lệ 16:9, 21:9)"
              />

              {heroBgImage && (
                <div className="relative aspect-[21/9] max-h-56 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img
                    src={heroBgImage}
                    alt="Hero Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-6">
                    <div className="max-w-md text-white">
                      <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1">
                        Xem trước hiển thị thực tế
                      </span>
                      <h4 className="text-base sm:text-lg font-black leading-tight">
                        {heroVi.title_line1} {heroVi.title_line2}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                        {heroVi.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bilingual Hero Headlines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vietnamese */}
              <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    🇻🇳 Tiếng Việt (Trang /vi)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Huy hiệu tin cậy (Badge)
                  </label>
                  <input
                    type="text"
                    value={heroVi.badge}
                    onChange={(e) => setHeroVi({ ...heroVi, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tiêu đề chính dòng 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={heroVi.title_line1}
                    onChange={(e) => setHeroVi({ ...heroVi, title_line1: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tiêu đề chính dòng 2 *
                  </label>
                  <input
                    type="text"
                    required
                    value={heroVi.title_line2}
                    onChange={(e) => setHeroVi({ ...heroVi, title_line2: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Đoạn mô tả phụ (Subtitle)
                  </label>
                  <textarea
                    rows={3}
                    value={heroVi.subtitle}
                    onChange={(e) => setHeroVi({ ...heroVi, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nút Báo Giá (CTA)
                    </label>
                    <input
                      type="text"
                      value={heroVi.cta_quote}
                      onChange={(e) => setHeroVi({ ...heroVi, cta_quote: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nút Xem Dự Án (CTA)
                    </label>
                    <input
                      type="text"
                      value={heroVi.cta_work}
                      onChange={(e) => setHeroVi({ ...heroVi, cta_work: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* English */}
              <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    🇳🇿 Tiếng Anh (Trang /en)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Huy hiệu tin cậy (Badge)
                  </label>
                  <input
                    type="text"
                    value={heroEn.badge}
                    onChange={(e) => setHeroEn({ ...heroEn, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tiêu đề chính dòng 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={heroEn.title_line1}
                    onChange={(e) => setHeroEn({ ...heroEn, title_line1: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tiêu đề chính dòng 2 *
                  </label>
                  <input
                    type="text"
                    required
                    value={heroEn.title_line2}
                    onChange={(e) => setHeroEn({ ...heroEn, title_line2: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Đoạn mô tả phụ (Subtitle)
                  </label>
                  <textarea
                    rows={3}
                    value={heroEn.subtitle}
                    onChange={(e) => setHeroEn({ ...heroEn, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nút Báo Giá (CTA)
                    </label>
                    <input
                      type="text"
                      value={heroEn.cta_quote}
                      onChange={(e) => setHeroEn({ ...heroEn, cta_quote: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nút Xem Dự Án (CTA)
                    </label>
                    <input
                      type="text"
                      value={heroEn.cta_work}
                      onChange={(e) => setHeroEn({ ...heroEn, cta_work: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: CONTACT & BRANDING */}
        {subTab === "contact" && (
          <div className="bg-slate-800/90 p-6 sm:p-8 rounded-2xl border border-slate-700 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Thông Tin Doanh Nghiệp &amp; Hotline Khách Hàng</span>
            </h3>
            <p className="text-xs text-slate-400">
              Thông tin này được hiển thị trên thanh Header, Chân trang Footer và các biểu mẫu liên hệ của website.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Tên công ty
                </label>
                <input
                  type="text"
                  value={contactData.brandName}
                  onChange={(e) =>
                    setContactData({ ...contactData, brandName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Giám đốc / Đại diện pháp luật
                </label>
                <input
                  type="text"
                  value={contactData.director}
                  onChange={(e) =>
                    setContactData({ ...contactData, director: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Hotline chính tại New Zealand *
                </label>
                <input
                  type="text"
                  required
                  value={contactData.phone}
                  onChange={(e) =>
                    setContactData({ ...contactData, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-amber-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Số điện thoại Mr. Sơn (Zalo / Di Động) *
                </label>
                <input
                  type="text"
                  required
                  value={contactData.mobile}
                  onChange={(e) =>
                    setContactData({ ...contactData, mobile: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-amber-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Số WhatsApp (Quốc tế hoặc NZ) *</span>
                  <span className="text-[11px] text-emerald-400 font-normal">vd: 64211531510 hoặc 021 153 1510</span>
                </label>
                <input
                  type="text"
                  value={contactData.whatsapp}
                  onChange={(e) =>
                    setContactData({ ...contactData, whatsapp: e.target.value })
                  }
                  placeholder="64211531510"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Link Chat Facebook Messenger *</span>
                  <span className="text-[11px] text-sky-400 font-normal">vd: https://m.me/nsbuildingnz</span>
                </label>
                <input
                  type="text"
                  value={contactData.facebookMessenger}
                  onChange={(e) =>
                    setContactData({ ...contactData, facebookMessenger: e.target.value })
                  }
                  placeholder="https://m.me/nsbuildingnz"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sky-400 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Link Trang Facebook (Fanpage)</span>
                  <span className="text-[11px] text-slate-400 font-normal">vd: https://www.facebook.com/nsbuildingnz</span>
                </label>
                <input
                  type="text"
                  value={contactData.facebook}
                  onChange={(e) =>
                    setContactData({ ...contactData, facebook: e.target.value })
                  }
                  placeholder="https://www.facebook.com/nsbuildingnz"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Email tiếp nhận thông tin dự án *
                </label>
                <input
                  type="email"
                  required
                  value={contactData.email}
                  onChange={(e) =>
                    setContactData({ ...contactData, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Số giấy phép thợ LBP NZ
                </label>
                <input
                  type="text"
                  value={contactData.lbpLicense}
                  onChange={(e) =>
                    setContactData({ ...contactData, lbpLicense: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-amber-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Địa bàn hoạt động (Tiếng Việt)
                </label>
                <input
                  type="text"
                  value={contactData.location_vi}
                  onChange={(e) =>
                    setContactData({ ...contactData, location_vi: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Địa bàn hoạt động (Tiếng Anh)
                </label>
                <input
                  type="text"
                  value={contactData.location_en}
                  onChange={(e) =>
                    setContactData({ ...contactData, location_en: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: BEFORE / AFTER SHOWCASE */}
        {subTab === "before_after" && (
          <div className="bg-slate-800/90 p-6 sm:p-8 rounded-2xl border border-slate-700 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Cấu Hình Khối So Sánh Trước &amp; Sau (Before / After Showcase)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Công trình tiêu biểu hiển thị thanh trượt so sánh Before/After tại trung tâm trang chủ. Ảnh được dùng chung cho cả 2 ngôn ngữ, nội dung chữ có thể tùy biến riêng cho Tiếng Việt và Tiếng Anh.
            </p>

            {/* Shared Images */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/70 space-y-2">
                <ImageUpload
                  label="Ảnh Trước Khi Sửa (Before Image)"
                  required
                  value={baDataVi.before_img}
                  onChange={(url) => {
                    setBaDataVi({ ...baDataVi, before_img: url });
                  }}
                  aspectRatio="video"
                  helperText="Tải file ảnh thực tế hiện trạng từ máy tính hoặc dán link URL"
                />
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/70 space-y-2">
                <ImageUpload
                  label="Ảnh Sau Khi Hoàn Thiện (After Image)"
                  required
                  value={baDataVi.after_img}
                  onChange={(url) => {
                    setBaDataVi({ ...baDataVi, after_img: url });
                  }}
                  aspectRatio="video"
                  helperText="Tải file ảnh thực tế sau hoàn thiện từ máy tính hoặc dán link URL"
                />
              </div>
            </div>

            {/* Bilingual Content Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700/80">
              {/* Vietnamese */}
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/70 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    🇻🇳 Tiếng Việt (Trang /vi)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Huy hiệu phụ (Badge)
                  </label>
                  <input
                    type="text"
                    value={baDataVi.badge}
                    onChange={(e) =>
                      setBaDataVi({ ...baDataVi, badge: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tiêu đề chính (Title)
                  </label>
                  <input
                    type="text"
                    value={baDataVi.title}
                    onChange={(e) =>
                      setBaDataVi({ ...baDataVi, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Đoạn mô tả ngắn (Subtitle)
                  </label>
                  <textarea
                    rows={2}
                    value={baDataVi.subtitle}
                    onChange={(e) =>
                      setBaDataVi({ ...baDataVi, subtitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Tên công trình
                    </label>
                    <input
                      type="text"
                      value={baDataVi.project_name}
                      onChange={(e) =>
                        setBaDataVi({ ...baDataVi, project_name: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Thời gian hoàn thành
                    </label>
                    <input
                      type="text"
                      value={baDataVi.duration}
                      onChange={(e) =>
                        setBaDataVi({ ...baDataVi, duration: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nhãn ảnh Trước
                    </label>
                    <input
                      type="text"
                      value={baDataVi.before_label}
                      onChange={(e) =>
                        setBaDataVi({ ...baDataVi, before_label: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nhãn ảnh Sau
                    </label>
                    <input
                      type="text"
                      value={baDataVi.after_label}
                      onChange={(e) =>
                        setBaDataVi({ ...baDataVi, after_label: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* English */}
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/70 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    🇳🇿 Tiếng Anh (Trang /en)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Top Badge
                  </label>
                  <input
                    type="text"
                    value={baDataEn.badge}
                    onChange={(e) =>
                      setBaDataEn({ ...baDataEn, badge: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={baDataEn.title}
                    onChange={(e) =>
                      setBaDataEn({ ...baDataEn, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Subtitle Description
                  </label>
                  <textarea
                    rows={2}
                    value={baDataEn.subtitle}
                    onChange={(e) =>
                      setBaDataEn({ ...baDataEn, subtitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={baDataEn.project_name}
                      onChange={(e) =>
                        setBaDataEn({ ...baDataEn, project_name: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={baDataEn.duration}
                      onChange={(e) =>
                        setBaDataEn({ ...baDataEn, duration: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Before Label
                    </label>
                    <input
                      type="text"
                      value={baDataEn.before_label}
                      onChange={(e) =>
                        setBaDataEn({ ...baDataEn, before_label: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      After Label
                    </label>
                    <input
                      type="text"
                      value={baDataEn.after_label}
                      onChange={(e) =>
                        setBaDataEn({ ...baDataEn, after_label: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Slider Preview */}
            {baDataVi.before_img && baDataVi.after_img && (
              <div className="pt-4 border-t border-slate-700/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Xem Trước Thanh Kéo So Sánh Thực Tế:
                  </span>
                  <div className="inline-flex rounded-lg bg-slate-900 p-1 border border-slate-700 text-xs">
                    <button
                      type="button"
                      onClick={() => setBaPreviewLang("vi")}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        baPreviewLang === "vi"
                          ? "bg-amber-500 text-slate-950 font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🇻🇳 Tiếng Việt
                    </button>
                    <button
                      type="button"
                      onClick={() => setBaPreviewLang("en")}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        baPreviewLang === "en"
                          ? "bg-blue-500 text-white font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🇳🇿 English
                    </button>
                  </div>
                </div>
                <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-2">
                  <BeforeAfterSlider
                    beforeImage={baDataVi.before_img}
                    afterImage={baDataVi.after_img}
                    beforeLabel={
                      baPreviewLang === "vi"
                        ? baDataVi.before_label
                        : baDataEn.before_label
                    }
                    afterLabel={
                      baPreviewLang === "vi"
                        ? baDataVi.after_label
                        : baDataEn.after_label
                    }
                    projectName={
                      baPreviewLang === "vi"
                        ? baDataVi.project_name
                        : baDataEn.project_name
                    }
                    duration={
                      baPreviewLang === "vi"
                        ? baDataVi.duration
                        : baDataEn.duration
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 4: TOGGLES */}
        {subTab === "toggles" && (
          <div className="bg-slate-800/90 p-6 sm:p-8 rounded-2xl border border-slate-700 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>Tùy Chọn Bật / Tắt Các Khối Giao Diện Website</span>
            </h3>
            <p className="text-xs text-slate-400">
              Chủ động ẩn hoặc hiện các khối chức năng trên trang chủ tùy theo nhu cầu chiến dịch quảng bá.
            </p>

            <div className="space-y-4">
              {[
                {
                  key: "showBeforeAfter" as const,
                  title: "Khối So Sánh Before & After (Interactive Split)",
                  desc: "Cho phép khách hàng kéo thanh trượt so sánh hiện trạng và sau khi thi công.",
                },
                {
                  key: "showReviews" as const,
                  title: "Khối Đánh Giá Khách Hàng (Google Reviews 4.9★)",
                  desc: "Hiển thị phản hồi từ các chủ nhà tại Auckland.",
                },
                {
                  key: "showQuoteForm" as const,
                  title: "Khối Biểu Mẫu Nhận Báo Giá Nhanh (Quote Form)",
                  desc: "Form tiếp nhận thông tin công trình và liên hệ khảo sát tận nơi.",
                },
                {
                  key: "showChatWidget" as const,
                  title: "Hộp Thoại Trợ Lý AI Tư Vấn Xây Dựng (AI Chat Widget)",
                  desc: "Widget trò chuyện AI góc dưới hỗ trợ tư vấn quy chuẩn xây dựng NZ và báo giá tức thì.",
                },
                {
                  key: "showWhatsappBtn" as const,
                  title: "Nút Chat Trực Tiếp WhatsApp (WhatsApp Floating Chat Button)",
                  desc: "Hiển thị nút tròn xanh WhatsApp góc dưới màn hình giúp khách hàng nhắn tin tư vấn trực tiếp 1-chạm.",
                },
                {
                  key: "showFacebookBtn" as const,
                  title: "Nút Chat Facebook Messenger (Messenger Floating Chat Button)",
                  desc: "Hiển thị nút tròn Facebook Messenger hỗ trợ nhắn tin qua fanpage.",
                },
                {
                  key: "showPricingSection" as const,
                  title: "Bảng Chi Phí Dự Toán Tham Khảo (Pricing Guide)",
                  desc: "Hiển thị khung giá tham khảo cho các hạng mục cải tạo tại Auckland.",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800"
                >
                  <div className="space-y-0.5 pr-4">
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={toggles[item.key]}
                      onChange={(e) =>
                        setToggles({ ...toggles, [item.key]: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 5: SECURITY & ADMIN PASSWORD */}
        {subTab === "security" && (
          <div className="space-y-6">
            {/* 1. Form đổi mật khẩu trực tiếp qua Cloudflare KV */}
            <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                    Đổi Mật Khẩu Quản Trị Trực Tiếp
                  </h3>
                  <p className="text-xs text-slate-400">
                    Mật khẩu mới sẽ được mã hoá và lưu trực tiếp lên Cloudflare KV, có hiệu lực ngay lập tức.
                  </p>
                </div>
              </div>

              {passwordSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    value={currPassword}
                    onChange={(e) => setCurrPassword(e.target.value)}
                    placeholder="Nhập mật khẩu đang dùng"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setPasswordError("");
                    setPasswordSuccess("");

                    if (!currPassword) {
                      setPasswordError("Vui lòng nhập mật khẩu hiện tại.");
                      return;
                    }
                    if (!newPassword || newPassword.length < 6) {
                      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự.");
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      setPasswordError("Xác nhận mật khẩu mới không khớp.");
                      return;
                    }

                    setPasswordSaving(true);
                    try {
                      const res = await fetch("/api/admin/change-password", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          currentPassword: currPassword,
                          newPassword,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        throw new Error(data.error || "Đổi mật khẩu thất bại.");
                      }
                      setPasswordSuccess(data.message || "Đã đổi mật khẩu thành công!");
                      setCurrPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    } catch (err: any) {
                      setPasswordError(err.message || "Có lỗi xảy ra.");
                    } finally {
                      setPasswordSaving(false);
                    }
                  }}
                  disabled={passwordSaving}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-400/20"
                >
                  {passwordSaving ? (
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>{passwordSaving ? "Đang Cập Nhật..." : "Cập Nhật Mật Khẩu"}</span>
                </button>
              </div>
            </div>

            {/* 2. Hướng dẫn cấu hình qua Cloudflare Dashboard */}
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Cách Cấu Hình Mật Khẩu Trên Cloudflare Dashboard</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống hỗ trợ cấu hình mật khẩu quản trị linh hoạt qua Cloudflare theo các cách sau:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400">Cách 1: Workers &amp; Pages Secrets (Khuyên Dùng)</div>
                  <p className="text-[12px] text-slate-300 leading-relaxed">
                    Vào <strong>Cloudflare Dashboard</strong> &rarr; <strong>Workers &amp; Pages</strong> &rarr; chọn <code>ns-building-nz</code> &rarr; <strong>Settings</strong> &rarr; <strong>Variables and Secrets</strong>.
                  </p>
                  <p className="text-[12px] text-slate-300">
                    Thêm biến Secret mới:
                  </p>
                  <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1 font-mono">
                    <li><strong className="text-amber-300 font-sans">Tên biến:</strong> ADMIN_PASSWORD</li>
                    <li><strong className="text-amber-300 font-sans">Giá trị:</strong> Mật khẩu bạn muốn đặt (ví dụ: MatKhauCuaBan123)</li>
                  </ul>
                  <p className="text-[11px] text-slate-400 italic">
                    * Có thể nhập trực tiếp mật khẩu text thường, hệ thống tự động kiểm tra bảo mật.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400">Cách 2: Cloudflare KV Namespace</div>
                  <p className="text-[12px] text-slate-300 leading-relaxed">
                    Vào <strong>Cloudflare Dashboard</strong> &rarr; <strong>Workers &amp; Pages</strong> &rarr; <strong>KV</strong> &rarr; chọn namespace <code>KV</code> (ID: <code>df55e8be...</code>).
                  </p>
                  <p className="text-[12px] text-slate-300">
                    Thêm Key mới:
                  </p>
                  <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1 font-mono">
                    <li><strong className="text-amber-300 font-sans">Key:</strong> ADMIN_PASSWORD</li>
                    <li><strong className="text-amber-300 font-sans">Value:</strong> Mật khẩu mới của bạn</li>
                  </ul>
                  <p className="text-[11px] text-slate-400 italic">
                    * Lưu vào KV có hiệu lực ngay trong vài giây mà không cần Redeploy Worker.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button (Ẩn khi ở tab Security vì có nút lưu riêng) */}
        {subTab !== "security" && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-400/20 flex items-center gap-2"
            >
              {saving ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? "Đang Lưu Cấu Hình..." : "Lưu & Xuất Bản Giao Diện Mới"}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
