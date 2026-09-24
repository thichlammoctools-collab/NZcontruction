"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  X,
  Layers,
  Calendar,
  MapPin,
  Image as ImageIcon,
  AlertTriangle,
  SlidersHorizontal,
  Eye,
} from "lucide-react";
import BeforeAfterSlider from "../BeforeAfterSlider";
import ImageUpload from "./ImageUpload";

interface ProjectsManagerProps {
  projects: any[];
  onRefresh: () => void;
  openCreateModalDirectly?: boolean;
}

const CATEGORIES = [
  { id: "all", label: "Tất Cả" },
  { id: "renovations", label: "Cải Tạo Trọn Gói" },
  { id: "bathrooms", label: "Phòng Tắm" },
  { id: "cabinets", label: "Tủ Bếp & Đồ Gỗ" },
  { id: "flooring", label: "Sàn Nhà" },
  { id: "doors", label: "Cửa & Mộc" },
  { id: "painting", label: "Sơn Bả" },
  { id: "hiring", label: "Cho Thuê Thiết Bị" },
];

export default function ProjectsManager({
  projects,
  onRefresh,
}: ProjectsManagerProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [sliderPreviewProject, setSliderPreviewProject] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const defaultFormState = {
    id: "",
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

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData(defaultFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (project: any) => {
    setModalMode("edit");
    setFormData({
      id: project.id,
      title_en: project.title_en || "",
      title_vi: project.title_vi || "",
      suburb: project.suburb || "",
      category: project.category || "renovations",
      completed_year: project.completed_year || "2026",
      before_image: project.before_image || "",
      after_image: project.after_image || "",
      description_en: project.description_en || "",
      description_vi: project.description_vi || "",
    });
    setModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.before_image || !formData.after_image) {
      setNotification({
        type: "error",
        text: "Vui lòng tải lên hoặc cung cấp đầy đủ cả ảnh Trước và ảnh Sau cho dự án.",
      });
      return;
    }

    setSaving(true);
    setNotification(null);

    try {
      const method = modalMode === "create" ? "POST" : "PUT";
      const res = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Không thể lưu thông tin công trình");
      }

      setNotification({
        type: "success",
        text: `Đã ${modalMode === "create" ? "thêm mới" : "cập nhật"} dự án thành công!`,
      });
      setModalOpen(false);
      onRefresh();
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

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Không thể xóa công trình này");
      }
      setNotification({
        type: "success",
        text: "Đã xóa công trình thành công!",
      });
      setDeleteConfirmId(null);
      onRefresh();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err.message || "Lỗi khi xóa công trình",
      });
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      activeCategory === "all" || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      p.title_en?.toLowerCase().includes(q) ||
      p.title_vi?.toLowerCase().includes(q) ||
      p.suburb?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
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

      {/* Toolbar: Search, Category Filters, and Add Button */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên công trình, khu vực Suburb..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden md:inline">
              Hiển thị: <strong className="text-white">{filteredProjects.length}</strong> / {projects.length} dự án
            </span>
            <button
              onClick={handleOpenCreate}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-400/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Dự Án Mới</span>
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                activeCategory === cat.id
                  ? "bg-amber-400 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-700/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between hover:border-slate-600 transition-all shadow-lg group"
          >
            <div>
              {/* Dual Thumbnail: Before & After */}
              <div className="relative aspect-[16/10] w-full bg-slate-950 flex overflow-hidden">
                {/* Before Thumbnail */}
                <div className="w-1/2 h-full relative border-r border-slate-900">
                  <img
                    src={project.before_image}
                    alt={`${project.title_en} Before`}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[9px] font-bold text-slate-300 uppercase">
                    Trước
                  </span>
                </div>
                {/* After Thumbnail */}
                <div className="w-1/2 h-full relative">
                  <img
                    src={project.after_image}
                    alt={`${project.title_en} After`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                    Sau
                  </span>
                </div>

                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-400/30">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">{project.suburb}</span>
                  <span className="text-slate-600">&bull;</span>
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{project.completed_year || "2026"}</span>
                </div>

                <h3 className="text-base font-bold text-white leading-tight">
                  {project.title_vi || project.title_en}
                </h3>
                <p className="text-xs text-amber-400/80 italic font-medium">
                  {project.title_en}
                </p>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed pt-1">
                  {project.description_vi || project.description_en}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-900/60 border-t border-slate-700/60 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSliderPreviewProject(project)}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Thanh Trượt</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(project)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmId(project.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors border border-red-500/20"
                  title="Xóa công trình"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Split Slider Preview Modal */}
      {sliderPreviewProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Trình Xem Trước Tương Tác Before / After
                </span>
                <h3 className="text-base font-bold text-white">
                  {sliderPreviewProject.title_vi || sliderPreviewProject.title_en}
                </h3>
              </div>
              <button
                onClick={() => setSliderPreviewProject(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
              <BeforeAfterSlider
                beforeImage={sliderPreviewProject.before_image}
                afterImage={sliderPreviewProject.after_image}
                beforeLabel="TRƯỚC : Hiện Trạng Cũ"
                afterLabel="SAU : NS Building Hoàn Thiện"
                projectName={sliderPreviewProject.title_vi || sliderPreviewProject.title_en}
                location={sliderPreviewProject.suburb}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSliderPreviewProject(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold">Xác Nhận Xóa Dự Án?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa công trình{" "}
              <strong className="text-white font-mono">"{deleteConfirmId}"</strong>?
              Công trình sẽ không còn hiển thị trên danh mục dự án trang chủ.
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
                onClick={() => handleDeleteProject(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-lg shadow-red-600/30"
              >
                Đồng Ý Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {modalMode === "create" ? "Thêm Mới" : "Cập Nhật"} &bull; Projects CMS
                </span>
                <h2 className="text-lg font-bold text-white">
                  {modalMode === "create"
                    ? "Thêm Công Trình Mới (Before & After)"
                    : `Chỉnh Sửa Công Trình: ${formData.title_vi || formData.id}`}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Tên dự án (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Cải tạo biệt thự Remuera"
                    value={formData.title_vi}
                    onChange={(e) =>
                      setFormData({ ...formData, title_vi: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Tên dự án (Tiếng Anh) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Remuera Architectural Modernisation"
                    value={formData.title_en}
                    onChange={(e) =>
                      setFormData({ ...formData, title_en: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Khu vực tại New Zealand (Suburb) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Remuera, Auckland"
                    value={formData.suburb}
                    onChange={(e) =>
                      setFormData({ ...formData, suburb: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Danh mục công trình
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="renovations">Cải tạo trọn gói (Renovations)</option>
                    <option value="bathrooms">Phòng tắm (Bathrooms)</option>
                    <option value="cabinets">Tủ bếp (Cabinets)</option>
                    <option value="flooring">Sàn nhà (Flooring)</option>
                    <option value="doors">Cửa &amp; Mộc (Doors)</option>
                    <option value="painting">Sơn bả (Painting)</option>
                    <option value="hiring">Cho thuê thiết bị (Hiring)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Năm hoàn thành
                  </label>
                  <input
                    type="text"
                    placeholder="2026"
                    value={formData.completed_year}
                    onChange={(e) =>
                      setFormData({ ...formData, completed_year: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-800">
                <span className="font-bold text-amber-400 block uppercase tracking-wider text-[11px]">
                  Hình Ảnh So Sánh Before &amp; After (Hai Hình Ảnh)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageUpload
                    label="Ảnh Trước Khi Sửa (Before Image)"
                    required
                    value={formData.before_image}
                    onChange={(url) =>
                      setFormData({ ...formData, before_image: url })
                    }
                    aspectRatio="video"
                    helperText="Tải ảnh hiện trạng công trình trước khi thi công"
                  />

                  <ImageUpload
                    label="Ảnh Sau Khi Hoàn Thiện (After Image)"
                    required
                    value={formData.after_image}
                    onChange={(url) =>
                      setFormData({ ...formData, after_image: url })
                    }
                    aspectRatio="video"
                    helperText="Tải ảnh công trình sau khi hoàn thiện"
                  />
                </div>

                {/* Instant Dual Preview */}
                {formData.before_image && formData.after_image && (
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                      Xem trước thanh trượt so sánh trực tiếp:
                    </span>
                    <div className="max-w-xl mx-auto rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-1">
                      <BeforeAfterSlider
                        beforeImage={formData.before_image}
                        afterImage={formData.after_image}
                        beforeLabel="TRƯỚC"
                        afterLabel="SAU"
                        projectName={formData.title_vi || formData.title_en}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Mô tả công việc thực hiện (Tiếng Việt)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mô tả các hạng mục kết cấu, vật tư đã hoàn thiện..."
                    value={formData.description_vi}
                    onChange={(e) =>
                      setFormData({ ...formData, description_vi: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Mô tả công việc thực hiện (Tiếng Anh)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Description of renovation work done..."
                    value={formData.description_en}
                    onChange={(e) =>
                      setFormData({ ...formData, description_en: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white leading-relaxed"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Hủy Bỏ
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
                  <span>{saving ? "Đang Lưu..." : "Lưu & Xuất Bản Dự Án"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
