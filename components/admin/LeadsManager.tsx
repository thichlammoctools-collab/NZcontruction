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

interface Lead {
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "quote" | "chat">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
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
        (l.files || []).join("; "),
        l.status || "new",
        l.createdAt || "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ns-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
            {lead.createdAt
              ? new Date(lead.createdAt).toLocaleString("vi-VN")
              : "—"}
          </span>
          <div className="flex items-center gap-2">
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

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, email, khu vực..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            >
              <option value="all">Mọi trạng thái</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            >
              <option value="all">Mọi nguồn</option>
              <option value="quote">Form báo giá</option>
              <option value="chat">Chatbot AI</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            <strong className="text-white">{filtered.length}</strong> / {leads.length} leads
          </span>
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Summary chips */}
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

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
          <span className="animate-spin inline-block w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full mr-3" />
          Đang tải leads...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          <Inbox className="w-10 h-10 mx-auto mb-3 opacity-40" />
          Chưa có lead nào phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(leadCard)}
        </div>
      )}

      {/* Edit Modal */}
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
