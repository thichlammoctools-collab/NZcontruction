"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Palette,
  Wrench,
  FolderKanban,
  FileText,
  ExternalLink,
  LogOut,
  ShieldCheck,
  ChevronRight,
  HardHat,
  Bot,
  Inbox,
} from "lucide-react";

export type AdminTab =
  | "overview"
  | "interface"
  | "services"
  | "projects"
  | "posts"
  | "leads"
  | "ai-chat";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  counts: {
    projects: number;
    services: number;
    posts: number;
    leads: number;
  };
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  counts,
  onLogout,
}: AdminSidebarProps) {
  const navItems = [
    {
      id: "overview" as AdminTab,
      label: "Tổng Quan",
      sub: "Bảng điều khiển chung",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "interface" as AdminTab,
      label: "Quản Lý Giao Diện",
      sub: "Hero, liên hệ, khối web",
      icon: Palette,
      badge: "UI",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    {
      id: "services" as AdminTab,
      label: "Quản Lý Dịch Vụ",
      sub: "Bảng giá & quy trình",
      icon: Wrench,
      badge: counts.services.toString(),
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      id: "projects" as AdminTab,
      label: "Quản Lý Dự Án",
      sub: "Before/After & Portfolio",
      icon: FolderKanban,
      badge: counts.projects.toString(),
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      id: "posts" as AdminTab,
      label: "Bài Viết & Cẩm Nang",
      sub: "SEO & chia sẻ kinh nghiệm",
      icon: FileText,
      badge: counts.posts.toString(),
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    {
      id: "leads" as AdminTab,
      label: "Quản Lý Leads",
      sub: "Báo giá & Chatbot AI",
      icon: Inbox,
      badge: counts.leads > 0 ? counts.leads.toString() : null,
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    },
    {
      id: "ai-chat" as AdminTab,
      label: "Cấu Hình & Huấn Luyện AI",
      sub: "Mô hình & Dữ liệu bot",
      icon: Bot,
      badge: "AI 24/7",
      badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30",
    },
  ];

  return (
    <aside className="w-full lg:w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-slate-950 text-amber-400 rounded-xl flex items-center justify-center font-black text-xl border border-amber-400/30 shadow-lg shrink-0">
            NS
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white uppercase truncate">
                NS Building CMS
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Auckland, New Zealand
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Menu Điều Hành
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all group ${
                isActive
                  ? "bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/10"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-slate-950" : "text-amber-400/90"
                  }`}
                />
                <div className="truncate">
                  <div className="text-xs leading-none">{item.label}</div>
                  <div
                    className={`text-[10px] mt-1 truncate ${
                      isActive ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {item.sub}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isActive
                      ? "bg-slate-950 text-amber-400 border-slate-950"
                      : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info & Actions */}
      <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <div className="flex items-center gap-1.5">
            <HardHat className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-slate-300">LBP #BP128842</span>
          </div>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Online
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href="/en"
            target="_blank"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors border border-slate-700/60"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Xem Web</span>
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold transition-colors border border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
