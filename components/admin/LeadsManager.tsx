"use client";

import React, { useState, useMemo } from "react";
import {
  Inbox,
  Search,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MessageSquare,
  Bot,
  AlertTriangle,
  Trash2,
  Download,
  Filter,
  FileText,
  ExternalLink,
  LayoutList,
  LayoutGrid,
  MapPin,
  Calendar,
  Edit2,
  Eye,
  Paperclip,
  Clock,
} from "lucide-react";

export type LeadStatus =
  | "new"
  | "contacted"
  | "site_visit"
  | "quoted"
  | "won"
  | "lost";

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  site_visit: "Hẹn khảo sát",
  quoted: "Đã báo giá",
  won: "Chốt hợp đồng",
  lost: "Bỏ lỡ",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  contacted: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  site_visit: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  quoted: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  won: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  lost: "bg-red-500/15 text-red-300 border-red-500/30",
};

export interface Lead {
  id: string;
  source: "quote" | "chat";
  name?: string;
  phone?: string;
  email?: string;
  contact?: string;
  type?: string;
  customerName?: string;
  suburb?: string;
  service?: string;
  location?: string;
  details?: string;
  message?: string;
  status?: LeadStatus;
  notes?: string;
  files?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface LeadsManagerProps {
  leads: Lead[];
  loading?: boolean;
  onRefresh: () => void;
}

export default function LeadsManager({
  leads,
  loading,
  onRefresh,
}: LeadsManagerProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "quote" | "chat">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [editStatus, setEditStatus] = useState<LeadStatus>("new");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const quoteLeads = leads.filter((l) => l.source === "quote");
  const chatLeads = leads.filter((l) => l.source === "chat");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && (l.status || "new") !== statusFilter) return false;
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (!q) return true;
      const hay = [
        l.name,
        l.phone,
        l.email,
        l.contact,
        l.customerName,
        l.suburb,
        l.location,
        l.service,
        l.details,
        l.message,
        l.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [leads, search, statusFilter, sourceFilter]);

