"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  X,
  PlusCircle,
  Layers,
  DollarSign,
  Calendar,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import ImageUpload from "./ImageUpload";

interface ServicesManagerProps {
  services: any[];
  onRefresh: () => void;
}

export default function ServicesManager({
  services,
  onRefresh,
}: ServicesManagerProps) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeModalTab, setActiveModalTab] = useState<
    "basic" | "features" | "pricing" | "timeline"
  >("basic");

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form State
  const defaultFormState = {
    id: "",
    title_en: "",
    title_vi: "",
    hero_image: "",
    tag_en: "",
    tag_vi: "",
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

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData(defaultFormState);
    setActiveModalTab("basic");
    setModalOpen(true);
  };

  const handleOpenEdit = (service: any) => {
    setModalMode("edit");
    setFormData({
      id: service.id,
      title_en: service.title_en || "",
      title_vi: service.title_vi || "",
      hero_image: service.hero_image || "",
      tag_en: service.tag_en || "Services",
      tag_vi: service.tag_vi || "Dịch vụ",
      icon: service.icon || "construction",
      intro_en: service.intro_en || "",
      intro_vi: service.intro_vi || "",
      features_en: Array.isArray(service.features_en) ? [...service.features_en] : [],
      features_vi: Array.isArray(service.features_vi) ? [...service.features_vi] : [],
      pricing: Array.isArray(service.pricing)
        ? service.pricing.map((p: any) => ({ ...p }))
        : [],
      timeline_steps: Array.isArray(service.timeline_steps)
        ? service.timeline_steps.map((s: any) => ({ ...s }))
        : [],
    });
    setActiveModalTab("basic");
    setModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const method = modalMode === "create" ? "POST" : "PUT";
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
        text: `Đã ${modalMode === "create" ? "thêm mới" : "cập nhật"} dịch vụ thành công!`,
      });
      setModalOpen(false);
      onRefresh();
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

  const handleDeleteService = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Không thể xóa dịch vụ này");
      }
      setNotification({
        type: "success",
        text: `Đã xóa dịch vụ "${id}" thành công!`,
      });
      setDeleteConfirmId(null);
      onRefresh();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err.message || "Lỗi khi xóa dịch vụ",
      });
    }
  };

  // Filter list
  const filteredServices = services.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.id.toLowerCase().includes(q) ||
      (s.title_en && s.title_en.toLowerCase().includes(q)) ||
      (s.title_vi && s.title_vi.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
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

      {/* Toolbar: Search & Create Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên dịch vụ hoặc mã slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden md:inline">
            Tổng số: <strong className="text-white">{services.length}</strong> dịch vụ
          </span>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Dịch Vụ Mới</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between hover:border-slate-600 transition-all shadow-lg group"
          >
            <div>
              {/* Service Hero Image */}
              <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                <img
                  src={service.hero_image}
                  alt={service.title_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-amber-400 border border-amber-400/30">
                    /{service.id}
                  </span>
                </div>
              </div>

              {/* Service Content */}
              <div className="p-5 space-y-3">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {service.title_vi || service.title_en}
                  </h3>
                  <p className="text-xs font-medium text-amber-400/90 italic">
                    {service.title_en}
                  </p>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {service.intro_vi || service.intro_en}
                </p>

                {/* Badges: Features, Pricing, Steps */}
                <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700">
                    🎯 {service.features_vi?.length || service.features_en?.length || 0} Tính năng
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700">
                    💰 {service.pricing?.length || 0} Gói giá
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700">
                    ⏱️ {service.timeline_steps?.length || 0} Bước quy trình
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-900/60 border-t border-slate-700/60 flex items-center justify-between gap-2">
              <Link
                href={`/en/services/${service.id}`}
                target="_blank"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Xem Live</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmId(service.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors border border-red-500/20"
                  title="Xóa dịch vụ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold">Xác Nhận Xóa Dịch Vụ?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa dịch vụ{" "}
              <strong className="text-white font-mono">"{deleteConfirmId}"</strong>?
              Thao tác này sẽ gỡ dịch vụ khỏi danh mục và trang chi tiết của website.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={() => handleDeleteService(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-lg shadow-red-600/30"
              >
                Đồng Ý Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F172A] border border-slate-700 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-6 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {modalMode === "create" ? "Thêm Mới" : "Cập Nhật"} &bull; Services CMS
                </span>
                <h2 className="text-lg font-bold text-white">
                  {modalMode === "create"
                    ? "Tạo Dịch Vụ Thi Công Mới"
                    : `Chỉnh Sửa Dịch Vụ: ${formData.title_vi || formData.id}`}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-800 px-6 bg-[#0F172A] overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveModalTab("basic")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
                  activeModalTab === "basic"
                    ? "border-amber-400 text-amber-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Thông Tin Cơ Bản</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("features")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
                  activeModalTab === "features"
                    ? "border-amber-400 text-amber-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Tính Năng &amp; Năng Lực</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("pricing")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
                  activeModalTab === "pricing"
                    ? "border-amber-400 text-amber-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Gói Báo Giá (Pricing Tiers)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("timeline")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
                  activeModalTab === "timeline"
                    ? "border-amber-400 text-amber-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Quy Trình Thi Công (Steps)</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveService} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto bg-[#0F172A]">
              {/* TAB 1: BASIC INFO */}
              {activeModalTab === "basic" && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      Mã định danh (Slug ID) *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={modalMode === "edit"}
                      placeholder="ví dụ: renovations, bathrooms, roofing"
                      value={formData.id}
                      onChange={(e) =>
                        setFormData({ ...formData, id: e.target.value.toLowerCase().trim() })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono disabled:opacity-50"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Đường dẫn trang: /services/{formData.id || "slug"}
                    </span>
                  </div>

                  <ImageUpload
                    label="Ảnh đại diện dịch vụ (Hero Image)"
                    required
                    value={formData.hero_image}
                    onChange={(url) =>
                      setFormData({ ...formData, hero_image: url })
                    }
                    aspectRatio="wide"
                    helperText="Ảnh lớn hiển thị trên banner đầu trang chi tiết dịch vụ"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        Tên dịch vụ (Tiếng Việt) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ví dụ: Cải Tạo Nhà Trọn Gói"
                        value={formData.title_vi}
                        onChange={(e) =>
                          setFormData({ ...formData, title_vi: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        Tên dịch vụ (Tiếng Anh) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Full Home Renovations"
                        value={formData.title_en}
                        onChange={(e) =>
                          setFormData({ ...formData, title_en: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      Giới thiệu tổng quan (Tiếng Việt) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Mô tả năng lực, cam kết và đối tượng công trình..."
                      value={formData.intro_vi}
                      onChange={(e) =>
                        setFormData({ ...formData, intro_vi: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      Giới thiệu tổng quan (Tiếng Anh) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Service overview and scope description..."
                      value={formData.intro_en}
                      onChange={(e) =>
                        setFormData({ ...formData, intro_en: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: FEATURES */}
              {activeModalTab === "features" && (
                <div className="space-y-6 text-xs">
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400">
                    Liệt kê các điểm mạnh nổi bật, hạng mục chi tiết mà NS Building thực hiện cho dịch vụ này.
                  </div>

                  {/* Vietnamese Features */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 uppercase tracking-wider">
                        🇻🇳 Tính Năng Chính (Tiếng Việt)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            features_vi: [...formData.features_vi, ""],
                          })
                        }
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Thêm Mục</span>
                      </button>
                    </div>

                    {formData.features_vi.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={f}
                          onChange={(e) => {
                            const updated = [...formData.features_vi];
                            updated[idx] = e.target.value;
                            setFormData({ ...formData, features_vi: updated });
                          }}
                          placeholder={`Tính năng ${idx + 1}`}
                          className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.features_vi.filter(
                              (_, i) => i !== idx
                            );
                            setFormData({ ...formData, features_vi: updated });
                          }}
                          className="p-2 text-slate-500 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* English Features */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 uppercase tracking-wider">
                        🇳🇿 Key Features (Tiếng Anh)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            features_en: [...formData.features_en, ""],
                          })
                        }
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>
                    </div>

                    {formData.features_en.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={f}
                          onChange={(e) => {
                            const updated = [...formData.features_en];
                            updated[idx] = e.target.value;
                            setFormData({ ...formData, features_en: updated });
                          }}
                          placeholder={`Feature ${idx + 1}`}
                          className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.features_en.filter(
                              (_, i) => i !== idx
                            );
                            setFormData({ ...formData, features_en: updated });
                          }}
                          className="p-2 text-slate-500 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PRICING TIERS */}
              {activeModalTab === "pricing" && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400">
                      Bảng giá tham khảo giúp khách hàng dễ dàng hình dung ngân sách dự trù (NZD).
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          pricing: [
                            ...formData.pricing,
                            {
                              name_en: "New Package",
                              name_vi: "Gói Mới",
                              desc_en: "Description",
                              desc_vi: "Mô tả gói",
                              range: "$15,000 – $30,000",
                              unit_en: "Package",
                              unit_vi: "Gói",
                              popular: false,
                            },
                          ],
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Gói Giá</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.pricing.map((tier, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-400">
                            Gói #{idx + 1}
                          </span>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                              <input
                                type="checkbox"
                                checked={tier.popular}
                                onChange={(e) => {
                                  const updated = [...formData.pricing];
                                  updated[idx].popular = e.target.checked;
                                  setFormData({ ...formData, pricing: updated });
                                }}
                                className="rounded bg-slate-800 border-slate-600 text-amber-400"
                              />
                              <span>Huy hiệu Phổ Biến (Popular)</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.pricing.filter(
                                  (_, i) => i !== idx
                                );
                                setFormData({ ...formData, pricing: updated });
                              }}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">
                              Tên gói (Tiếng Việt)
                            </label>
                            <input
                              type="text"
                              value={tier.name_vi}
                              onChange={(e) => {
                                const updated = [...formData.pricing];
                                updated[idx].name_vi = e.target.value;
                                setFormData({ ...formData, pricing: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">
                              Tên gói (Tiếng Anh)
                            </label>
                            <input
                              type="text"
                              value={tier.name_en}
                              onChange={(e) => {
                                const updated = [...formData.pricing];
                                updated[idx].name_en = e.target.value;
                                setFormData({ ...formData, pricing: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">
                              Mức giá (Range NZD)
                            </label>
                            <input
                              type="text"
                              value={tier.range}
                              onChange={(e) => {
                                const updated = [...formData.pricing];
                                updated[idx].range = e.target.value;
                                setFormData({ ...formData, pricing: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-amber-400 font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">
                              Mô tả hạng mục (Tiếng Việt)
                            </label>
                            <input
                              type="text"
                              value={tier.desc_vi}
                              onChange={(e) => {
                                const updated = [...formData.pricing];
                                updated[idx].desc_vi = e.target.value;
                                setFormData({ ...formData, pricing: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">
                              Mô tả hạng mục (Tiếng Anh)
                            </label>
                            <input
                              type="text"
                              value={tier.desc_en}
                              onChange={(e) => {
                                const updated = [...formData.pricing];
                                updated[idx].desc_en = e.target.value;
                                setFormData({ ...formData, pricing: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: TIMELINE STEPS */}
              {activeModalTab === "timeline" && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400">
                      Các bước quy trình triển khai công việc thực tế từ lúc khảo sát đến bàn giao.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          timeline_steps: [
                            ...formData.timeline_steps,
                            {
                              step: `0${formData.timeline_steps.length + 1}`,
                              title_en: "New Step",
                              title_vi: "Bước Mới",
                              desc_en: "Step description",
                              desc_vi: "Mô tả bước",
                            },
                          ],
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Bước Quy Trình</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.timeline_steps.map((st, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-400 font-mono">
                            Bước {st.step || `0${idx + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.timeline_steps.filter(
                                (_, i) => i !== idx
                              );
                              setFormData({ ...formData, timeline_steps: updated });
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="sm:col-span-1">
                            <label className="block text-[11px] text-slate-400 mb-1">
                              Số bước (e.g. 01)
                            </label>
                            <input
                              type="text"
                              value={st.step}
                              onChange={(e) => {
                                const updated = [...formData.timeline_steps];
                                updated[idx].step = e.target.value;
                                setFormData({ ...formData, timeline_steps: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="block text-[11px] text-slate-400 mb-1">
                              Tiêu đề bước (Tiếng Việt)
                            </label>
                            <input
                              type="text"
                              value={st.title_vi}
                              onChange={(e) => {
                                const updated = [...formData.timeline_steps];
                                updated[idx].title_vi = e.target.value;
                                setFormData({ ...formData, timeline_steps: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            Mô tả bước (Tiếng Việt)
                          </label>
                          <textarea
                            rows={2}
                            value={st.desc_vi}
                            onChange={(e) => {
                              const updated = [...formData.timeline_steps];
                              updated[idx].desc_vi = e.target.value;
                              setFormData({ ...formData, timeline_steps: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2"
                >
                  {saving ? (
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{saving ? "Đang Lưu..." : "Lưu Dịch Vụ Này"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
