"use client";

import React from "react";
import Link from "next/link";
import { AdminTab } from "./AdminSidebar";
import {
  Globe,
  Sparkles,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  Layers,
  Menu,
} from "lucide-react";

interface AdminHeaderProps {
  activeTab: AdminTab;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onQuickAdd?: (tab: "project" | "service") => void;
  onToggleSidebar?: () => void;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  overview: {
    title: "Bảng Điều Khiển Tổng Quan",
    subtitle: "Theo dõi tình trạng hệ thống, số lượng dự án và liên hệ",
  },
  interface: {
    title: "Quản Lý Giao Diện & Thương Hiệu",
    subtitle: "Tùy biến banner Hero, hotline, thông tin liên hệ và các khối hiển thị",
  },
  services: {
    title: "Quản Lý Dịch Vụ Thi Công",
    subtitle: "Chỉnh sửa nội dung dịch vụ, chi phí tham khảo và quy trình thi công",
  },
  projects: {
    title: "Quản Lý Dự Án & Before / After",
    subtitle: "Thêm mới và cập nhật hình ảnh so sánh công trình hoàn thiện",
  },
  posts: {
    title: "Bài Viết & Cẩm Nang Sửa Nhà",
    subtitle: "Đăng tải kiến thức kinh nghiệm và nâng cao thứ hạng SEO",
  },
};

export default function AdminHeader({
  activeTab,
  onRefresh,
  isRefreshing = false,
  onQuickAdd,
  onToggleSidebar,
}: AdminHeaderProps) {
  const current = TAB_TITLES[activeTab];

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-4 sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
              NS BUILDING NZ &bull; CMS
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" />
              Song ngữ EN &bull; VI
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mt-0.5">
            {current.title}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700/60 flex items-center gap-1.5"
            title="Tải lại dữ liệu mới nhất"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-amber-400 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline">Làm Mới</span>
          </button>
        )}

        {onQuickAdd && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onQuickAdd("project")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-400/10"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Dự Án</span>
            </button>
            <button
              onClick={() => onQuickAdd("service")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Dịch Vụ</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
