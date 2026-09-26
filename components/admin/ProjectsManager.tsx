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
  AlertTriangle,
  Eye,
} from "lucide-react";
import BeforeAfterSlider from "../BeforeAfterSlider";

interface ProjectsManagerProps {
  projects: any[];
  onRefresh: () => void;
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

  const [sliderPreviewProject, setSliderPreviewProject] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleDeleteProject = async (id: string) => {
    setIsDeleting(true);
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
    } finally {
      setIsDeleting(false);
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
      p.suburb?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q);
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

      {/* Guide Banner for Before & After */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs flex items-start gap-3.5">
        <Layers className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-300 text-sm">
            Quản Lý &amp; Cập Nhật Hình Ảnh Before &amp; After (Trước &amp; Sau Thi Công)
          </h4>
          <p className="text-slate-300 text-xs leading-relaxed">
            Mỗi công trình hiển thị trên website đều gồm bộ đôi <strong>Ảnh Trước (Before)</strong> và <strong>Ảnh Sau (After)</strong>. 
            Bấm vào nút <strong className="text-amber-400">"Sửa (Trang riêng)"</strong> để chuyển tới trang quản lý riêng biệt với đường link SLUG độc lập.
          </p>
        </div>
      </div>

      {/* Toolbar: Search, Category Filters, and Add Button */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên công trình, khu vực Suburb, slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden md:inline">
              Hiển thị: <strong className="text-white">{filteredProjects.length}</strong> / {projects.length} dự án
            </span>
            <Link
              href="/admin/projects/new"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-400/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Dự Án Mới</span>
            </Link>
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
            className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between hover:border-amber-400/50 transition-all shadow-lg group"
          >
            <div>
              {/* Dual Thumbnail: Before & After */}
              <Link
                href={`/admin/projects/${project.id}`}
                className="relative aspect-[16/10] w-full bg-slate-950 flex overflow-hidden cursor-pointer group/thumb"
                title="Bấm để mở trang riêng sửa thông tin và đổi ảnh Before/After"
              >
                {/* Before Thumbnail */}
                <div className="w-1/2 h-full relative border-r border-slate-900">
                  <img
                    src={project.before_image}
                    alt={`${project.title_en} Before`}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80";
                    }}
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
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                    Sau
                  </span>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Mở trang sửa</span>
                  </span>
                </div>

                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-400/30">
                    /{project.id}
                  </span>
                </div>
              </Link>

              {/* Project Info */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">{project.suburb}</span>
                  <span className="text-slate-600">&bull;</span>
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{project.completed_year || "2026"}</span>
                </div>

                <Link href={`/admin/projects/${project.id}`} className="hover:text-amber-400 transition-colors block">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {project.title_vi || project.title_en}
                  </h3>
                </Link>
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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSliderPreviewProject(project)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem Trượt</span>
                </button>
                <span className="text-slate-600">&bull;</span>
                <Link
                  href={`/vi/projects/${project.id}`}
                  target="_blank"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  title="Xem Live trên website"
                >
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                  <span>Live</span>
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-amber-400/30"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sửa (Trang riêng)</span>
                </Link>
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

            <div className="flex items-center justify-between pt-2">
              <Link
                href={`/admin/projects/${sliderPreviewProject.id}`}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Mở trang sửa dự án này</span>
              </Link>
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
                disabled={isDeleting}
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-bold transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDeleteProject(deleteConfirmId)}
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
