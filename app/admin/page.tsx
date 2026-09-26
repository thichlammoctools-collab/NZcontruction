"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamicImport from "next/dynamic";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import OverviewStats from "@/components/admin/OverviewStats";
import LeadsManager from "@/components/admin/LeadsManager";

// Lazy-load heavy tab components so initial paint of dashboard is fast
const InterfaceManager = dynamicImport(() => import("@/components/admin/InterfaceManager"), { ssr: false });
const ServicesManager = dynamicImport(() => import("@/components/admin/ServicesManager"), { ssr: false });
const ProjectsManager = dynamicImport(() => import("@/components/admin/ProjectsManager"), { ssr: false });
const PostsManager = dynamicImport(() => import("@/components/admin/PostsManager"), { ssr: false });
const AIChatManager = dynamicImport(() => import("@/components/admin/AIChatManager"), { ssr: false });

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [interfaceData, setInterfaceData] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Authentication is enforced server-side by middleware.ts (httpOnly session cookie).

  // Load all dashboard data
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const t = Date.now();
      const fetchOpts = { cache: "no-store" as RequestCache };
      const [projRes, servRes, postRes, ifaceRes, leadsRes] = await Promise.all([
        fetch(`/api/admin/projects?t=${t}`, fetchOpts),
        fetch(`/api/admin/services?t=${t}`, fetchOpts),
        fetch(`/api/admin/posts?t=${t}`, fetchOpts),
        fetch(`/api/admin/interface?t=${t}`, fetchOpts),
        fetch(`/api/admin/leads?t=${t}`, fetchOpts),
      ]);

      if (projRes.ok) {
        const projData = await projRes.json();
        if (Array.isArray(projData)) setProjects(projData);
      }

      if (servRes.ok) {
        const servData = await servRes.json();
        if (Array.isArray(servData)) setServices(servData);
      }

      if (postRes.ok) {
        const postData = await postRes.json();
        if (Array.isArray(postData)) setPosts(postData);
      }

      if (ifaceRes.ok) {
        const ifaceData = await ifaceRes.json();
        setInterfaceData(ifaceData);
      }

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        const combined = [
          ...(leadsData.quoteLeads || []),
          ...(leadsData.chatLeads || []),
        ];
        setLeads(combined);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore network error, still redirect
    }
    router.push("/admin/login");
    router.refresh();
  };

  const handleQuickAdd = (type: "project" | "service") => {
    if (type === "project") {
      setActiveTab("projects");
    } else {
      setActiveTab("services");
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
          <span>Đang tải hệ thống quản trị NS Building...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: Responsive Drawer on mobile, fixed side on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:transform-none lg:static transition-transform duration-300 ease-in-out flex ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
          counts={{
            projects: projects.length,
            services: services.length,
            posts: posts.length,
            leads: leads.length,
          }}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/50">
        <AdminHeader
          activeTab={activeTab}
          onRefresh={() => loadData(false)}
          isRefreshing={isRefreshing}
          onQuickAdd={handleQuickAdd}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "overview" && (
            <OverviewStats
              projects={projects}
              services={services}
              posts={posts}
              leads={leads}
              siteSettings={interfaceData?.siteSettings || {}}
              setActiveTab={setActiveTab}
              onOpenNewProject={() => setActiveTab("projects")}
              onOpenNewService={() => setActiveTab("services")}
            />
          )}

          {activeTab === "interface" && interfaceData && (
            <InterfaceManager
              initialData={interfaceData}
              onSaveSuccess={() => loadData(true)}
            />
          )}

          {activeTab === "services" && (
            <ServicesManager
              services={services}
              onRefresh={() => loadData(true)}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsManager
              projects={projects}
              onRefresh={() => loadData(true)}
            />
          )}

          {activeTab === "posts" && (
            <PostsManager
              posts={posts}
              onRefresh={() => loadData(true)}
            />
          )}

          {activeTab === "leads" && (
            <LeadsManager
              leads={leads}
              onRefresh={() => loadData(true)}
            />
          )}

          {activeTab === "ai-chat" && (
            <AIChatManager
              onRefresh={() => loadData(true)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
