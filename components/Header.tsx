"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

interface HeaderProps {
  locale: "en" | "vi";
  dict: any;
  onToggleLocale?: (locale: "en" | "vi") => void;
}

export default function Header({ locale, dict, onToggleLocale }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getSwitchLocaleUrl = (targetLocale: "en" | "vi") => {
    if (!pathname) return `/${targetLocale}`;
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "vi") {
      segments[1] = targetLocale;
      return segments.join("/") || `/${targetLocale}`;
    }
    return `/${targetLocale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  };

  const handleLocaleSwitch = (targetLocale: "en" | "vi") => {
    try {
      document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
    if (onToggleLocale) {
      onToggleLocale(targetLocale);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-border-light shadow-sm">
      {/* TOP UTILITY BAR */}
      <div className="bg-primary text-white py-1.5 px-4 sm:px-8 text-xs font-medium hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <a href="tel:0276666510" className="flex items-center gap-1.5 hover:text-bronze transition-colors">
              <Phone className="w-3.5 h-3.5 text-bronze" />
              <span>Office: <strong>027 666 6510</strong></span>
            </a>
            <a href="tel:0211531510" className="flex items-center gap-1.5 hover:text-bronze transition-colors">
              <Phone className="w-3.5 h-3.5 text-bronze" />
              <span>Mobile: <strong>021 153 1510</strong></span>
            </a>
            <a href="mailto:contact@nsbuilding.co.nz" className="flex items-center gap-1.5 hover:text-bronze transition-colors">
              <Mail className="w-3.5 h-3.5 text-bronze" />
              <span>contact@nsbuilding.co.nz</span>
            </a>
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-bronze" />
              <span>{dict.nav.location}</span>
            </span>

            {/* LANGUAGE SWITCHER */}
            <div className="flex items-center bg-slate-800 rounded px-2 py-0.5 border border-slate-700">
              <Link
                href={getSwitchLocaleUrl("en")}
                onClick={() => handleLocaleSwitch("en")}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                  locale === "en" ? "bg-bronze text-white" : "text-slate-400 hover:text-white"
                }`}
                aria-label="Switch to English"
              >
                EN
              </Link>
              <span className="text-slate-600 mx-1">|</span>
              <Link
                href={getSwitchLocaleUrl("vi")}
                onClick={() => handleLocaleSwitch("vi")}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                  locale === "vi" ? "bg-bronze text-white" : "text-slate-400 hover:text-white"
                }`}
                aria-label="Chuyển sang Tiếng Việt"
              >
                VI
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-lg border border-primary-light shadow-sm group-hover:bg-primary-dark transition-colors">
            <span className="text-bronze font-black tracking-tighter">NS</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-primary leading-none">
              NS BUILDING
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mt-1 flex items-center gap-1">
              Residential Craftsmen NZ
              <ShieldCheck className="w-3 h-3 text-bronze inline" />
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-slate-700">
          <Link href={`/${locale}`} className="hover:text-primary transition-colors">
            {dict.nav.home}
          </Link>
          <Link href={`/${locale}/#services`} className="hover:text-primary transition-colors">
            {dict.nav.services}
          </Link>
          <Link href={`/${locale}/#our-work`} className="hover:text-primary transition-colors">
            {dict.nav.work}
          </Link>
          <Link href={`/${locale}/#reviews`} className="hover:text-primary transition-colors">
            {dict.nav.reviews}
          </Link>
          <Link href={`/${locale}/#contact`} className="hover:text-primary transition-colors">
            {dict.nav.contact}
          </Link>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* Mobile Lang Switcher */}
          <div className="flex md:hidden items-center bg-slate-100 rounded px-1.5 py-0.5 border border-slate-200 mr-1">
            <Link
              href={getSwitchLocaleUrl("en")}
              onClick={() => handleLocaleSwitch("en")}
              className={`px-1.5 py-0.5 text-[11px] font-bold rounded transition-colors ${
                locale === "en" ? "bg-bronze text-white font-extrabold shadow-xs" : "text-slate-600 hover:text-primary"
              }`}
              aria-label="Switch to English"
            >
              EN
            </Link>
            <span className="text-slate-300 mx-0.5">|</span>
            <Link
              href={getSwitchLocaleUrl("vi")}
              onClick={() => handleLocaleSwitch("vi")}
              className={`px-1.5 py-0.5 text-[11px] font-bold rounded transition-colors ${
                locale === "vi" ? "bg-bronze text-white font-extrabold shadow-xs" : "text-slate-600 hover:text-primary"
              }`}
              aria-label="Chuyển sang Tiếng Việt"
            >
              VI
            </Link>
          </div>

          <a
            href="tel:0276666510"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-bronze transition-colors px-3 py-2"
          >
            <Phone className="w-4 h-4 text-bronze" />
            <span>027 666 6510</span>
          </a>

          <a
            href={`/${locale}/#quote`}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow"
          >
            <span>{dict.nav.quote}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-bronze" />
          </a>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-primary lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border-light px-6 py-5 shadow-lg">
          <nav className="flex flex-col space-y-4 font-semibold text-slate-800 text-base">
            <Link
              href={`/${locale}`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100"
            >
              {dict.nav.home}
            </Link>
            <Link
              href={`/${locale}/#services`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100"
            >
              {dict.nav.services}
            </Link>
            <Link
              href={`/${locale}/#our-work`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100"
            >
              {dict.nav.work}
            </Link>
            <Link
              href={`/${locale}/#reviews`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100"
            >
              {dict.nav.reviews}
            </Link>
            <Link
              href={`/${locale}/#contact`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100"
            >
              {dict.nav.contact}
            </Link>
          </nav>

          {/* MOBILE DRAWER LANGUAGE SELECTOR */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {locale === "vi" ? "Ngôn ngữ" : "Language"}
            </span>
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 gap-1">
              <Link
                href={getSwitchLocaleUrl("en")}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLocaleSwitch("en");
                }}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  locale === "en" ? "bg-bronze text-white shadow-sm" : "text-slate-600 hover:text-primary"
                }`}
              >
                English (EN)
              </Link>
              <Link
                href={getSwitchLocaleUrl("vi")}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLocaleSwitch("vi");
                }}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  locale === "vi" ? "bg-bronze text-white shadow-sm" : "text-slate-600 hover:text-primary"
                }`}
              >
                Tiếng Việt (VI)
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2 text-sm text-slate-600">
            <a href="tel:0276666510" className="flex items-center gap-2 font-bold text-primary">
              <Phone className="w-4 h-4 text-bronze" />
              <span>027 666 6510 (Hotline NZ)</span>
            </a>
            <a href="tel:0211531510" className="flex items-center gap-2 font-bold text-primary">
              <Phone className="w-4 h-4 text-bronze" />
              <span>021 153 1510 (Mr. Nguyen Son)</span>
            </a>
            <a href="mailto:contact@nsbuilding.co.nz" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-bronze" />
              <span>contact@nsbuilding.co.nz</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
