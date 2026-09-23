"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderPlus,
  FileText,
  Home,
  LogOut,
  Plus,
  CheckCircle2,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  Phone,
  Mail,
  SlidersHorizontal,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"projects" | "posts" | "settings">("projects");
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Project Form state
  const [projectForm, setProjectForm] = useState({
    title_en: "",
    title_vi: "",
    suburb: "",
    category: "renovations",
    before_image: "",
    after_image: "",
    description_en: "",
    description_vi: "",
  });
  const [projectSaved, setProjectSaved] = useState(false);

  // New Post Form state
  const [postForm, setPostForm] = useState({
    title_en: "",
    title_vi: "",
    category: "renovations",
    image: "",
    summary_en: "",
    summary_vi: "",
  });
  const [postSaved, setPostSaved] = useState(false);

  useEffect(() => {
    // Check auth
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("ns_admin_auth");
      if (!auth) {
        router.push("/admin/login");
        return;
      }
    }

    // Fetch projects and posts
    Promise.all([
      fetch("/api/admin/projects").then((res) => res.json()),
      fetch("/api/admin/posts").then((res) => res.json()),
    ]).then(([projData, postData]) => {
      if (Array.isArray(projData)) setProjects(projData);
      if (Array.isArray(postData)) setPosts(postData);
      setLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ns_admin_auth");
    }
    router.push("/admin/login");
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectForm),
    });

    if (res.ok) {
      const data = await res.json();
      setProjects([data.project, ...projects]);
      setProjectSaved(true);
      setProjectForm({
        title_en: "",
        title_vi: "",
        suburb: "",
        category: "renovations",
        before_image: "",
        after_image: "",
        description_en: "",
        description_vi: "",
      });
      setTimeout(() => setProjectSaved(false), 4000);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postForm),
    });

    if (res.ok) {
      const data = await res.json();
      setPosts([data.post, ...posts]);
      setPostSaved(true);
      setPostForm({
        title_en: "",
        title_vi: "",
        category: "renovations",
        image: "",
        summary_en: "",
        summary_vi: "",
      });
      setTimeout(() => setPostSaved(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* ADMIN NAVBAR */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-bronze rounded-xl flex items-center justify-center font-black text-lg border border-bronze/40">
            NS
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white">
              NS BUILDING &bull; QUẢN TRỊ CMS
            </span>
            <span className="text-[11px] text-slate-400">
              Quản trị viên: Anh Nguyễn Sơn (nsbuilding.co.nz)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/en"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-bronze" />
            <span>Xem Website Live</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </header>

      {/* DASHBOARD TABS & CONTENT */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Tổng Dự Án (Before &amp; After)
            </span>
            <div className="text-3xl font-extrabold text-bronze">{projects.length}</div>
          </div>
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Bài Viết / Cẩm Nang Sửa Nhà
            </span>
            <div className="text-3xl font-extrabold text-bronze">{posts.length}</div>
          </div>
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Trạng Thái Hệ Thống
            </span>
            <div className="text-sm font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Đang hoạt động 100% (Song ngữ EN/VI)
            </div>
          </div>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex border-b border-slate-700 mb-8 space-x-2">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === "projects"
                ? "border-bronze text-bronze bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Quản Lý Dự Án (Before/After)</span>
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === "posts"
                ? "border-bronze text-bronze bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Đăng Bài Viết &amp; Cẩm Nang</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === "settings"
                ? "border-bronze text-bronze bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Cấu Hình Thông Tin</span>
          </button>
        </div>

        {/* TAB 1: PROJECTS */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ADD FORM */}
            <div className="lg:col-span-6 bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Plus className="w-5 h-5 text-bronze" />
                <span>Thêm Công Trình Mới (Before &amp; After)</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Chỉ cần dán link ảnh Trước và Sau là hệ thống sẽ tự động tạo thanh trượt kéo so sánh trên trang chủ!
              </p>

              {projectSaved && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã lưu dự án mới thành công và đồng bộ lên website!</span>
                </div>
              )}

              <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Tên dự án (Tiếng Anh) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Remuera Architectural Modernisation"
                    value={projectForm.title_en}
                    onChange={(e) => setProjectForm({ ...projectForm, title_en: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Tên dự án (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Cải tạo biệt thự Remuera"
                    value={projectForm.title_vi}
                    onChange={(e) => setProjectForm({ ...projectForm, title_vi: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Khu vực tại New Zealand *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Remuera, Auckland"
                      value={projectForm.suburb}
                      onChange={(e) => setProjectForm({ ...projectForm, suburb: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Danh mục dịch vụ
                    </label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
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
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Link ảnh Trước Khi Sửa (Before Image URL) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={projectForm.before_image}
                    onChange={(e) => setProjectForm({ ...projectForm, before_image: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Link ảnh Sau Khi Hoàn Thiện (After Image URL) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={projectForm.after_image}
                    onChange={(e) => setProjectForm({ ...projectForm, after_image: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Mô tả công việc thực hiện (Tiếng Anh)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Description of renovation work done..."
                    value={projectForm.description_en}
                    onChange={(e) => setProjectForm({ ...projectForm, description_en: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Mô tả công việc thực hiện (Tiếng Việt)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mô tả các hạng mục đã thi công..."
                    value={projectForm.description_vi}
                    onChange={(e) => setProjectForm({ ...projectForm, description_vi: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-bronze hover:bg-bronze-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg mt-2"
                >
                  Lưu &amp; Xuất Bản Dự Án Lên Website
                </button>
              </form>
            </div>

            {/* EXISTING PROJECTS LIST */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">
                Danh Sách Dự Án Đang Hiển Thị ({projects.length})
              </h3>
              <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex gap-4 items-center"
                  >
                    <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-900 relative">
                      <img
                        src={proj.after_image}
                        alt={proj.title_en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-bronze uppercase block">
                        {proj.category} &bull; {proj.suburb}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">
                        {proj.title_vi || proj.title_en}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {proj.description_vi || proj.description_en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: POSTS */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Plus className="w-5 h-5 text-bronze" />
                <span>Viết Bài / Cẩm Nang Sửa Nhà Mới</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Đăng các bài viết chia sẻ kinh nghiệm giúp duy trì website luôn "sống" và tăng thứ hạng SEO Google tại NZ!
              </p>

              {postSaved && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã đăng bài viết mới thành công!</span>
                </div>
              )}

              <form onSubmit={handleSavePost} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Tiêu đề bài viết (Tiếng Anh) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Tips for Renovating a Villa in Auckland"
                    value={postForm.title_en}
                    onChange={(e) => setPostForm({ ...postForm, title_en: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Tiêu đề bài viết (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: 5 Lưu Ý Khi Cải Tạo Nhà Cổ Tại Auckland"
                    value={postForm.title_vi}
                    onChange={(e) => setPostForm({ ...postForm, title_vi: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Link ảnh đại diện bài viết *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={postForm.image}
                    onChange={(e) => setPostForm({ ...postForm, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Tóm tắt nội dung (Tiếng Anh)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Short summary for SEO..."
                    value={postForm.summary_en}
                    onChange={(e) => setPostForm({ ...postForm, summary_en: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Tóm tắt nội dung (Tiếng Việt)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                    value={postForm.summary_vi}
                    onChange={(e) => setPostForm({ ...postForm, summary_vi: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-bronze hover:bg-bronze-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg mt-2"
                >
                  Đăng Bài Lên Website
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">
                Bài Viết Đã Đăng ({posts.length})
              </h3>
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex gap-4 items-center"
                  >
                    <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                      <img
                        src={post.image}
                        alt={post.title_en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-400 block">
                        {post.date} &bull; Tác giả: {post.author}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">
                        {post.title_vi || post.title_en}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700 space-y-6">
            <h3 className="text-lg font-bold text-white">Thông Tin Doanh Nghiệp Cố Định</h3>
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-1">Hotline chính tại New Zealand:</span>
                <strong className="text-base text-bronze font-mono">027 666 6510</strong>
              </div>
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-1">Số điện thoại Mr. Nguyễn Sơn:</span>
                <strong className="text-base text-bronze font-mono">021 153 1510 / 0913 336 988</strong>
              </div>
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-1">Email nhận thông báo khách hàng:</span>
                <strong className="text-base text-white font-mono">contact@nsbuilding.co.nz</strong>
              </div>
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-1">Tên miền website:</span>
                <strong className="text-base text-white font-mono">nsbuilding.co.nz</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
