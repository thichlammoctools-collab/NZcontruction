"use client";

import React from "react";
import Link from "next/link";
import { AdminTab } from "./AdminSidebar";
import {
  FolderKanban,
  Wrench,
  FileText,
  Palette,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Phone,
  Mail,
  Sliders,
  ExternalLink,
  Bot,
} from "lucide-react";

interface OverviewStatsProps {
  projects: any[];
  services: any[];
  posts: any[];
  siteSettings: any;
  setActiveTab: (tab: AdminTab) => void;
  onOpenNewProject: () => void;
  onOpenNewService: () => void;
}

export default function OverviewStats({
  projects,
  services,
  posts,
  siteSettings,
  setActiveTab,
  onOpenNewProject,
  onOpenNewService,
}: OverviewStatsProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hệ Thống CMS Quản Trị NS Building</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Chào mừng trở lại, Anh Nguyễn Sơn!
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Toàn bộ dữ liệu về công trình, dịch vụ thi công, chi phí và cấu hình giao diện website{" "}
              <span className="text-amber-400 font-mono font-bold">nsbuilding.co.nz</span> đều có thể quản lý tập trung và đồng bộ tức thì tại đây.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenNewProject}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2"
            >
              <FolderKanban className="w-4 h-4" />
              <span>+ Đăng Dự Án Mới</span>
            </button>
            <button
              onClick={() => setActiveTab("interface")}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all border border-slate-700 flex items-center gap-2"
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Sửa Giao Diện</span>
            </button>
            <button
              onClick={() => setActiveTab("ai-chat")}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs uppercase tracking-wider transition-all border border-amber-400/30 flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Huấn Luyện AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Projects */}
        <div
          onClick={() => setActiveTab("projects")}
          className="group cursor-pointer bg-slate-800/80 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-amber-400/50 transition-all shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Dự Án Before/After
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{projects.length}</div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Công trình đã hiển thị</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Services */}
        <div
          onClick={() => setActiveTab("services")}
          className="group cursor-pointer bg-slate-800/80 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-purple-400/50 transition-all shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Dịch Vụ Thi Công
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{services.length}</div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Kèm bảng giá &amp; quy trình</span>
            <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Posts */}
        <div
          onClick={() => setActiveTab("posts")}
          className="group cursor-pointer bg-slate-800/80 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-blue-400/50 transition-all shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Cẩm Nang &amp; Bài Viết
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{posts.length}</div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Bài viết chuẩn SEO NZ</span>
            <ArrowUpRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: System Status */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Trạng Thái Hệ Thống
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            100% Sẵn Sàng
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Đồng bộ JSON &amp; Dictionary tức thì
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Projects & Quick Contact Config */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Projects */}
        <div className="lg:col-span-7 bg-slate-800/90 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white">Dự Án Nổi Bật Gần Đây</h3>
              <p className="text-xs text-slate-400">
                Các công trình đang hiển thị công khai trên website
              </p>
            </div>
            <button
              onClick={() => setActiveTab("projects")}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              <span>Xem Tất Cả</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 4).map((proj: any) => (
              <div
                key={proj.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-950 relative">
                  <img
                    src={proj.after_image}
                    alt={proj.title_en}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {proj.category}
                    </span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {proj.suburb}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate mt-0.5">
                    {proj.title_vi || proj.title_en}
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  {proj.completed_year || "2026"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interface & Contact Snapshot */}
        <div className="lg:col-span-5 bg-slate-800/90 rounded-2xl border border-slate-700 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Cấu Hình Doanh Nghiệp</h3>
              <button
                onClick={() => setActiveTab("interface")}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <span>Chỉnh Sửa</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400" />
                  Hotline NZ:
                </span>
                <strong className="text-amber-400 font-mono text-sm">
                  {siteSettings.phone || "027 666 6510"}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400" />
                  Mr. Sơn (Zalo):
                </span>
                <strong className="text-white font-mono text-sm">
                  {siteSettings.mobile || "021 153 1510"}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  Email tiếp nhận:
                </span>
                <strong className="text-slate-200 font-mono text-xs truncate max-w-[200px]">
                  {siteSettings.email || "contact@nsbuilding.co.nz"}
                </strong>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-700/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Giấy phép xây dựng:</span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono font-bold">
              {siteSettings.lbpLicense || "BP128842"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
