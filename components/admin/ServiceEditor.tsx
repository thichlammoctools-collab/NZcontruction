"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  ArrowLeft,
  Save,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Plus,
  Layers,
  DollarSign,
  Calendar,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import ImageUpload from "./ImageUpload";

interface ServiceEditorProps {
  initialId?: string;
  isNew?: boolean;
}

export default function ServiceEditor({ initialId, isNew = false }: ServiceEditorProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "features" | "pricing" | "timeline">("basic");

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const defaultFormState = {
    id: initialId || "",
    title_en: "",
    title_vi: "",
    hero_image: "",
    tag_en: "Services",
    tag_vi: "Dịch vụ",
    desc_en: "",
    desc_vi: "",
    icon: "construction",
    intro_en: "",
    intro_vi: "",
    features_en: ["Architectural consultation & drawings", "Full council compliance & CCC"],
    features_vi: ["Tư vấn kiến trúc & hoàn thiện bản vẽ", "Đạt chuẩn nghiệm thu Auckland Council"],
    pricing: [
      {
        name_en: "Standard Package",
        name_vi: "Gói Thi Công Tiêu Chuẩn",
        desc_en: "High-spec materials and certified workmanship",
        desc_vi: "Vật tư cao cấp và thợ LBP thi công",
        range: "$30,000 – $60,000",
        unit_en: "Standard package",
        unit_vi: "Gói tiêu chuẩn",
        popular: true,
      },
    ],
    timeline_steps: [
      {
        step: "01",
        title_en: "Site Consultation & Scope",
        title_vi: "Khảo Sát Hiện Trạng & Lên Dự Toán",
        desc_en: "Free on-site assessment and fixed-price quotation.",
        desc_vi: "Khảo sát tận nơi miễn phí và ký hợp đồng cố định giá.",
      },
      {
        step: "02",
        title_en: "Execution & Council Inspection",
        title_vi: "Thi Công & Nghiệm Thu",
        desc_en: "High-spec construction and council sign-off.",
        desc_vi: "Thi công tỉ mỉ và đồng hành nghiệm thu CCC.",
      },
    ],
  };

  const [formData, setFormData] = useState(defaultFormState);

  useEffect(() => {
    if (!isNew && initialId) {
      setLoading(true);
      fetch(`/api/admin/services?id=${encodeURIComponent(initialId)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Không thể tải thông tin dịch vụ");
          return res.json();
        })
        .then((data) => {
          setFormData({
            id: data.id || initialId,
            title_en: data.title_en || "",
            title_vi: data.title_vi || "",
            hero_image: data.hero_image || "",
            tag_en: data.tag_en || "Services",
            tag_vi: data.tag_vi || "Dịch vụ",
            desc_en: data.desc_en || "",
            desc_vi: data.desc_vi || "",
            icon: data.icon || "construction",
            intro_en: data.intro_en || "",
            intro_vi: data.intro_vi || "",
            features_en: Array.isArray(data.features_en) ? data.features_en : [],
            features_vi: Array.isArray(data.features_vi) ? data.features_vi : [],
            pricing: Array.isArray(data.pricing) ? data.pricing : [],
            timeline_steps: Array.isArray(data.timeline_steps) ? data.timeline_steps : [],
          });
        })
        .catch((err) => {
          setNotification({
            type: "error",
            text: err.message || "Lỗi khi tải dữ liệu dịch vụ",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [initialId, isNew]);

  const handleCopySlug = () => {
    const adminUrl = typeof window !== "undefined" ? `${window.location.origin}/admin/services/${formData.id}` : "";
    if (adminUrl) {
      navigator.clipboard.writeText(adminUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.id.trim()) {
      setNotification({
        type: "error",
        text: "Vui lòng nhập mã định danh (Slug ID) cho dịch vụ.",
      });
      return;
    }

    if (!formData.hero_image) {
      setNotification({
        type: "error",
        text: "Vui lòng tải lên hoặc cung cấp ảnh đại diện (Hero Image) cho dịch vụ.",
      });
      return;
    }

    setSaving(true);
    setNotification(null);

    try {
      const method = isNew ? "POST" : "PUT";
      const res = await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Không thể lưu thông tin dịch vụ");
      }

      setNotification({
        type: "success",
        text: `Đã ${isNew ? "thêm mới" : "cập nhật"} dịch vụ thành công!`,
      });

      if (isNew) {
        // Navigate to the newly created service's slug page
        router.push(`/admin/services/${formData.id}`);
      }
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err.message || "Đã xảy ra lỗi khi lưu dịch vụ",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/services?id=${encodeURIComponent(formData.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Không thể xóa dịch vụ này");
      }
      router.push("/admin?tab=services");
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err.message || "Lỗi khi xóa dịch vụ",
      });
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  // Helper arrays update
  const addFeature = () => {
    setFormData({
      ...formData,
      features_vi: [...formData.features_vi, ""],
      features_en: [...formData.features_en, ""],
    });
  };

  const updateFeature = (index: number, lang: "vi" | "en", value: string) => {
    if (lang === "vi") {
      const next = [...formData.features_vi];
      next[index] = value;
      setFormData({ ...formData, features_vi: next });
    } else {
      const next = [...formData.features_en];
      next[index] = value;
      setFormData({ ...formData, features_en: next });
    }
  };

  const removeFeature = (index: number) => {
    const nextVi = formData.features_vi.filter((_, i) => i !== index);
    const nextEn = formData.features_en.filter((_, i) => i !== index);
    setFormData({ ...formData, features_vi: nextVi, features_en: nextEn });
  };

  const addPricingTier = () => {
    setFormData({
      ...formData,
      pricing: [
        ...formData.pricing,
        {
          name_vi: "Gói Mới",
          name_en: "New Tier",
          desc_vi: "Mô tả chi tiết gói",
          desc_en: "Detailed package description",
          range: "$20,000 – $40,000",
          unit_vi: "Gói hoàn thiện",
          unit_en: "Complete package",
          popular: false,
        },
      ],
    });
  };

  const updatePricingTier = (index: number, field: string, value: any) => {
    const next = [...formData.pricing];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, pricing: next });
  };

  const removePricingTier = (index: number) => {
    setFormData({
      ...formData,
      pricing: formData.pricing.filter((_, i) => i !== index),
    });
  };

  const addTimelineStep = () => {
    const stepNum = String(formData.timeline_steps.length + 1).padStart(2, "0");
    setFormData({
      ...formData,
      timeline_steps: [
        ...formData.timeline_steps,
        {
          step: stepNum,
          title_vi: "Bước Mới",
          title_en: "New Step",
          desc_vi: "Mô tả bước thi công",
          desc_en: "Step description",
        },
      ],
    });
  };

  const updateTimelineStep = (index: number, field: string, value: string) => {
    const next = [...formData.timeline_steps];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, timeline_steps: next });
  };

  const removeTimelineStep = (index: number) => {
    setFormData({
      ...formData,
      timeline_steps: formData.timeline_steps.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center animate-bounce shadow-xl shadow-amber-400/20">
          NS
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full" />
          <span>Đang tải thông tin dịch vụ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin?tab=services"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Danh sách dịch vụ</span>
          </Link>

          <div className="hidden sm:block h-5 w-px bg-slate-700" />

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Admin</span>
            <span className="text-slate-600">/</span>
            <Link href="/admin?tab=services" className="text-slate-400 hover:text-white transition-colors">
              Dịch Vụ
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-semibold font-mono">
              {formData.id || "Mới"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {!isNew && formData.id && (
            <div className="flex items-center gap-1">
              <Link
                href={`/vi/services/${formData.id}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                title="Xem trang web công khai Tiếng Việt"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Xem Live (VI)</span>
              </Link>
              <Link
                href={`/en/services/${formData.id}`}
                target="_blank"
                className="hidden md:flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                title="Xem trang web công khai English"
              >
                <span>EN</span>
              </Link>
            </div>
          )}

          {!isNew && (
            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(true)}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-colors"
              title="Xóa dịch vụ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-400/20"
          >
            {saving ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Đang lưu..." : isNew ? "Tạo Dịch Vụ" : "Lưu Thay Đổi"}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Alert Notification */}
        {notification && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center gap-3 border ${
              notification.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
        )}

        {/* SLUG Management Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-bold uppercase tracking-wider">
                Slug Quản Lý Riêng
              </span>
              <span className="text-xs text-slate-400">Trang chỉnh sửa độc lập</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-xs sm:text-sm font-mono font-bold text-white bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                /admin/services/{formData.id || "[slug]"}
              </code>
              <button
                type="button"
                onClick={handleCopySlug}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
                title="Sao chép link quản lý"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copiedLink ? "Đã sao chép!" : "Sao chép link"}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 text-xs text-slate-400">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Link công khai:</span>
              <span className="text-slate-300 font-mono">/services/{formData.id || "[slug]"}</span>
            </div>
            {!isNew && formData.id && (
              <Link
                href={`/vi/services/${formData.id}`}
                target="_blank"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Xem trên website</span>
              </Link>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 overflow-x-auto bg-slate-900/60 rounded-t-2xl p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "basic"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Thông Tin Cơ Bản</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("features")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "features"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tính Năng &amp; Năng Lực ({formData.features_vi?.length || 0})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pricing")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "pricing"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Gói Báo Giá ({formData.pricing?.length || 0})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "timeline"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Quy Trình Thi Công ({formData.timeline_steps?.length || 0})</span>
          </button>
        </div>

        {/* Tab Content Box */}
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-b-2xl p-6 sm:p-8 space-y-6">
          {/* TAB 1: BASIC INFO */}
          {activeTab === "basic" && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Mã định danh (Slug ID) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isNew}
                    placeholder="ví dụ: renovations, bathrooms, roofing"
                    value={formData.id}
                    onChange={(e) =>
                      setFormData({ ...formData, id: e.target.value.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "") })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono disabled:opacity-60 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Đường dẫn: /services/{formData.id || "slug"} (không dấu, ngăn cách bằng gạch nối)
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Biểu tượng Icon (Material Symbol)
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono text-xs"
                  >
                    <option value="home_repair_service">🛠️ home_repair_service (Cải tạo tổng thể)</option>
                    <option value="bathtub">🛁 bathtub (Phòng tắm &amp; Vệ sinh)</option>
                    <option value="countertops">🪑 countertops (Tủ bếp &amp; Đồ gỗ nội thất)</option>
                    <option value="texture">🪵 texture (Sàn gỗ &amp; Ốp lát)</option>
                    <option value="door_front">🚪 door_front (Hệ cửa &amp; Ô mở kiến trúc)</option>
                    <option value="format_paint">🎨 format_paint (Sơn nội &amp; ngoại thất)</option>
                    <option value="square_foot">📐 square_foot (Trát bả &amp; Gib stopping)</option>
                    <option value="construction">🏗️ construction (Cho thuê thiết bị &amp; Đội thợ)</option>
                    <option value="handyman">🔧 handyman (Bảo trì &amp; Sửa chữa nhanh)</option>
                    <option value="roofing">🏠 roofing (Mái &amp; Vỏ bao che)</option>
                    <option value="hardware">🪛 hardware (Phụ kiện &amp; Cơ khí mộc)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Nhãn Tag Tiếng Việt / Tiếng Anh
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Tag VI: Cải Tạo Toàn Diện"
                      value={formData.tag_vi}
                      onChange={(e) => setFormData({ ...formData, tag_vi: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      placeholder="Tag EN: Full Renovations"
                      value={formData.tag_en}
                      onChange={(e) => setFormData({ ...formData, tag_en: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <ImageUpload
                  label="Ảnh đại diện dịch vụ (Hero Image)"
                  required
                  value={formData.hero_image}
                  onChange={(url) => setFormData({ ...formData, hero_image: url })}
                  aspectRatio="wide"
                  helperText="Ảnh lớn hiển thị trên banner đầu trang chi tiết dịch vụ và ảnh thẻ dịch vụ ngoài trang chủ"
                />
              </div>

              {/* Title VI & EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Tên dịch vụ (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Cải Tạo Nhà Trọn Gói"
                    value={formData.title_vi}
                    onChange={(e) => setFormData({ ...formData, title_vi: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Tên dịch vụ (Tiếng Anh) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Full Home Renovations"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Short Description for Homepage Cards (VI & EN) */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-amber-400/20 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm font-bold">🏠 Mô Tả Hiển Thị Thẻ Trang Chủ (Home Card Description)</span>
                  <span className="text-[10px] text-slate-400">(Tối ưu 1-2 câu ngắn gọn, súc tích để thẻ đều đẹp)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      Mô tả thẻ trang chủ (Tiếng Việt)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Mô tả súc tích trên thẻ dịch vụ trang chủ..."
                      value={formData.desc_vi}
                      onChange={(e) => setFormData({ ...formData, desc_vi: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      Mô tả thẻ trang chủ (Tiếng Anh)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Concise overview sentence for homepage card..."
                      value={formData.desc_en}
                      onChange={(e) => setFormData({ ...formData, desc_en: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Intro VI & EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Mô tả chi tiết trang riêng (Tiếng Việt) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Giới thiệu khái quát về năng lực, tiêu chuẩn thi công và giá trị mang lại cho khách hàng..."
                    value={formData.intro_vi}
                    onChange={(e) => setFormData({ ...formData, intro_vi: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Mô tả chi tiết trang riêng (Tiếng Anh) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="General introduction covering scope of work, NZ compliance standards and workmanship guarantees..."
                    value={formData.intro_en}
                    onChange={(e) => setFormData({ ...formData, intro_en: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEATURES */}
          {activeTab === "features" && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm">Các Tính Năng &amp; Cam Kết Chất Lượng</h4>
                  <p className="text-slate-400 text-xs">Hiển thị dạng danh sách tick xanh trên trang chi tiết dịch vụ</p>
                </div>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold border border-amber-400/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm tính năng</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.features_vi.map((featVi, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 text-xs">Tính năng #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-red-400 hover:text-red-300 text-xs font-semibold"
                      >
                        Xóa
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Nội dung (Tiếng Việt)</label>
                        <input
                          type="text"
                          value={featVi}
                          onChange={(e) => updateFeature(idx, "vi", e.target.value)}
                          placeholder="ví dụ: Đạt chuẩn nghiệm thu Auckland Council"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Nội dung (Tiếng Anh)</label>
                        <input
                          type="text"
                          value={formData.features_en[idx] || ""}
                          onChange={(e) => updateFeature(idx, "en", e.target.value)}
                          placeholder="e.g. Full council compliance & CCC"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.features_vi.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    Chưa có tính năng nào. Bấm nút "Thêm tính năng" ở trên để bổ sung.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRICING TIERS */}
          {activeTab === "pricing" && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm">Bảng Báo Giá Minh Bạch (Pricing Tiers)</h4>
                  <p className="text-slate-400 text-xs">Hiển thị các gói chi phí ước tính theo hạng mục công việc</p>
                </div>
                <button
                  type="button"
                  onClick={addPricingTier}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold border border-amber-400/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm gói giá</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.pricing.map((tier, idx) => (
                  <div key={idx} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400 text-xs">Gói #{idx + 1}: {tier.name_vi}</span>
                        {tier.popular && (
                          <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                            Phổ Biến Nhất
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removePricingTier(idx)}
                        className="text-red-400 hover:text-red-300 text-xs font-semibold"
                      >
                        Xóa gói này
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Tên gói (Tiếng Việt)</label>
                        <input
                          type="text"
                          value={tier.name_vi}
                          onChange={(e) => updatePricingTier(idx, "name_vi", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Tên gói (Tiếng Anh)</label>
                        <input
                          type="text"
                          value={tier.name_en}
                          onChange={(e) => updatePricingTier(idx, "name_en", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Mức giá dao động</label>
                        <input
                          type="text"
                          value={tier.range}
                          onChange={(e) => updatePricingTier(idx, "range", e.target.value)}
                          placeholder="ví dụ: $30,000 – $60,000"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-400 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Đơn vị (VI)</label>
                        <input
                          type="text"
                          value={tier.unit_vi}
                          onChange={(e) => updatePricingTier(idx, "unit_vi", e.target.value)}
                          placeholder="Gói tiêu chuẩn"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Đơn vị (EN)</label>
                        <input
                          type="text"
                          value={tier.unit_en}
                          onChange={(e) => updatePricingTier(idx, "unit_en", e.target.value)}
                          placeholder="Standard package"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!tier.popular}
                            onChange={(e) => updatePricingTier(idx, "popular", e.target.checked)}
                            className="rounded border-slate-700 text-amber-400 focus:ring-amber-400 w-4 h-4 bg-slate-900"
                          />
                          <span className="text-xs text-slate-300 font-medium">Đánh dấu gói phổ biến</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Mô tả gói (Tiếng Việt)</label>
                        <textarea
                          rows={2}
                          value={tier.desc_vi}
                          onChange={(e) => updatePricingTier(idx, "desc_vi", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Mô tả gói (Tiếng Anh)</label>
                        <textarea
                          rows={2}
                          value={tier.desc_en}
                          onChange={(e) => updatePricingTier(idx, "desc_en", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE STEPS */}
          {activeTab === "timeline" && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm">Quy Trình Thi Công Chuẩn Hóa</h4>
                  <p className="text-slate-400 text-xs">Hiển thị các giai đoạn từ khảo sát đến bàn giao và nghiệm thu CCC</p>
                </div>
                <button
                  type="button"
                  onClick={addTimelineStep}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold border border-amber-400/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm bước thi công</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.timeline_steps.map((st, idx) => (
                  <div key={idx} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                          {st.step || `0${idx + 1}`}
                        </span>
                        <span className="font-bold text-white text-xs">{st.title_vi || "Giai đoạn thi công"}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTimelineStep(idx)}
                        className="text-red-400 hover:text-red-300 text-xs font-semibold"
                      >
                        Xóa bước này
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Mã bước</label>
                        <input
                          type="text"
                          value={st.step}
                          onChange={(e) => updateTimelineStep(idx, "step", e.target.value)}
                          placeholder="01"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                        />
                      </div>
                      <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Tiêu đề bước (VI)</label>
                          <input
                            type="text"
                            value={st.title_vi}
                            onChange={(e) => updateTimelineStep(idx, "title_vi", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Tiêu đề bước (EN)</label>
                          <input
                            type="text"
                            value={st.title_en}
                            onChange={(e) => updateTimelineStep(idx, "title_en", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Mô tả chi tiết bước (VI)</label>
                        <textarea
                          rows={2}
                          value={st.desc_vi}
                          onChange={(e) => updateTimelineStep(idx, "desc_vi", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Mô tả chi tiết bước (EN)</label>
                        <textarea
                          rows={2}
                          value={st.desc_en}
                          onChange={(e) => updateTimelineStep(idx, "desc_en", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sticky Bottom Bar */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Mã quản lý: <strong className="text-white font-mono">/admin/services/{formData.id || "slug"}</strong>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin?tab=services"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Hủy &amp; Quay lại
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-400/20"
              >
                {saving ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? "Đang lưu..." : isNew ? "Tạo Dịch Vụ Mới" : "Lưu Thay Đổi"}</span>
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold">Xác Nhận Xóa Dịch Vụ?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa dịch vụ{" "}
              <strong className="text-white font-mono">"{formData.id}"</strong>?
              Thao tác này sẽ gỡ dịch vụ khỏi danh mục và trang chi tiết của website.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-lg shadow-red-600/30 flex items-center gap-2"
              >
                {isDeleting ? "Đang Xóa..." : "Đồng Ý Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