  const notify = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const openEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setEditStatus(lead.status || "new");
    setEditNotes(lead.notes || "");
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const lead = leads.find((l) => l.id === editingId);
      const res = await fetch("/api/admin/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: lead?.source,
          id: editingId,
          status: editStatus,
          notes: editNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể cập nhật lead");
      notify("success", "Đã cập nhật trạng thái lead!");
      setEditingId(null);
      if (viewingLead && viewingLead.id === editingId) {
        setViewingLead({
          ...viewingLead,
          status: editStatus,
          notes: editNotes,
        });
      }
      onRefresh();
    } catch (err: any) {
      notify("error", err.message || "Lỗi khi cập nhật");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const lead = leads.find((l) => l.id === deleteId);
      const res = await fetch("/api/admin/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: lead?.source, id: deleteId }),
      });
      if (!res.ok) throw new Error("Không thể xóa lead");
      notify("success", "Đã xóa lead!");
      if (viewingLead?.id === deleteId) {
        setViewingLead(null);
      }
      setDeleteId(null);
      onRefresh();
    } catch (err: any) {
      notify("error", err.message || "Lỗi khi xóa");
    }
  };

  const exportCsv = () => {
    const headers = [
      "source",
      "name",
      "phone",
      "email",
      "suburb/location",
      "service",
      "details/message",
      "notes",
      "files",
      "status",
      "createdAt",
    ];
    const rows = filtered.map((l) =>
      [
        l.source,
        l.name || l.customerName || "",
        l.phone || l.contact || "",
        l.email || "",
        l.suburb || l.location || "",
        l.service || "",
        (l.details || l.message || "").replace(/\n/g, " "),
        (l.notes || "").replace(/\n/g, " "),
        (l.files || []).join("; "),
        l.status || "new",
        l.createdAt || "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ns-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatLeadDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Card view layout
  const leadCard = (lead: Lead) => {
    const contactValue = lead.phone || lead.contact || lead.email || "-";
    const contactType = lead.type || (lead.email ? "email" : "phone");
    const message = lead.details || lead.message || "";
    return (
      <div
        key={`${lead.source}-${lead.id}`}
        className="bg-slate-800/90 rounded-2xl border border-slate-700 p-5 hover:border-slate-600 transition-all shadow-lg flex flex-col gap-3"
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              STATUS_COLORS[lead.status as LeadStatus] || STATUS_COLORS.new
            }`}
          >
            {STATUS_LABELS[lead.status as LeadStatus] || STATUS_LABELS.new}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
              lead.source === "chat"
                ? "bg-amber-400/15 text-amber-300"
                : "bg-emerald-500/15 text-emerald-300"
            }`}
          >
            {lead.source === "chat" ? (
              <>
                <Bot className="w-3 h-3" /> Chatbot
              </>
            ) : (
              <>
                <MessageSquare className="w-3 h-3" /> Báo giá
              </>
            )}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white leading-tight">
            {lead.name || lead.customerName || "Khách hàng"}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1">
              {contactType === "email" ? (
                <Mail className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Phone className="w-3.5 h-3.5 text-amber-400" />
              )}
              {contactValue}
            </span>
            {(lead.suburb || lead.location) && (
              <span className="text-slate-400">• {lead.suburb || lead.location}</span>
            )}
          </div>
        </div>

        {message && (
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 rounded-lg p-3 border border-slate-800 line-clamp-3">
            {message}
          </p>
        )}

        {lead.files && lead.files.length > 0 && (
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tệp đính kèm ({lead.files.length}):
            </span>
            <div className="flex flex-wrap gap-2">
              {lead.files.map((fileUrl, idx) => {
                const isImg = /\.(jpe?g|png|webp|gif|avif)$/i.test(fileUrl);
                const fileName = fileUrl.split("/").pop() || "Tệp";
                return isImg ? (
                  <a
                    key={idx}
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="relative group w-14 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 block shrink-0 hover:border-amber-400 transition-colors"
                    title={fileName}
                  >
                    <img
                      src={fileUrl}
                      alt={fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </a>
                ) : (
                  <a
                    key={idx}
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs bg-slate-950 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="truncate max-w-[130px]">{fileName}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {lead.notes && (
          <p className="text-[11px] text-amber-300/80 italic">
            📝 {lead.notes}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between border-t border-slate-800">
          <span className="text-[10px] text-slate-500">
            {formatLeadDate(lead.createdAt)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewingLead(lead)}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs transition-colors"
              title="Xem chi tiết"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => openEdit(lead)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-semibold transition-colors"
            >
              Cập nhật
            </button>
            <button
              onClick={() => setDeleteId(lead.id)}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors border border-red-500/20"
              title="Xóa lead"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
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

      {/* Summary KPI chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/70 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-black text-white">{leads.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Tổng leads</div>
        </div>
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
          <div className="text-2xl font-black text-blue-300">
            {leads.filter((l) => (l.status || "new") === "new").length}
          </div>
          <div className="text-[11px] text-blue-300/70 mt-1">Mới chưa xử lý</div>
        </div>
        <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
          <div className="text-2xl font-black text-emerald-300">{quoteLeads.length}</div>
          <div className="text-[11px] text-emerald-300/70 mt-1">Từ form báo giá</div>
        </div>
        <div className="bg-amber-400/10 rounded-xl p-4 border border-amber-400/30">
          <div className="text-2xl font-black text-amber-300">{chatLeads.length}</div>
          <div className="text-[11px] text-amber-300/70 mt-1">Từ chatbot AI</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, email, khu vực, ghi chú..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">Mọi trạng thái</option>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k} className="bg-slate-900 text-white">
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl">
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as any)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">Mọi nguồn</option>
                <option value="quote" className="bg-slate-900 text-white">Form báo giá</option>
                <option value="chat" className="bg-slate-900 text-white">Chatbot AI</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "list"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Dạng danh sách (List view)"
            >
              <LayoutList className="w-4 h-4" />
              <span className="hidden sm:inline">Danh sách</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "grid"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Dạng thẻ (Grid view)"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Thẻ</span>
            </button>
          </div>

          <span className="text-xs text-slate-400">
            <strong className="text-white">{filtered.length}</strong> / {leads.length} leads
          </span>

          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
          <span className="animate-spin inline-block w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full mr-3" />
          Đang tải leads...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400 text-sm bg-slate-800/40 rounded-2xl border border-slate-800">
          <Inbox className="w-10 h-10 mx-auto mb-3 opacity-40" />
          Chưa có lead nào phù hợp với bộ lọc.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(leadCard)}
        </div>
      ) : (
        /* List / Table View */
        <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Khách Hàng</th>
                  <th className="py-3.5 px-4">Liên Hệ</th>
                  <th className="py-3.5 px-4">Nguồn</th>
                  <th className="py-3.5 px-4">Nội Dung / Yêu Cầu</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4">Thời Gian</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filtered.map((lead) => {
                  const name = lead.name || lead.customerName || "Khách hàng";
                  const phone = lead.phone || lead.contact;
                  const email = lead.email;
                  const location = lead.suburb || lead.location;
                  const message = lead.details || lead.message || "";
                  const statusKey = (lead.status || "new") as LeadStatus;

                  return (
                    <tr
                      key={`${lead.source}-${lead.id}`}
                      className="hover:bg-slate-700/40 transition-colors group"
                    >
                      {/* Customer Name & Suburb */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                          {name}
                        </div>
                        {location && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                            <MapPin className="w-3 h-3 text-amber-400/80 shrink-0" />
                            <span className="truncate max-w-[150px]">{location}</span>
                          </div>
                        )}
                      </td>

                      {/* Contact Info (Phone / Email) */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          {phone && (
                            <a
                              href={`tel:${phone}`}
                              className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors font-mono"
                            >
                              <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>{phone}</span>
                            </a>
                          )}
                          {email && (
                            <a
                              href={`mailto:${email}`}
                              className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors truncate max-w-[180px]"
                            >
                              <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate">{email}</span>
                            </a>
                          )}
                          {!phone && !email && (
                            <span className="text-slate-500 italic">—</span>
                          )}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                            lead.source === "chat"
                              ? "bg-amber-400/10 border-amber-400/30 text-amber-300"
                              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          }`}
                        >
                          {lead.source === "chat" ? (
                            <>
                              <Bot className="w-3 h-3" /> Chatbot AI
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-3 h-3" /> Báo Giá
                            </>
                          )}
                        </span>
                      </td>

                      {/* Message / Service / Files */}
                      <td className="py-3.5 px-4 align-top max-w-xs md:max-w-md">
                        {lead.service && (
                          <div className="inline-block text-[10px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded mb-1">
                            {lead.service}
                          </div>
                        )}
                        {message && (
                          <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
                            {message}
                          </p>
                        )}
                        {lead.notes && (
                          <p className="text-[11px] text-amber-300/80 italic mt-1 flex items-center gap-1">
                            <span>📝</span>
                            <span className="truncate">{lead.notes}</span>
                          </p>
                        )}
                        {lead.files && lead.files.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-900 px-2 py-0.5 rounded-md text-slate-300 border border-slate-700">
                              <Paperclip className="w-3 h-3 text-amber-400" />
                              {lead.files.length} tệp đính kèm
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            STATUS_COLORS[statusKey] || STATUS_COLORS.new
                          }`}
                        >
                          {STATUS_LABELS[statusKey] || STATUS_LABELS.new}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap text-slate-400 text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{formatLeadDate(lead.createdAt)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingLead(lead)}
                            className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                            title="Xem chi tiết lead"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEdit(lead)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-[11px] transition-colors flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Cập nhật</span>
                          </button>
                          <button
                            onClick={() => setDeleteId(lead.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                            title="Xóa lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail View Modal */}
      {viewingLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      STATUS_COLORS[viewingLead.status as LeadStatus] || STATUS_COLORS.new
                    }`}
                  >
                    {STATUS_LABELS[viewingLead.status as LeadStatus] || STATUS_LABELS.new}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      viewingLead.source === "chat"
                        ? "bg-amber-400/10 border-amber-400/30 text-amber-300"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    }`}
                  >
                    {viewingLead.source === "chat" ? (
                      <>
                        <Bot className="w-3 h-3" /> Chatbot AI
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-3 h-3" /> Form Báo Giá
                      </>
                    )}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {viewingLead.name || viewingLead.customerName || "Khách hàng"}
                </h3>
              </div>
              <button
                onClick={() => setViewingLead(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Số điện thoại:</span>
                <a
                  href={`tel:${viewingLead.phone || viewingLead.contact}`}
                  className="text-amber-400 font-bold hover:underline inline-flex items-center gap-1.5 font-mono"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {viewingLead.phone || viewingLead.contact || "Chưa cung cấp"}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Email:</span>
                <a
                  href={`mailto:${viewingLead.email}`}
                  className="text-white hover:text-amber-400 hover:underline inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {viewingLead.email || "Chưa cung cấp"}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Khu vực / Địa chỉ:</span>
                <span className="text-white inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {viewingLead.suburb || viewingLead.location || "Chưa cung cấp"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Thời gian gửi:</span>
                <span className="text-slate-300 inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {formatLeadDate(viewingLead.createdAt)}
                </span>
              </div>
            </div>

            {/* Service & Message */}
            <div className="space-y-2">
              {viewingLead.service && (
                <div>
                  <span className="text-slate-400 block text-[11px] mb-1 font-bold">Dịch vụ yêu cầu:</span>
                  <span className="inline-block text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
                    {viewingLead.service}
                  </span>
                </div>
              )}

              <div>
                <span className="text-slate-400 block text-[11px] mb-1 font-bold">Nội dung chi tiết / Lời nhắn:</span>
                <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {viewingLead.details || viewingLead.message || "Không có lời nhắn kèm theo."}
                </div>
              </div>
            </div>

            {/* Files & Attachments */}
            {viewingLead.files && viewingLead.files.length > 0 && (
              <div className="space-y-2">
                <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider">
                  Tệp đính kèm ({viewingLead.files.length}):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {viewingLead.files.map((fileUrl, idx) => {
                    const isImg = /\.(jpe?g|png|webp|gif|avif)$/i.test(fileUrl);
                    const fileName = fileUrl.split("/").pop() || "Tệp";
                    return isImg ? (
                      <a
                        key={idx}
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-950 block hover:border-amber-400 transition-colors"
                      >
                        <img
                          src={fileUrl}
                          alt={fileName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                      </a>
                    ) : (
                      <a
                        key={idx}
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs bg-slate-950 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white p-2.5 rounded-xl transition-colors"
                      >
                        <FileText className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="truncate">{fileName}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 shrink-0 ml-auto" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            {viewingLead.notes && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200">
                <span className="font-bold block mb-1">📝 Ghi chú nội bộ:</span>
                <p className="leading-relaxed">{viewingLead.notes}</p>
              </div>
            )}

            {/* Actions in Detail Modal */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => setDeleteId(viewingLead.id)}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Lead</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    openEdit(viewingLead);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Cập Nhật Trạng Thái / Ghi Chú</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status & Notes Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Cập Nhật Trạng Thái Lead</h3>
              <button
                onClick={() => setEditingId(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 text-xs">
                Trạng thái xử lý
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as LeadStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
              >
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 text-xs">
                Ghi chú nội bộ
              </label>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Ví dụ: Đã hẹn khảo sát thứ Sáu lúc 10h..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2"
              >
                {saving ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{saving ? "Đang Lưu..." : "Lưu"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold">Xác Nhận Xóa Lead?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa lead này không? Hành động không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-lg shadow-red-600/30"
              >
                Đồng Ý Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
