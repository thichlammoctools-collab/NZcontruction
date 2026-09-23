"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Phone, CheckCircle2 } from "lucide-react";
import aiConfig from "@/content/ai_config.json";

interface AIChatWidgetProps {
  locale: "en" | "vi";
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export default function AIChatWidget({ locale }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [leadCollected, setLeadCollected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message based on locale
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeText =
        locale === "vi"
          ? (aiConfig?.leadCapture?.welcome_vi || "Xin chào! Em là Trợ lý AI của NS Building. Anh/Chị đang cần cải tạo hay sửa chữa hạng mục nào tại New Zealand ạ?")
          : (aiConfig?.leadCapture?.welcome_en || "Kia Ora! I'm the NS Building AI Assistant. How can I help you with your renovation project in New Zealand today?");

      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [locale, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, locale }),
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.leadCaptured) {
        setLeadCollected(true);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setIsTyping(false);
      const fallbackReply =
        locale === "vi"
          ? "Cảm ơn quý khách! Anh Nguyễn Sơn sẽ gọi lại tư vấn chi tiết cho quý khách ngay. Quý khách cũng có thể gọi hotline: 027 666 6510."
          : "Thank you! Nguyen Son and the NS Building team will review this and get back to you promptly. For urgent jobs, please call 027 666 6510.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const quickPicks =
    locale === "vi"
      ? ["Cải tạo phòng tắm", "Làm mới sàn gỗ", "Đóng tủ bếp", "Báo giá trọn gói"]
      : ["Bathroom Renovation", "Flooring Solution", "Kitchen Cabinets", "Get a Free Quote"];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-2 border-bronze transition-transform hover:scale-105"
          aria-label="Open AI Assistant"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </span>
          <MessageSquare className="w-6 h-6 text-bronze" />
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[540px] bg-white rounded-2xl shadow-2xl border border-border-light flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* HEADER */}
          <div className="bg-primary text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-bronze">
                <Bot className="w-5 h-5 text-bronze" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  NS Building AI Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                </span>
                <span className="text-[11px] text-slate-300">
                  {locale === "vi" ? "Trực tuyến 24/7 &bull; Tiếp nhận báo giá" : "Online 24/7 &bull; Instant Quote Intake"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MESSAGES LIST */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-bronze shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      m.sender === "user" ? "text-slate-300" : "text-slate-400"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-bronze flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-xs pl-9">
                <span className="animate-pulse">
                  {locale === "vi" ? "Trợ lý đang nhập..." : "Assistant is typing..."}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK SUGGESTIONS */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {quickPicks.map((pick, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(pick);
                }}
                className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors border border-slate-200 shrink-0"
              >
                {pick}
              </button>
            ))}
          </div>

          {/* INPUT FORM */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-border-light flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={locale === "vi" ? "Nhập câu hỏi hoặc số điện thoại..." : "Type your message or phone..."}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-3.5 py-2 rounded-lg font-bold text-xs flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4 text-bronze" />
            </button>
          </form>

          {/* BOTTOM DIRECT CALL STRIP */}
          <div className="bg-slate-900 py-1.5 px-4 text-center text-[10px] text-slate-300 flex items-center justify-center gap-1.5">
            <Phone className="w-3 h-3 text-bronze" />
            <span>{locale === "vi" ? "Hoặc gọi hotline trực tiếp:" : "Or call directly:"}</span>
            <a href="tel:0276666510" className="text-bronze font-bold hover:underline">
              027 666 6510
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
