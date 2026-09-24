"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Sparkles,
  Settings,
  BrainCircuit,
  BookOpen,
  Users,
  Send,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Phone,
  Mail,
  RefreshCw,
  Shield,
  Layers,
  ChevronDown,
  Flame,
  Check,
  Search,
  MessageSquare,
  HelpCircle,
  UserCheck,
  Tag,
  Clock,
  Sparkle
} from "lucide-react";

interface FAQItem {
  id: string;
  category: string;
  question_vi: string;
  answer_vi: string;
  question_en: string;
  answer_en: string;
  keywords: string[];
  enabled: boolean;
}

interface CapturedLead {
  id: string;
  contact: string;
  type: string;
  customerName: string;
  suburb: string;
  message: string;
  createdAt: string;
  status: "new" | "contacted" | "site_visit" | "quoted" | "closed";
  notes: string;
}

interface PricingItem {
  category: string;
  rangeNZD: string;
  description: string;
}

interface AIChatConfig {
  general: {
    botName: string;
    botSubtitle_vi: string;
    botSubtitle_en: string;
    enabled: boolean;
    provider: "gemini" | "openai" | "local";
    model: string;
    temperature: number;
    maxTokens: number;
    streamResponse?: boolean;
  };
  persona: {
    role: string;
    tone: string;
    companyName: string;
    directorName: string;
    lbpLicense: string;
    phone: string;
    mobile: string;
    email: string;
    primaryRegion: string;
    systemPrompt_vi: string;
    systemPrompt_en: string;
    guardrails: string[];
  };
  knowledgeBase: {
    pricingGuide: PricingItem[];
    councilAndCompliance: string;
    workingProcess: string[];
  };
  trainingFaqs: FAQItem[];
  leadCapture: {
    welcome_vi: string;
    welcome_en: string;
    promptChips_vi: string[];
    promptChips_en: string[];
    leadTriggerPrompt_vi: string;
    leadTriggerPrompt_en: string;
    leadSuccess_vi: string;
    leadSuccess_en: string;
  };
  capturedLeads: CapturedLead[];
}

interface AIChatManagerProps {
  onRefresh?: () => void;
}

type TabType = "engine" | "persona" | "knowledge" | "leads" | "sandbox";

