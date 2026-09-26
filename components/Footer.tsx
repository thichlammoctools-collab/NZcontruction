"use client";

import React from "react";
import Link from "next/link";
import { Phone, Smartphone, Mail, AtSign, MapPin, CheckCircle2 } from "lucide-react";
import siteSettings from "@/content/site_settings.json";
import { WhatsAppIcon, MessengerIcon, formatWhatsAppUrl } from "@/components/SocialChatButtons";
import Logo from "@/components/Logo";

interface FooterProps {
  locale: "en" | "vi";
  dict: any;
}

export default function Footer({ locale, dict }: FooterProps) {
  return (
    <footer className="w-full bg-surface-container-low border-t border-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-14 pb-28 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* BRAND COLUMN */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="inline-block group">
              <Logo />
            </Link>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {dict.footer.tagline}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                {dict.footer.rights}
              </span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
              {dict.footer.quick_links}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-on-surface-variant">
              <li>
                <Link href={`/${locale}`} className="hover:text-primary transition-colors">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/#services`} className="hover:text-primary transition-colors">
                  {dict.nav.services}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/#work-section`} className="hover:text-primary transition-colors">
                  {dict.nav.work}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/#about`} className="hover:text-primary transition-colors">
                  {dict.nav.about || "About"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/#reviews`} className="hover:text-primary transition-colors">
                  {dict.nav.reviews}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/#contact`} className="hover:text-primary transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/#quote-section`} className="hover:text-primary transition-colors">
                  {dict.nav.quote}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/posts`} className="hover:text-primary transition-colors">
                  {locale === "vi" ? "Cẩm Nang & Kinh Nghiệm" : "Journal & Insights"}
                </Link>
              </li>
            </ul>
          </div>

          {/* TRADE SERVICES */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
              {dict.footer.services}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-on-surface-variant">
              <li>
                <Link href={`/${locale}/services/renovations`} className="hover:text-primary transition-colors">
                  {dict.services.items.renovations.title}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/bathrooms`} className="hover:text-primary transition-colors">
                  {dict.services.items.bathrooms.title}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/cabinets`} className="hover:text-primary transition-colors">
                  {dict.services.items.cabinets.title}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/flooring`} className="hover:text-primary transition-colors">
                  {dict.services.items.flooring.title}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/doors`} className="hover:text-primary transition-colors">
                  {dict.services.items.doors.title}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/painting`} className="hover:text-primary transition-colors">
                  {dict.services.items.painting.title}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/plastering`} className="hover:text-primary transition-colors">
                  {dict.services.items.plastering.title}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/equipment`} className="hover:text-primary transition-colors">
                  {dict.services.items.equipment.title}
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT & SERVICE HUB */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
              {dict.footer.contact_us}
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-on-surface-variant">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <a href="tel:0276666510" className="hover:text-primary font-bold">
                  027 666 6510
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-secondary shrink-0" />
                <a href="tel:0211531510" className="hover:text-primary font-bold">
                  021 153 1510
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <a href="mailto:contact@nsbuilding.co.nz" className="hover:text-primary truncate">
                  contact@nsbuilding.co.nz
                </a>
              </div>
              <div className="flex items-center gap-2">
                <AtSign className="w-4 h-4 text-secondary shrink-0" />
                <a href="mailto:nsbuildingcompany@gmail.com" className="hover:text-primary truncate">
                  nsbuildingcompany@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary shrink-0" />
                <span>Auckland & Greater NZ Region</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <a
                  href={formatWhatsAppUrl(
                    siteSettings.whatsapp || siteSettings.mobile || "64211531510",
                    locale === "vi"
                      ? "Xin chào NS Building! Tôi cần tư vấn về dịch vụ cải tạo / xây dựng nhà tại New Zealand."
                      : "Kia Ora NS Building! I would like to inquire about renovation and construction services in NZ."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary font-bold text-emerald-600"
                >
                  WhatsApp: 021 153 1510
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessengerIcon className="w-4 h-4 text-[#0084FF]" />
                <a
                  href={siteSettings.facebookMessenger || siteSettings.facebook || "https://m.me/nsbuildingnz"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary font-bold text-sky-600"
                >
                  Facebook Messenger
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant border-t border-slate-200">
          <div className="flex items-center gap-3">
            <span>
              Language: <strong className="text-primary">{locale.toUpperCase()}</strong> |{" "}
              <Link href={locale === "en" ? "/vi" : "/en"} className="hover:text-primary transition-colors">
                {locale === "en" ? "VI" : "EN"}
              </Link>
            </span>
            <span className="text-slate-300">•</span>
            <span>Licensed Building Practitioner NZ</span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 gap-y-1">
            <span>{dict.footer.copyright}</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span>
              Made with love -{" "}
              <a
                href="https://drvinh.io.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary font-medium underline underline-offset-2 transition-colors"
              >
                Drvinh.io.vn
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
