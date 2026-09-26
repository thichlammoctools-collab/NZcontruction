"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Calendar,
  User,
  AlertTriangle,
} from "lucide-react";

interface PostsManagerProps {
  posts: any[];
  onRefresh: () => void;
}

export default function PostsManager({ posts, onRefresh }: PostsManagerProps) {
  const [search, setSearch] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleDeletePost = async (id: string) => {
    setIsDeleting(true);
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
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title_en?.toLowerCase().includes(q) ||
      p.title_vi?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q)
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
            placeholder="Tìm theo tiêu đề bài viết hoặc mã slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden md:inline">
            Tổng số: <strong className="text-white">{posts.length}</strong> bài viết
          </span>
          <Link
            href="/admin/posts/new"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Viết Bài Mới</span>
          </Link>
        </div>
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between hover:border-amber-400/50 transition-all shadow-lg group"
          >
            <div>
              <Link
                href={`/admin/posts/${post.id}`}
                className="block relative aspect-[16/9] w-full bg-slate-950 overflow-hidden cursor-pointer"
                title="Bấm để mở trang riêng sửa bài viết"
              >
                <img
                  src={post.image}
                  alt={post.title_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md text-[10px] font-mono font-bold text-amber-400 border border-amber-400/30">
                    /{post.id}
                  </span>
                </div>
              </Link>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{post.date}</span>
                  <span className="text-slate-600">&bull;</span>
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{post.author}</span>
                </div>

                <Link href={`/admin/posts/${post.id}`} className="hover:text-amber-400 transition-colors block">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {post.title_vi || post.title_en}
                  </h3>
                </Link>
                <p className="text-xs text-amber-400/80 italic font-medium">
                  {post.title_en}
                </p>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed pt-1">
                  {post.summary_vi || post.summary_en}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 border-t border-slate-700/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Live:</span>
                <Link
                  href={`/vi/posts/${post.id}`}
                  target="_blank"
                  className="text-amber-400 hover:text-amber-300 font-semibold underline transition-colors"
                >
                  VI
                </Link>
                <span>|</span>
                <Link
                  href={`/en/posts/${post.id}`}
                  target="_blank"
                  className="hover:text-white transition-colors"
                >
                  EN
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-amber-400/30"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sửa (Trang riêng)</span>
                </Link>
                <button
                  onClick={() => setDeleteConfirmId(post.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors border border-red-500/20"
                  title="Xóa bài viết"
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
              <h3 className="text-base font-bold">Xác Nhận Xóa Bài Viết?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa bài viết{" "}
              <strong className="text-white font-mono">&quot;{deleteConfirmId}&quot;</strong>?
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
                onClick={() => handleDeletePost(deleteConfirmId)}
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