export default function AIChatManager({ onRefresh }: AIChatManagerProps) {
  const [activeSubTab, setActiveSubTab] = useState<TabType>("engine");
  const [config, setConfig] = useState<AIChatConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<{ hasServerApiKey?: boolean } | null>(null);

  // FAQ Modal states
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [faqCategoryFilter, setFaqCategoryFilter] = useState("all");
  const [faqSearchQuery, setFaqSearchQuery] = useState("");

  // Guardrail input
  const [newGuardrail, setNewGuardrail] = useState("");

  // Quick chip input
  const [newChipVi, setNewChipVi] = useState("");
  const [newChipEn, setNewChipEn] = useState("");

  // Sandbox states
  const [sandboxMessages, setSandboxMessages] = useState<Array<{ sender: "user" | "bot"; text: string; source?: string; time: string }>>([
    {
      sender: "bot",
      text: "Kia Ora! Em là Trợ lý Kỹ thuật NS Building (LBP #BP128842). Anh/Chị muốn thử nghiệm câu hỏi nào về cải tạo phòng tắm, sàn gỗ hoặc giấy phép Council tại Auckland ạ?",
      time: "Vừa xong",
    },
  ]);
  const [sandboxInput, setSandboxInput] = useState("");
  const [sandboxLocale, setSandboxLocale] = useState<"vi" | "en">("vi");
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<{ source?: string; matchedFaqId?: string | null; leadDetected?: boolean } | null>(null);
  const sandboxChatEndRef = useRef<HTMLDivElement>(null);

  // Load config from API
  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ai-config");
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error("Failed to load AI config:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    sandboxChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sandboxMessages, sandboxLoading]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Save all configuration
  const handleSave = async (customPayload?: Partial<AIChatConfig>) => {
    if (!config) return;
    setSaving(true);
    try {
      const payload = customPayload || config;
      const res = await fetch("/api/admin/ai-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        showToast("Đã lưu toàn bộ cấu hình & dữ liệu huấn luyện AI thành công!");
        setTimeout(() => setSaveSuccess(false), 3000);
        if (onRefresh) onRefresh();
      } else {
        alert("Lỗi khi lưu dữ liệu!");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Đã xảy ra lỗi mạng khi lưu!");
    } finally {
      setSaving(false);
    }
  };

  // Sandbox Test
  const handleSandboxSend = async (customMsg?: string) => {
    const textToSend = customMsg || sandboxInput;
    if (!textToSend.trim() || sandboxLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { sender: "user" as const, text: textToSend, time: timeStr };
    setSandboxMessages((prev) => [...prev, userMsg]);
    if (!customMsg) setSandboxInput("");
    setSandboxLoading(true);

    try {
      const res = await fetch("/api/admin/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_chat",
          message: textToSend,
          locale: sandboxLocale,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSandboxMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.reply,
            source: data.source,
            time: data.timestamp || timeStr,
          },
        ]);
        setLastAnalysis({
          source: data.source,
          matchedFaqId: data.matchedFaqId,
          leadDetected: data.leadDetected,
        });
      }
    } catch (err) {
      console.error("Sandbox test error:", err);
    } finally {
      setSandboxLoading(false);
    }
  };

  // Update Lead Status
  const handleLeadStatusChange = async (leadId: string, newStatus: CapturedLead["status"]) => {
    if (!config) return;
    try {
      const updatedLeads = (config.capturedLeads || []).map((l) =>
        l.id === leadId ? { ...l, status: newStatus } : l
      );
      setConfig({ ...config, capturedLeads: updatedLeads });

      await fetch("/api/admin/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_lead_status",
          leadId,
          status: newStatus,
        }),
      });
      showToast("Đã cập nhật trạng thái khách hàng!");
    } catch (err) {
      console.error("Error updating lead status:", err);
    }
  };

  // Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    if (!config || !window.confirm("Bạn có chắc muốn xóa bản ghi khách hàng này không?")) return;
    try {
      const updatedLeads = (config.capturedLeads || []).filter((l) => l.id !== leadId);
      setConfig({ ...config, capturedLeads: updatedLeads });

      await fetch("/api/admin/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_lead",
          leadId,
        }),
      });
      showToast("Đã xóa bản ghi khách hàng!");
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  // Guardrail add/delete
  const handleAddGuardrail = () => {
    if (!newGuardrail.trim() || !config) return;
    const list = [...(config.persona?.guardrails || []), newGuardrail.trim()];
    setConfig({
      ...config,
      persona: { ...config.persona, guardrails: list },
    });
    setNewGuardrail("");
  };

  const handleDeleteGuardrail = (index: number) => {
    if (!config) return;
    const list = (config.persona?.guardrails || []).filter((_, i) => i !== index);
    setConfig({
      ...config,
      persona: { ...config.persona, guardrails: list },
    });
  };

  // Prompt chips add/delete
  const handleAddChip = (lang: "vi" | "en") => {
    if (!config) return;
    if (lang === "vi" && newChipVi.trim()) {
      const chips = [...(config.leadCapture?.promptChips_vi || []), newChipVi.trim()];
      setConfig({
        ...config,
        leadCapture: { ...config.leadCapture, promptChips_vi: chips },
      });
      setNewChipVi("");
    } else if (lang === "en" && newChipEn.trim()) {
      const chips = [...(config.leadCapture?.promptChips_en || []), newChipEn.trim()];
      setConfig({
        ...config,
        leadCapture: { ...config.leadCapture, promptChips_en: chips },
      });
      setNewChipEn("");
    }
  };

  const handleDeleteChip = (lang: "vi" | "en", index: number) => {
    if (!config) return;
    if (lang === "vi") {
      const chips = (config.leadCapture?.promptChips_vi || []).filter((_, i) => i !== index);
      setConfig({
        ...config,
        leadCapture: { ...config.leadCapture, promptChips_vi: chips },
      });
    } else {
      const chips = (config.leadCapture?.promptChips_en || []).filter((_, i) => i !== index);
      setConfig({
        ...config,
        leadCapture: { ...config.leadCapture, promptChips_en: chips },
      });
    }
  };

  // FAQ Modal Save
  const handleSaveFaqModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config || !editingFaq) return;

    let updatedList = [...(config.trainingFaqs || [])];
    const exists = updatedList.some((f) => f.id === editingFaq.id);

    if (exists) {
      updatedList = updatedList.map((f) => (f.id === editingFaq.id ? editingFaq : f));
    } else {
      updatedList.push({
        ...editingFaq,
        id: editingFaq.id || `faq-${Date.now()}`,
      });
    }

    setConfig({ ...config, trainingFaqs: updatedList });
    setFaqModalOpen(false);
    setEditingFaq(null);
    showToast("Đã cập nhật câu hỏi huấn luyện! Bấm 'Lưu Thay Đổi' để đồng bộ hệ thống.");
  };

  // Filtered FAQs
  const filteredFaqs = (config?.trainingFaqs || []).filter((faq) => {
    const matchCategory = faqCategoryFilter === "all" || faq.category === faqCategoryFilter;
    const matchSearch =
      faq.question_vi.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      faq.answer_vi.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      (faq.keywords || []).some((k) => k.toLowerCase().includes(faqSearchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  if (loading || !config) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4 text-slate-400">
        <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center animate-spin">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium">Đang nạp cấu hình và kho tri thức AI...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top-3 duration-200">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-xl shadow-amber-400/20 shrink-0">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Cấu Hình & Huấn Luyện AI Chat
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  NS AI Studio
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    config.general.enabled
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-red-500/10 text-red-400 border border-red-500/30"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      config.general.enabled ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                    }`}
                  />
                  {config.general.enabled ? "Đang Hoạt Động Trên Web" : "Đã Tắt Chatbot"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Tùy chỉnh tính cách, nạp tri thức xây dựng New Zealand (LBP #BP128842), huấn luyện Q&A và thu thập khách hàng tiềm năng.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => fetchConfig()}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
              title="Tải lại dữ liệu"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Nạp Lại</span>
            </button>
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang Lưu...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-900" />
                  <span>Đã Lưu!</span>
                </>
              ) : (
                <>
                  <Sparkle className="w-4 h-4" />
                  <span>Lưu Toàn Bộ</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400">Mô hình AI</div>
            <div className="font-bold text-amber-400 text-sm mt-0.5 truncate uppercase">
              {config.general.provider}: {config.general.model}
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400">Bộ Câu Hỏi Huấn Luyện</div>
            <div className="font-bold text-white text-sm mt-0.5">
              {config.trainingFaqs?.length || 0} cặp Q&A chuẩn
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400">Khách Hàng Thu Thập (Leads)</div>
            <div className="font-bold text-emerald-400 text-sm mt-0.5">
              {config.capturedLeads?.length || 0} liên hệ
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400">Giấy Phép Hành Nghề LBP</div>
            <div className="font-bold text-purple-300 text-sm mt-0.5 font-mono">
              #{config.persona.lbpLicense}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto no-scrollbar pb-0.5">
        <button
          onClick={() => setActiveSubTab("engine")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeSubTab === "engine"
              ? "border-amber-400 text-amber-400 bg-amber-400/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>1. Mô Hình & API</span>
        </button>

        <button
          onClick={() => setActiveSubTab("persona")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeSubTab === "persona"
              ? "border-amber-400 text-amber-400 bg-amber-400/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>2. Huấn Luyện Tính Cách</span>
        </button>

        <button
          onClick={() => setActiveSubTab("knowledge")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeSubTab === "knowledge"
              ? "border-amber-400 text-amber-400 bg-amber-400/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>3. Kho Tri Thức & Q&A</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {config.trainingFaqs?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab("leads")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeSubTab === "leads"
              ? "border-amber-400 text-amber-400 bg-amber-400/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>4. Bắt Lead & Khách Hàng</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {config.capturedLeads?.filter((l) => l.status === "new").length || 0} mới
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab("sandbox")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeSubTab === "sandbox"
              ? "border-amber-400 text-amber-400 bg-amber-400/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>5. Phòng Thử Nghiệm (Sandbox)</span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MÔ HÌNH & KẾT NỐI (ENGINE & API) */}
      {/* ========================================================================= */}
      {activeSubTab === "engine" && (
        <div className="space-y-6">
          {/* General Toggles */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-amber-400" />
              <span>Trạng Thái Hoạt Động & Nhận Diện</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div>
                  <div className="text-sm font-bold text-white">Hiển thị Chatbot trên Website</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Bật hoặc tạm tắt widget chat góc màn hình cho khách hàng
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.general.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        general: { ...config.general, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tên hiển thị của Trợ lý AI
                </label>
                <input
                  type="text"
                  value={config.general.botName}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      general: { ...config.general, botName: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mô tả phụ Tiếng Việt (Sub-title)
                </label>
                <input
                  type="text"
                  value={config.general.botSubtitle_vi}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      general: { ...config.general, botSubtitle_vi: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mô tả phụ Tiếng Anh (English Sub-title)
                </label>
                <input
                  type="text"
                  value={config.general.botSubtitle_en}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      general: { ...config.general, botSubtitle_en: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* AI Provider & Engine */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Lựa Chọn Nhà Cung Cấp & Mô Hình AI</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Provider 1: Gemini */}
              <div
                onClick={() =>
                  setConfig({
                    ...config,
                    general: { ...config.general, provider: "gemini", model: "gemini-1.5-flash" },
                  })
                }
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.general.provider === "gemini"
                    ? "bg-amber-400/10 border-amber-400 text-white shadow-lg shadow-amber-400/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Google Gemini
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold">
                    Khuyên Dùng
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Xử lý song ngữ Việt - Anh xuất sắc, hỗ trợ context lớn, tốc độ phản hồi dưới 1 giây.
                </p>
              </div>

              {/* Provider 2: Local Knowledge Engine */}
              <div
                onClick={() =>
                  setConfig({
                    ...config,
                    general: { ...config.general, provider: "local", model: "local-rules" },
                  })
                }
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.general.provider === "local"
                    ? "bg-emerald-400/10 border-emerald-400 text-white shadow-lg shadow-emerald-400/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-emerald-400" />
                    Chuyên Gia Cục Bộ (Offline)
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold">
                    0đ Chi Phí
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Dựa 100% trên bộ tri thức và câu hỏi huấn luyện của NS Building, không phụ thuộc bên thứ 3.
                </p>
              </div>

              {/* Provider 3: OpenAI */}
              <div
                onClick={() =>
                  setConfig({
                    ...config,
                    general: { ...config.general, provider: "openai", model: "gpt-4o-mini" },
                  })
                }
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.general.provider === "openai"
                    ? "bg-blue-400/10 border-blue-400 text-white shadow-lg shadow-blue-400/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    OpenAI GPT-4o
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-300 font-bold">
                    Tiêu Chuẩn
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Sử dụng GPT-4o hoặc GPT-4o-mini với khóa API Key riêng của bạn.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Phiên bản mô hình (Model Version)
                </label>
                <select
                  value={config.general.model}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      general: { ...config.general, model: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {config.general.provider === "gemini" && (
                    <>
                      <option value="gemini-1.5-flash">gemini-1.5-flash (Nhanh & Tối ưu chi phí)</option>
                      <option value="gemini-1.5-pro">gemini-1.5-pro (Tư duy kiến trúc sâu sắc)</option>
                      <option value="gemini-2.0-flash">gemini-2.0-flash (Thế hệ mới nhất)</option>
                    </>
                  )}
                  {config.general.provider === "openai" && (
                    <>
                      <option value="gpt-4o-mini">gpt-4o-mini (Tiết kiệm, phản hồi nhanh)</option>
                      <option value="gpt-4o">gpt-4o (Thông minh toàn diện)</option>
                    </>
                  )}
                  {config.general.provider === "local" && (
                    <option value="local-rules">NS Building Expert Rule & Knowledge Engine</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>API Key ({config.general.provider === "gemini" ? "Google AI Studio" : "OpenAI"})</span>
                  <span className="text-[10px] text-slate-400">
                    {config.general.provider === "local" ? "Không yêu cầu" : "Cấu hình server-only qua biến môi trường"}
                  </span>
                </label>
                <div className="relative rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5">
                  <p className="text-xs font-mono text-slate-400">
                    {stats?.hasServerApiKey
                      ? "✓ GEMINI_API_KEY đã được cấu hình trên máy chủ"
                      : "Chưa cấu hình GEMINI_API_KEY — bot sẽ dùng bộ tri thức cục bộ"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Vì lý do bảo mật, API key chỉ được đặt trong biến môi trường server (GEMINI_API_KEY), không lưu trong CMS.
                  </p>
                </div>
              </div>
            </div>

            {/* Hyperparameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-800">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Nhiệt độ sáng tạo (Temperature): {config.general.temperature}
                  </label>
                  <span className="text-[10px] text-amber-400">
                    {config.general.temperature <= 0.3
                      ? "Chính xác & kỷ luật cao (Khuyên dùng)"
                      : config.general.temperature <= 0.7
                      ? "Cân bằng & tự nhiên"
                      : "Sáng tạo cao"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.general.temperature}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      general: { ...config.general, temperature: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0.0 (Chính xác)</span>
                  <span>0.5 (Cân bằng)</span>
                  <span>1.0 (Sáng tạo)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Giới hạn độ dài phản hồi (Max Tokens): {config.general.maxTokens} tokens
                </label>
                <input
                  type="number"
                  min="100"
                  max="2000"
                  step="50"
                  value={config.general.maxTokens}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      general: { ...config.general, maxTokens: parseInt(e.target.value) || 600 },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Khoảng 600 tokens tương đương ~300 từ tiếng Việt hoặc 450 từ tiếng Anh.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HUẤN LUYỆN TÍNH CÁCH (PERSONA & DIRECTIVES) */}
      {/* ========================================================================= */}
      {activeSubTab === "persona" && (
        <div className="space-y-6">
          {/* Identity & Credentials */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>Định Danh & Pháp Lý Chuyên Môn</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kỹ Sư Trưởng / Giám Đốc
                </label>
                <input
                  type="text"
                  value={config.persona.directorName}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      persona: { ...config.persona, directorName: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mã Số Giấy Phép LBP NZ
                </label>
                <input
                  type="text"
                  value={config.persona.lbpLicense}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      persona: { ...config.persona, lbpLicense: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-amber-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hotline Điện Thoại
                </label>
                <input
                  type="text"
                  value={config.persona.phone}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      persona: { ...config.persona, phone: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Địa Bàn Trọng Tâm
                </label>
                <input
                  type="text"
                  value={config.persona.primaryRegion}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      persona: { ...config.persona, primaryRegion: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tác phong & Giọng điệu giao tiếp (Tone of Voice)
              </label>
              <input
                type="text"
                value={config.persona.tone}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    persona: { ...config.persona, tone: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Master System Prompt VI & EN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  Master System Prompt (Tiếng Việt)
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {config.persona.systemPrompt_vi.length} ký tự
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Chỉ thị cốt lõi điều khiển toàn bộ hành vi, xưng hô và quy tắc tư vấn tiếng Việt.
              </p>
              <textarea
                rows={14}
                value={config.persona.systemPrompt_vi}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    persona: { ...config.persona, systemPrompt_vi: e.target.value },
                  })
                }
                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono leading-relaxed focus:border-amber-400 focus:outline-none resize-none"
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Master System Prompt (English)
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {config.persona.systemPrompt_en.length} characters
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Core system instructions for English-speaking clients in Auckland.
              </p>
              <textarea
                rows={14}
                value={config.persona.systemPrompt_en}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    persona: { ...config.persona, systemPrompt_en: e.target.value },
                  })
                }
                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono leading-relaxed focus:border-amber-400 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Guardrails (Quy tắc an toàn) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Quy Tắc An Toàn & Giới Hạn Nghiêm Ngặt (Guardrails)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              AI sẽ tuyệt đối tuân theo các ranh giới này, không đưa ra thông tin sai lệch gây rủi ro pháp lý hay cam kết giá bừa bãi.
            </p>

            <div className="space-y-2 mb-4">
              {(config.persona.guardrails || []).map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-200 group hover:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{rule}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteGuardrail(idx)}
                    className="text-slate-400 hover:text-red-400 transition-colors p-1"
                    title="Xóa quy tắc này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newGuardrail}
                onChange={(e) => setNewGuardrail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddGuardrail()}
                placeholder="Thêm một giới hạn bảo vệ mới (ví dụ: Không bao giờ báo giá hoàn công mà không khảo sát)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddGuardrail}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Thêm</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KHO TRI THỨC & BỘ HUẤN LUYỆN Q&A */}
      {/* ========================================================================= */}
      {activeSubTab === "knowledge" && (
        <div className="space-y-6">
          {/* Pricing Guide Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-400" />
                  <span>Khung Giá Thị Trường Auckland Được Nạp Vào Trí Nhớ AI</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  AI sẽ trích xuất các mức giá này khi khách hàng hỏi chi phí tham khảo từng hạng mục.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(config.knowledgeBase?.pricingGuide || []).map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{p.category}</span>
                    <input
                      type="text"
                      value={p.rangeNZD}
                      onChange={(e) => {
                        const updated = [...config.knowledgeBase.pricingGuide];
                        updated[idx].rangeNZD = e.target.value;
                        setConfig({
                          ...config,
                          knowledgeBase: { ...config.knowledgeBase, pricingGuide: updated },
                        });
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-amber-400 w-44 text-right focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={p.description}
                    onChange={(e) => {
                      const updated = [...config.knowledgeBase.pricingGuide];
                      updated[idx].description = e.target.value;
                      setConfig({
                        ...config,
                        knowledgeBase: { ...config.knowledgeBase, pricingGuide: updated },
                      });
                    }}
                    className="w-full bg-slate-900/60 border border-slate-800/80 rounded-lg p-2 text-[11px] text-slate-300 resize-none focus:outline-none focus:border-slate-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Training FAQs Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <span>Bộ Câu Hỏi & Câu Trả Lời Mẫu Huấn Luyện (Few-Shot FAQs)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Các câu trả lời chuẩn mực giúp AI trả lời chính xác và phản xạ ngay lập tức khi gặp tình huống tương tự.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingFaq({
                    id: `faq-${Date.now()}`,
                    category: "bathrooms",
                    question_vi: "",
                    answer_vi: "",
                    question_en: "",
                    answer_en: "",
                    keywords: [],
                    enabled: true,
                  });
                  setFaqModalOpen(true);
                }}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shrink-0 transition-all shadow-md shadow-amber-400/10"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Câu Hỏi Huấn Luyện</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi hoặc từ khóa huấn luyện..."
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: "all", label: "Tất cả" },
                  { id: "bathrooms", label: "Phòng tắm" },
                  { id: "flooring", label: "Sàn gỗ" },
                  { id: "kitchen", label: "Tủ bếp" },
                  { id: "consent", label: "Council" },
                  { id: "lbp", label: "Bằng LBP" },
                  { id: "contact", label: "Khu vực" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFaqCategoryFilter(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      faqCategoryFilter === cat.id
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-xl">
                  Không tìm thấy câu hỏi huấn luyện nào phù hợp.
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 uppercase">
                            {faq.category}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              faq.enabled
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {faq.enabled ? "Đang bật" : "Tạm ngưng"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white pt-1">{faq.question_vi}</h4>
                        <div className="text-xs text-slate-400 italic">{faq.question_en}</div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setEditingFaq(faq);
                            setFaqModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors"
                          title="Chỉnh sửa câu hỏi"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Bạn có chắc muốn xóa câu hỏi huấn luyện này?")) {
                              const updated = (config.trainingFaqs || []).filter((f) => f.id !== faq.id);
                              setConfig({ ...config, trainingFaqs: updated });
                              showToast("Đã xóa câu hỏi huấn luyện!");
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <div className="font-semibold text-amber-400/90 mb-1">
                        Câu trả lời chuẩn của AI:
                      </div>
                      <p>{faq.answer_vi}</p>
                    </div>

                    {faq.keywords && faq.keywords.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> Từ khóa kích hoạt:
                        </span>
                        {faq.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[10px] border border-slate-800"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: BẮT LEAD & KHÁCH HÀNG (LEAD CAPTURE & INBOX) */}
      {/* ========================================================================= */}
      {activeSubTab === "leads" && (
        <div className="space-y-6">
          {/* Welcome & Prompt Chips Configuration */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <span>Kịch Bản Lời Chào & Câu Hỏi Gợi Ý Nhanh</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tin nhắn chào mừng ban đầu (Tiếng Việt)
                </label>
                <textarea
                  rows={3}
                  value={config.leadCapture.welcome_vi}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      leadCapture: { ...config.leadCapture, welcome_vi: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Welcome Message (English)
                </label>
                <textarea
                  rows={3}
                  value={config.leadCapture.welcome_en}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      leadCapture: { ...config.leadCapture, welcome_en: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Thông báo xác nhận khi đã ghi nhận số điện thoại (Tiếng Việt)
                </label>
                <textarea
                  rows={3}
                  value={config.leadCapture.leadSuccess_vi}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      leadCapture: { ...config.leadCapture, leadSuccess_vi: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Lead Confirmation Response (English)
                </label>
                <textarea
                  rows={3}
                  value={config.leadCapture.leadSuccess_en}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      leadCapture: { ...config.leadCapture, leadSuccess_en: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Các câu gợi ý nhanh trên Chatbox (Tiếng Việt)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(config.leadCapture.promptChips_vi || []).map((chip, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-slate-200 text-xs rounded-full border border-slate-800"
                    >
                      <span>{chip}</span>
                      <button
                        onClick={() => handleDeleteChip("vi", idx)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChipVi}
                    placeholder="Thêm nút gợi ý..."
                    onChange={(e) => setNewChipVi(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddChip("vi")}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => handleAddChip("vi")}
                    className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Quick Prompt Chips (English)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(config.leadCapture.promptChips_en || []).map((chip, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-slate-200 text-xs rounded-full border border-slate-800"
                    >
                      <span>{chip}</span>
                      <button
                        onClick={() => handleDeleteChip("en", idx)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChipEn}
                    placeholder="Add prompt chip..."
                    onChange={(e) => setNewChipEn(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddChip("en")}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => handleAddChip("en")}
                    className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Captured Leads Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  <span>Hộp Thư Khách Hàng Tiềm Năng (Captured Leads)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tự động thu thập từ cuộc trò chuyện khi khách để lại Số Điện Thoại hoặc Email.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                Tổng cộng: {config.capturedLeads?.length || 0} khách
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                    <th className="p-3 font-semibold">Khách Hàng / Liên Hệ</th>
                    <th className="p-3 font-semibold">Khu Vực (Suburb)</th>
                    <th className="p-3 font-semibold">Nội Dung Nhắn</th>
                    <th className="p-3 font-semibold">Thời Gian</th>
                    <th className="p-3 font-semibold">Trạng Thái Xử Lý</th>
                    <th className="p-3 font-semibold text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(!config.capturedLeads || config.capturedLeads.length === 0) ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Chưa có khách hàng nào để lại số điện thoại.
                      </td>
                    </tr>
                  ) : (
                    config.capturedLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white">{lead.customerName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {lead.type === "phone" ? (
                              <a
                                href={`tel:${lead.contact}`}
                                className="inline-flex items-center gap-1 text-amber-400 hover:underline font-mono"
                              >
                                <Phone className="w-3 h-3" />
                                {lead.contact}
                              </a>
                            ) : (
                              <a
                                href={`mailto:${lead.contact}`}
                                className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                              >
                                <Mail className="w-3 h-3" />
                                {lead.contact}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-slate-300">{lead.suburb || "Auckland"}</td>
                        <td className="p-3 text-slate-300 max-w-xs truncate" title={lead.message}>
                          {lead.message}
                        </td>
                        <td className="p-3 text-slate-400 whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleDateString()}{" "}
                          <span className="text-[10px]">
                            {new Date(lead.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleLeadStatusChange(lead.id, e.target.value as CapturedLead["status"])
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border focus:outline-none ${
                              lead.status === "new"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : lead.status === "site_visit"
                                ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                                : lead.status === "quoted"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                : lead.status === "contacted"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            <option value="new">Mới nhận (Cần gọi)</option>
                            <option value="contacted">Đã gọi điện tư vấn</option>
                            <option value="site_visit">Đã hẹn khảo sát tận nơi</option>
                            <option value="quoted">Đã gửi bảng dự toán</option>
                            <option value="closed">Hoàn tất / Đã ký HĐ</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Xóa khách hàng này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PHÒNG THỬ NGHIỆM AI (INTERACTIVE SANDBOX) */}
      {/* ========================================================================= */}
      {activeSubTab === "sandbox" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Chat Simulator */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[650px] overflow-hidden shadow-2xl">
            {/* Simulator Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    {config.general.botName}
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Engine: <span className="text-amber-400">{config.general.provider}</span> ({config.general.model})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setSandboxLocale("vi")}
                    className={`px-2.5 py-1 rounded font-bold transition-colors ${
                      sandboxLocale === "vi"
                        ? "bg-amber-400 text-slate-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Tiếng Việt
                  </button>
                  <button
                    onClick={() => setSandboxLocale("en")}
                    className={`px-2.5 py-1 rounded font-bold transition-colors ${
                      sandboxLocale === "en"
                        ? "bg-amber-400 text-slate-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    English
                  </button>
                </div>

                <button
                  onClick={() =>
                    setSandboxMessages([
                      {
                        sender: "bot",
                        text: "Cuộc trò chuyện thử nghiệm đã được làm mới. Mời bạn gõ câu hỏi để kiểm tra phản hồi.",
                        time: "Vừa xong",
                      },
                    ])
                  }
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  title="Xóa lịch sử chat thử"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulator Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/70 text-xs">
              {sandboxMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-amber-400 text-slate-950 font-medium rounded-br-none"
                        : "bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 border-t border-white/10 text-[9px] opacity-70">
                      <span>{msg.source ? `Nguồn: ${msg.source}` : ""}</span>
                      <span>{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}

              {sandboxLoading && (
                <div className="flex gap-2 items-center text-slate-400 text-xs pl-9">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="italic">AI đang suy nghĩ và tổng hợp tri thức...</span>
                </div>
              )}

              <div ref={sandboxChatEndRef} />
            </div>

            {/* Quick Test Prompts */}
            <div className="p-2 bg-slate-950 border-t border-slate-800 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
              {[
                "Sửa phòng tắm ở Takapuna giá bao nhiêu?",
                "Sàn gỗ sồi có bị cong vênh không?",
                "Có cần xin giấy phép Council không?",
                "Gọi cho tôi số 021 555 8899 tư vấn nhé",
              ].map((txt, i) => (
                <button
                  key={i}
                  onClick={() => handleSandboxSend(txt)}
                  className="whitespace-nowrap px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-full border border-slate-800 transition-colors shrink-0"
                >
                  {txt}
                </button>
              ))}
            </div>

            {/* Simulator Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSandboxSend();
              }}
              className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2"
            >
              <input
                type="text"
                value={sandboxInput}
                onChange={(e) => setSandboxInput(e.target.value)}
                placeholder="Gõ thử câu hỏi của khách hàng (VD: chi phí phòng tắm, số điện thoại...)"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!sandboxInput.trim() || sandboxLoading}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right 1 Col: Response Inspector & Quick Fine-Tuner */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-amber-400" />
                <span>Phân Tích Phản Hồi AI</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Cơ chế phản hồi:</div>
                  <div className="font-bold text-amber-400 mt-0.5">
                    {lastAnalysis?.source || "Chưa có tương tác"}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Bắt Lead (Số ĐT/Email):</div>
                  <div className="font-bold mt-0.5 flex items-center gap-1.5">
                    {lastAnalysis?.leadDetected ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Có nhận diện thông tin liên hệ!
                      </span>
                    ) : (
                      <span className="text-slate-400">Chưa phát hiện</span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">FAQ Huấn Luyện Khớp:</div>
                  <div className="font-mono text-slate-300 mt-0.5">
                    {lastAnalysis?.matchedFaqId || "Tổng hợp từ tri thức"}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Fine-Tuning Card */}
            <div className="bg-gradient-to-br from-amber-400/10 via-slate-900 to-slate-900 border border-amber-400/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Huấn Luyện Nhanh (1-Click)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Nếu bạn thấy câu trả lời của AI chưa hoàn toàn đúng ý, bạn có thể lưu câu hỏi vừa thử nghiệm thành một cặp FAQ chuẩn mực ngay lập tức!
              </p>
              <button
                onClick={() => {
                  const lastUser = [...sandboxMessages].reverse().find((m) => m.sender === "user");
                  const lastBot = [...sandboxMessages].reverse().find((m) => m.sender === "bot");
                  setEditingFaq({
                    id: `faq-${Date.now()}`,
                    category: "bathrooms",
                    question_vi: lastUser ? lastUser.text : "",
                    answer_vi: lastBot ? lastBot.text : "",
                    question_en: "",
                    answer_en: "",
                    keywords: [],
                    enabled: true,
                  });
                  setFaqModalOpen(true);
                }}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Câu Vừa Thử Vào Q&A Chuẩn</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FAQ ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {faqModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>
                  {editingFaq.question_vi ? "Chỉnh Sửa Câu Hỏi Huấn Luyện" : "Thêm Câu Hỏi Huấn Luyện Mới"}
                </span>
              </h3>
              <button
                onClick={() => {
                  setFaqModalOpen(false);
                  setEditingFaq(null);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveFaqModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Chuyên mục
                  </label>
                  <select
                    value={editingFaq.category}
                    onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="bathrooms">Phòng tắm (Bathrooms)</option>
                    <option value="flooring">Sàn gỗ (Flooring)</option>
                    <option value="kitchen">Tủ bếp (Kitchen & Joinery)</option>
                    <option value="consent">Council Consent & Pháp lý</option>
                    <option value="lbp">Bằng thợ LBP & Bảo đảm</option>
                    <option value="contact">Khu vực & Báo giá</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <span className="text-xs text-slate-300 font-semibold">Kích hoạt câu này:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingFaq.enabled}
                      onChange={(e) => setEditingFaq({ ...editingFaq, enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Câu hỏi mẫu của khách hàng (Tiếng Việt) *
                </label>
                <input
                  type="text"
                  required
                  value={editingFaq.question_vi}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question_vi: e.target.value })}
                  placeholder="Ví dụ: Chi phí chống thấm phòng tắm theo chuẩn E3 khoảng bao nhiêu?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Câu trả lời chuẩn mực của Kỹ sư NS Building (Tiếng Việt) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer_vi}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer_vi: e.target.value })}
                  placeholder="Nhập câu trả lời chính xác, kèm lời mời khách để lại SĐT để khảo sát..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sample Question (English)
                  </label>
                  <input
                    type="text"
                    value={editingFaq.question_en}
                    onChange={(e) => setEditingFaq({ ...editingFaq, question_en: e.target.value })}
                    placeholder="e.g. How much does E3 waterproofing cost?"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ideal Response (English)
                  </label>
                  <textarea
                    rows={2}
                    value={editingFaq.answer_en}
                    onChange={(e) => setEditingFaq({ ...editingFaq, answer_en: e.target.value })}
                    placeholder="e.g. Under NZ Building Code E3/AS1..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Từ khóa kích hoạt (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={(editingFaq.keywords || []).join(", ")}
                  onChange={(e) => {
                    const list = e.target.value
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean);
                    setEditingFaq({ ...editingFaq, keywords: list });
                  }}
                  placeholder="chống thấm, e3, waterproof, council, màng lỏng"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setFaqModalOpen(false);
                    setEditingFaq(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20"
                >
                  Cập Nhật Câu Hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
