"use client";

import React from "react";
import siteSettings from "@/content/site_settings.json";

export function WhatsAppIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

export function MessengerIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.908 1.457 5.518 3.735 7.199V22l3.411-1.872c.904.251 1.864.387 2.854.387 5.523 0 10-4.145 10-9.257C22 6.145 17.523 2 12 2zm1.061 12.446l-2.58-2.752-5.034 2.752 5.539-5.882 2.645 2.752 4.968-2.752-5.538 5.882z" />
    </svg>
  );
}

export function FacebookIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

interface SocialChatButtonsProps {
  locale: "en" | "vi";
  whatsapp?: string;
  facebook?: string;
  showWhatsapp?: boolean;
  showFacebook?: boolean;
}

export function formatWhatsAppUrl(numberStr: string, message: string): string {
  let clean = numberStr.replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) {
    clean = "64" + clean.substring(1);
  } else if (!clean.startsWith("64") && clean.length <= 10) {
    clean = "64" + clean;
  }
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export default function SocialChatButtons({
  locale,
  whatsapp,
  facebook,
  showWhatsapp,
  showFacebook,
}: SocialChatButtonsProps) {
  const isVi = locale === "vi";

  const rawWhatsapp =
    whatsapp || siteSettings.whatsapp || siteSettings.mobile || "021 153 1510";
  const rawFacebook =
    facebook ||
    siteSettings.facebookMessenger ||
    siteSettings.facebook ||
    "https://m.me/nsbuildingnz";

  const isWhatsappEnabled =
    showWhatsapp !== undefined
      ? showWhatsapp
      : (siteSettings as any).toggles?.showWhatsappBtn !== false;

  const isFacebookEnabled =
    showFacebook !== undefined
      ? showFacebook
      : (siteSettings as any).toggles?.showFacebookBtn !== false;

  if (!isWhatsappEnabled && !isFacebookEnabled) {
    return null;
  }

  const whatsappGreeting = isVi
    ? "Xin chào NS Building! Tôi cần tư vấn về dịch vụ cải tạo / xây dựng nhà tại New Zealand."
    : "Kia Ora NS Building! I would like to inquire about residential renovation and construction services in NZ.";

  const whatsappLink = formatWhatsAppUrl(rawWhatsapp, whatsappGreeting);

  let messengerLink = rawFacebook;
  if (!messengerLink.startsWith("http")) {
    messengerLink = `https://m.me/${messengerLink.replace(/^@/, "")}`;
  }

  return (
    <div
      className="fixed bottom-[134px] sm:bottom-[84px] right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-none"
      aria-label={isVi ? "Kênh chat nhanh" : "Quick chat channels"}
    >
      {/* 1. WHATSAPP CHAT BUTTON */}
      {isWhatsappEnabled && (
        <div className="relative group flex items-center pointer-events-auto">
          {/* Tooltip on hover */}
          <div
            role="tooltip"
            className="hidden sm:flex items-center gap-1.5 absolute right-full mr-3 px-3 py-1.5 bg-slate-900/95 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none border border-slate-700/60"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
            <span>
              {isVi ? "Chat WhatsApp: " : "Chat on WhatsApp: "}
              <strong className="text-emerald-400 font-bold">
                {rawWhatsapp.startsWith("64") ? `+${rawWhatsapp}` : rawWhatsapp}
              </strong>
            </span>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isVi ? "Chat trực tiếp qua WhatsApp" : "Chat directly on WhatsApp"}
            className="relative w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg hover:shadow-2xl shadow-emerald-900/30 transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/90"
          >
            {/* Ping animation indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border border-white"></span>
            </span>

            <WhatsAppIcon className="w-6 h-6" />
          </a>
        </div>
      )}

      {/* 2. FACEBOOK MESSENGER CHAT BUTTON */}
      {isFacebookEnabled && (
        <div className="relative group flex items-center pointer-events-auto">
          {/* Tooltip on hover */}
          <div
            role="tooltip"
            className="hidden sm:flex items-center gap-1.5 absolute right-full mr-3 px-3 py-1.5 bg-slate-900/95 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none border border-slate-700/60"
          >
            <span className="w-2 h-2 rounded-full bg-[#0084FF]"></span>
            <span>
              {isVi ? "Chat Facebook Messenger" : "Message on Facebook"}
            </span>
          </div>

          <a
            href={messengerLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isVi ? "Chat qua Facebook Messenger" : "Chat on Facebook Messenger"}
            className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#0066FF] to-[#00C6FF] hover:from-[#0055dd] hover:to-[#00b0e8] text-white flex items-center justify-center shadow-lg hover:shadow-2xl shadow-blue-900/30 transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/90"
          >
            <MessengerIcon className="w-6 h-6" />
          </a>
        </div>
      )}
    </div>
  );
}
