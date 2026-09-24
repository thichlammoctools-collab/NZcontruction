"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, PhoneCall } from "lucide-react";

interface HeaderProps {
  locale: "en" | "vi";
  dict: any;
  onToggleLocale?: (locale: "en" | "vi") => void;
}

export default function Header({ locale, dict, onToggleLocale }: HeaderProps) {
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

  const isHomeActive = pathname === `/${locale}` || pathname === `/${locale}/` || pathname === "/";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-border-light">
      {/* TOP UTILITY BAR (DESKTOP ONLY) */}
      <div className="bg-primary-container text-on-primary py-1.5 px-4 sm:px-6 lg:px-12 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary-fixed text-[16px]">call</span>
              Phone:{" "}
              <a href="tel:0276666510" className="hover:underline text-surface-bright font-bold">
                027 666 6510
              </a>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary-fixed text-[16px]">smartphone</span>
              Mobile:{" "}
              <a href="tel:0211531510" className="hover:underline text-surface-bright font-bold">
                021 153 1510
              </a>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary-fixed text-[16px]">mail</span>
              <a href="mailto:contact@nsbuilding.co.nz" className="hover:underline text-surface-bright">
                contact@nsbuilding.co.nz
              </a>
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="material-symbols-outlined text-secondary-fixed text-[16px]">location_on</span>
              {dict.nav.location}
            </span>

            {/* LANGUAGE SWITCHER */}
            <div className="flex items-center space-x-1 pl-3 bg-primary px-2.5 py-0.5 rounded-lg border border-slate-700">
              <Link
                href={getSwitchLocaleUrl("en")}
                onClick={() => handleLocaleSwitch("en")}
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                  locale === "en" ? "text-surface-bright font-extrabold" : "text-on-primary-container hover:text-surface-bright"
                }`}
                aria-label="Switch to English"
              >
                EN
              </Link>
              <span className="text-on-primary-container text-xs">|</span>
              <Link
                href={getSwitchLocaleUrl("vi")}
                onClick={() => handleLocaleSwitch("vi")}
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                  locale === "vi" ? "text-surface-bright font-extrabold" : "text-on-primary-container hover:text-surface-bright"
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
      <div className="h-16 md:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* LOGO */}
        <Link href={`/${locale}`} className="flex items-center group">
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1WV-uToml-V3DiWbTogPbJwT5vWlBCvxsKAoa_dKZELqw3WBBFFgOLflUG5o0pc72ci6JcEJRZWJlef0FVAivsvFWBhJ9M8pYcbNnusfAcEe_4idhC0YkjTKdT8atgDrk6IU9CMOHXgF0S94tk1AJeFihyfYncdOxBcHT8WjHnod4MzhTnd7QkHnPye4O-U8IuZSt78yKK3UD9-5Cg6zbHZUAVJqSutHZ8HAtlzUKMs"
            alt="NS Building - Residential Craftsmen NZ"
            className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
          <span className="sr-only">NS Building - Residential Craftsmen NZ</span>
        </Link>

        {/* DESKTOP NAV LINKS (VISIBLE ONLY ON LG SCREENS) */}
        <nav className="hidden lg:flex items-center gap-3 font-semibold text-sm">
          <Link
            href={`/${locale}`}
            className={`transition-colors px-3 py-2 rounded-lg ${
              isHomeActive
                ? "bg-surface-container-high text-on-surface font-bold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {dict.nav.home}
          </Link>
          <Link
            href={`/${locale}/#services`}
            className="text-on-surface-variant hover:text-on-surface transition-colors px-3 py-2 rounded-lg"
          >
            {dict.nav.services}
          </Link>
          <Link
            href={`/${locale}/#work-section`}
            className="text-on-surface-variant hover:text-on-surface transition-colors px-3 py-2 rounded-lg"
          >
            {dict.nav.work}
          </Link>
          <Link
            href={`/${locale}/#about`}
            className="text-on-surface-variant hover:text-on-surface transition-colors px-3 py-2 rounded-lg"
          >
            {dict.nav.about || "About"}
          </Link>
          <Link
            href={`/${locale}/#reviews`}
            className="text-on-surface-variant hover:text-on-surface transition-colors px-3 py-2 rounded-lg"
          >
            {dict.nav.reviews}
          </Link>
          <Link
            href={`/${locale}/#contact`}
            className="text-on-surface-variant hover:text-on-surface transition-colors px-3 py-2 rounded-lg"
          >
            {dict.nav.contact}
          </Link>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Mobile Language switch */}
          <div className="flex md:hidden items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <Link
              href={getSwitchLocaleUrl("en")}
              onClick={() => handleLocaleSwitch("en")}
              className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                locale === "en" ? "bg-bronze text-white font-extrabold shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              EN
            </Link>
            <Link
              href={getSwitchLocaleUrl("vi")}
              onClick={() => handleLocaleSwitch("vi")}
              className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                locale === "vi" ? "bg-bronze text-white font-extrabold shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              VI
            </Link>
          </div>

          {/* Quick Direct Call Button on Mobile */}
          <a
            href="tel:0276666510"
            className="flex md:hidden items-center justify-center w-8 h-8 rounded-full bg-bronze/15 text-bronze hover:bg-bronze hover:text-white transition-colors"
            aria-label="Call NS Building"
          >
            <PhoneCall className="w-4 h-4" />
          </a>

          {/* Desktop/Tablet CTA Button */}
          <a
            href={`/${locale}/#quote-section`}
            className="hidden sm:inline-flex bg-primary text-on-primary font-bold text-xs uppercase sm:text-sm tracking-wide px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-slate-800 transition-all duration-200 shadow-sm"
          >
            {dict.nav.quote}
          </a>
        </div>
      </div>
    </header>
  );
}
