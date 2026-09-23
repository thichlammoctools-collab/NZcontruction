"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import OverviewStats from "@/components/admin/OverviewStats";
import InterfaceManager from "@/components/admin/InterfaceManager";
import ServicesManager from "@/components/admin/ServicesManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import PostsManager from "@/components/admin/PostsManager";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [interfaceData, setInterfaceData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Authentication check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("ns_admin_auth");
      if (!auth) {
        router.push("/admin/login");
        return;
      }
    }
  }, [router]);

  // Load all dashboard data
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const [projRes, servRes, postRes, ifaceRes] = await Promise.all([
        fetch("/api/admin/projects"),
        fetch("/api/admin/services"),
        fetch("/api/admin/posts"),
        fetch("/api/admin/interface"),
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

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ns_admin_auth");
    }
    router.push("/admin/login");
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
        </main>
      </div>
    </div>
  );
}
