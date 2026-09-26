"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  ArrowLeft,
  Save,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Layers,
  MapPin,
  Calendar,
  Image as ImageIcon,
  SlidersHorizontal,
  Link as LinkIcon,
} from "lucide-react";
import ImageUpload from "./ImageUpload";
import BeforeAfterSlider from "../BeforeAfterSlider";

interface ProjectEditorProps {
  initialId?: string;
  isNew?: boolean;
}

const CATEGORIES = [
  { id: "renovations", label: "Cải Tạo Trọn Gói" },
  { id: "bathrooms", label: "Phòng Tắm" },
  { id: "cabinets", label: "Tủ Bếp & Đồ Gỗ" },
  { id: "flooring", label: "Sàn Nhà" },
  { id: "doors", label: "Cửa & Mộc" },
  { id: "painting", label: "Sơn Bả" },
  { id: "hiring", label: "Cho Thuê Thiết Bị" },
  { id: "maintenance", label: "Bảo Trì & Sửa Chữa" },
];

export default function ProjectEditor({ initialId, isNew = false }: ProjectEditorProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const defaultFormState = {
    id: initialId || "",
    title_en: "",
    title_vi: "",
    suburb: "Auckland, New Zealand",
    category: "renovations",
    completed_year: new Date().getFullYear().toString(),
    before_image: "",
    after_image: "",
    description_en: "",
    description_vi: "",
  };

  const [formData, setFormData] = useState(defaultFormState);

  useEffect(() => {
    if (!isNew && initialId) {
      setLoading(true);
      fetch(`/api/admin/projects?id=${encodeURIComponent(initialId)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Không thể tải thông tin dự án");
          return res.json();
        })
        .then((data) => {
          setFormData({
            id: data.id || initialId,
            title_en: data.title_en || "",
            title_vi: data.title_vi || "",
            suburb: data.suburb || "Auckland, New Zealand",
            category: data.category || "renovations",
            completed_year: data.completed_year || new Date().getFullYear().toString(),
            before_image: data.before_image || "",
            after_image: data.after_image || "",
            description_en: data.description_en || "",
            description_vi: data.description_vi || "",
          });
        })
        .catch((err) => {
          setNotification({
            type: "error",
            text: err.message || "Lỗi khi tải dữ liệu dự án",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [initialId, isNew]);

  const handleCopySlug = () => {
    const adminUrl = typeof window !== "undefined" ? `${window.location.origin}/admin/projects/${formData.id}` : "";
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
        text: "Vui lòng nhập mã định danh (Slug ID) cho dự án.",
      });
      return;
    }

    if (!formData.before_image || !formData.after_image) {
      setNotification({
        type: "error",
        text: "Vui lòng tải lên hoặc cung cấp đầy đủ cả ảnh Trước (Before) và ảnh Sau (After) cho dự án.",
      });
      return;
    }

    setSaving(true);
    setNotification(null);

    try {
      const method = isNew ? "POST" : "PUT";
      const res = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Không thể lưu thông tin dự án");
      }

      setNotification({
        type: "success",
        text: `Đã ${isNew ? "thêm mới" : "cập nhật"} dự án thành công!`,
      });

      if (isNew) {
        router.push(`/admin/projects/${formData.id}`);
      }
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err.message || "Đã xảy ra lỗi khi lưu dự án",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(formData.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Không thể xóa công trình này");
      }
      router.push("/admin?tab=projects");
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err.message || "Lỗi khi xóa công trình",
      });
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center animate-bounce shadow-xl shadow-amber-400/20">
          NS
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full" />
          <span>Đang tải thông tin dự án...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin?tab=projects"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Danh sách dự án</span>
          </Link>

          <div className="hidden sm:block h-5 w-px bg-slate-700" />

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Admin</span>
            <span className="text-slate-600">/</span>
            <Link href="/admin?tab=projects" className="text-slate-400 hover:text-white transition-colors">
              Dự Án
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
                href={`/vi/projects/${formData.id}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                title="Xem trang công khai Tiếng Việt"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Xem Live (VI)</span>
              </Link>
              <Link
                href={`/en/projects/${formData.id}`}
                target="_blank"
                className="hidden md:flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                title="Xem trang công khai English"
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
              title="Xóa dự án"
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
            <span>{saving ? "Đang lưu..." : isNew ? "Tạo Dự Án" : "Lưu Thay Đổi"}</span>
          </button>
        </div>
      </header>

      {/* Main Form */}
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
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                Slug Quản Lý Riêng
              </span>
              <span className="text-xs text-slate-400">Trang quản lý dự án độc lập</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-xs sm:text-sm font-mono font-bold text-white bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                /admin/projects/{formData.id || "[slug]"}
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
              <span className="text-slate-300 font-mono">/projects/{formData.id || "[slug]"}</span>
            </div>
            {!isNew && formData.id && (
              <Link
                href={`/vi/projects/${formData.id}`}
                target="_blank"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Xem trên website</span>
              </Link>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: BEFORE & AFTER IMAGES (MOST IMPORTANT) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                  01
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Ảnh Trước &amp; Sau Thi Công (Before / After)</h3>
                  <p className="text-slate-400 text-xs">Cặp ảnh để hiển thị thanh trượt so sánh chất lượng thực tế</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before Image */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-red-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    ẢNH TRƯỚC (BEFORE / HIỆN TRẠNG CŨ) *
                  </span>
                </div>
                <ImageUpload
                  label="Tải ảnh Trước thi công"
                  required
                  value={formData.before_image}
                  onChange={(url) => setFormData({ ...formData, before_image: url })}
                  aspectRatio="video"
                  helperText="Tải ảnh hiện trạng ban đầu của căn nhà hoặc phòng cũ"
                />
              </div>

              {/* After Image */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    ẢNH SAU (AFTER / NS BUILDING HOÀN THIỆN) *
                  </span>
                </div>
                <ImageUpload
                  label="Tải ảnh Sau thi công"
                  required
                  value={formData.after_image}
                  onChange={(url) => setFormData({ ...formData, after_image: url })}
                  aspectRatio="video"
                  helperText="Tải ảnh sau khi đội ngũ NS Building hoàn thiện nội thất"
                />
              </div>
            </div>

            {/* Live Slider Preview */}
            {formData.before_image && formData.after_image && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Xem Thử Thanh Trượt So Sánh (Live Preview):</span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 max-w-2xl mx-auto shadow-2xl">
                  <BeforeAfterSlider
                    beforeImage={formData.before_image}
                    afterImage={formData.after_image}
                    beforeLabel="TRƯỚC : Hiện Trạng Cũ"
                    afterLabel="SAU : NS Building Hoàn Thiện"
                    projectName={formData.title_vi || formData.title_en || "Dự án xem trước"}
                    location={formData.suburb}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Project Metadata */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                02
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Thông Tin Chi Tiết Dự Án</h3>
                <p className="text-slate-400 text-xs">Mã định danh slug, tiêu đề song ngữ, danh mục và địa điểm</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Mã định danh (Slug ID) *
                </label>
                <input
                  type="text"
                  required
                  disabled={!isNew}
                  placeholder="ví dụ: epsom-custom-kitchen-cabinetry"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id: e.target.value.toLowerCase().trim().replace(/[^a-z0-9_-]/g, ""),
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono disabled:opacity-60 focus:outline-none focus:border-amber-400"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Đường dẫn: /projects/{formData.id || "slug"}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Hạng Mục Công Trình *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Khu vực / Suburb (Auckland, NZ) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Takapuna, North Shore"
                  value={formData.suburb}
                  onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Tên dự án (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Cải Tạo Biệt Thự Takapuna"
                    value={formData.title_vi}
                    onChange={(e) => setFormData({ ...formData, title_vi: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Tên dự án (Tiếng Anh) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Takapuna Luxury Renovation"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Năm Hoàn Thành
                </label>
                <input
                  type="text"
                  placeholder="2026"
                  value={formData.completed_year}
                  onChange={(e) => setFormData({ ...formData, completed_year: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Mô tả dự án (Tiếng Việt)
                </label>
                <textarea
                  rows={4}
                  placeholder="Mô tả phạm vi công việc, kỹ thuật thi công, vật liệu sử dụng..."
                  value={formData.description_vi}
                  onChange={(e) => setFormData({ ...formData, description_vi: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Mô tả dự án (Tiếng Anh)
                </label>
                <textarea
                  rows={4}
                  placeholder="Scope of work, structural alterations, premium finishes..."
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Mã quản lý: <strong className="text-white font-mono">/admin/projects/{formData.id || "slug"}</strong>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin?tab=projects"
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
                <span>{saving ? "Đang lưu..." : isNew ? "Tạo Dự Án Mới" : "Lưu Thay Đổi"}</span>
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
              <h3 className="text-base font-bold">Xác Nhận Xóa Dự Án?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa công trình{" "}
              <strong className="text-white font-mono">"{formData.id}"</strong>?
              Thao tác này sẽ gỡ công trình khỏi danh mục và trang web.
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
