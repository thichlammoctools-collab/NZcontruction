"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Calendar,
  User,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";
import ImageUpload from "./ImageUpload";

interface PostsManagerProps {
  posts: any[];
  onRefresh: () => void;
}

export default function PostsManager({ posts, onRefresh }: PostsManagerProps) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
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
    category: "renovations",
    image: "",
    summary_en: "",
    summary_vi: "",
    author: "Nguyễn Sơn",
    date: new Date().toISOString().split("T")[0],
  };

  const [formData, setFormData] = useState(defaultFormState);

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData(defaultFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (post: any) => {
    setModalMode("edit");
    setFormData({
      id: post.id,
      title_en: post.title_en || "",
      title_vi: post.title_vi || "",
      category: post.category || "renovations",
      image: post.image || "",
      summary_en: post.summary_en || "",
      summary_vi: post.summary_vi || "",
      author: post.author || "Nguyễn Sơn",
      date: post.date || new Date().toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      setNotification({
        type: "error",
        text: "Vui lòng tải lên hoặc cung cấp ảnh đại diện cho bài viết.",
      });
      return;
    }

    setSaving(true);
    setNotification(null);

    try {
      const method = modalMode === "create" ? "POST" : "PUT";
      const res = await fetch("/api/admin/posts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Không thể lưu bài viết");
      }

      setNotification({
        type: "success",
        text: `Đã ${modalMode === "create" ? "đăng bài mới" : "cập nhật bài viết"} thành công!`,
      });
      setModalOpen(false);
      onRefresh();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err.message || "Đã xảy ra lỗi khi lưu bài viết",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/posts?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Không thể xóa bài viết này");
      }
      setNotification({
        type: "success",
        text: "Đã xóa bài viết thành công!",
      });
      setDeleteConfirmId(null);
      onRefresh();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err.message || "Lỗi khi xóa bài viết",
      });
    }
  };

  const filteredPosts = posts.filter((p) => {
    const q = search.toLowerCase();
    return (
      !search ||
      p.title_en?.toLowerCase().includes(q) ||
      p.title_vi?.toLowerCase().includes(q)
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

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden md:inline">
            Tổng số: <strong className="text-white">{posts.length}</strong> bài viết
          </span>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Viết Bài Mới</span>
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between hover:border-slate-600 transition-all shadow-lg group"
          >
            <div>
              <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{post.date}</span>
                  <span className="text-slate-600">&bull;</span>
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{post.author}</span>
                </div>

                <h3 className="text-base font-bold text-white leading-tight">
                  {post.title_vi || post.title_en}
                </h3>
                <p className="text-xs text-amber-400/80 italic font-medium">
                  {post.title_en}
                </p>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed pt-1">
                  {post.summary_vi || post.summary_en}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 border-t border-slate-700/60 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(post)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Sửa</span>
              </button>
              <button
                onClick={() => setDeleteConfirmId(post.id)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors border border-red-500/20"
                title="Xóa bài viết"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
              <h3 className="text-base font-bold">Xác Nhận Xóa Bài Viết?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa bài viết này không?
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
                onClick={() => handleDeletePost(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-lg shadow-red-600/30"
              >
                Đồng Ý Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Post Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {modalMode === "create" ? "Thêm Mới" : "Cập Nhật"} &bull; Blog CMS
                </span>
                <h2 className="text-lg font-bold text-white">
                  {modalMode === "create" ? "Viết Bài / Cẩm Nang Mới" : "Chỉnh Sửa Bài Viết"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Tiêu đề bài viết (Tiếng Việt) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: 5 Lưu Ý Khi Cải Tạo Nhà Cổ Auckland"
                  value={formData.title_vi}
                  onChange={(e) =>
                    setFormData({ ...formData, title_vi: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Tiêu đề bài viết (Tiếng Anh) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Tips for Renovating a Villa in Auckland"
                  value={formData.title_en}
                  onChange={(e) =>
                    setFormData({ ...formData, title_en: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <ImageUpload
                label="Ảnh đại diện bài viết"
                required
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                aspectRatio="wide"
                helperText="Hình ảnh hiển thị đầu bài viết và trong danh sách tin tức"
              />

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Tóm tắt nội dung (Tiếng Việt)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tóm tắt ngắn gọn hiển thị cho người đọc..."
                  value={formData.summary_vi}
                  onChange={(e) =>
                    setFormData({ ...formData, summary_vi: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Tóm tắt nội dung (Tiếng Anh)
                </label>
                <textarea
                  rows={2}
                  placeholder="Short summary for SEO and readers..."
                  value={formData.summary_en}
                  onChange={(e) =>
                    setFormData({ ...formData, summary_en: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

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
                  <span>{saving ? "Đang Lưu..." : "Lưu & Đăng Bài"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
