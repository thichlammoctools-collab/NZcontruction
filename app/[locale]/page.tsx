import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import ServiceCard from "@/components/ServiceCard";

// Server-safe WhatsApp link helper (mirrors SocialChatButtons logic; the client
// module itself cannot be imported into this server component's scope).
function formatWhatsAppUrl(numberStr: string, message: string): string {
  let clean = numberStr.replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) {
    clean = "64" + clean.substring(1);
  } else if (!clean.startsWith("64") && clean.length <= 10) {
    clean = "64" + clean;
  }
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

// Inline SVG icons so the quick-contact strip stays server-rendered (SEO + LCP).
function WhatsAppIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

function MessengerIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.288 0 0 5.288 0 12c0 2.08.528 4.04 1.464 5.752L0 24l6.428-1.424A11.93 11.93 0 0012 24c6.712 0 12-5.288 12-12S18.712 0 12 0zm0 22a9.93 9.93 0 01-4.888-1.272l-.352-.192-3.6.8.784-3.504-.2-.368A9.93 9.93 0 012 12C2 6.488 6.488 2 12 2s10 4.488 10 10-4.488 10-10 10zm5.328-7.136l-2.528-3.928a1.5 1.5 0 00-2.096-.432L10.5 12.2l-2.288-2.2a1.2 1.2 0 00-1.664.048l-.448.448a1.2 1.2 0 00.048 1.664l4.048 4.2a1.5 1.5 0 002.16.064l3.12-3.792c.4-.48.32-1.184-.16-1.584l-.448-.352a1.2 1.2 0 00-1.664.16z"/>
    </svg>
  );
}

import PortfolioSection from "@/components/PortfolioSection";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import GoogleReviews from "@/components/GoogleReviews";
import QuoteForm from "@/components/QuoteForm";
import AIChatWidget from "@/components/AIChatWidget";
import SocialChatButtons from "@/components/SocialChatButtons";

import { readJsonSafe } from "@/lib/json-store";

export const dynamic = "force-dynamic";

const dictViPath = path.join(process.cwd(), "content", "dictionaries", "vi.json");
const dictEnPath = path.join(process.cwd(), "content", "dictionaries", "en.json");
const siteSettingsPath = path.join(process.cwd(), "content", "site_settings.json");

async function getPageData(locale: string) {
  const dict = await readJsonSafe<any>(locale === "vi" ? dictViPath : dictEnPath, {});
  const siteSettings = await readJsonSafe<any>(siteSettingsPath, {});
  return { dict, siteSettings };
}

interface PageProps {
  params: {
    locale: string;
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = params;

  if (locale !== "en" && locale !== "vi") {
    notFound();
  }

  const { dict, siteSettings } = await getPageData(locale);
  const f1 = dict.featured_flagships?.feature_01 || {};
  const f2 = dict.featured_flagships?.feature_02 || {};
  const pillars = dict.pillars || { items: [] };
  const areas = dict.service_areas || { items: [] };
  const qc = dict.quick_contact || {};

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
      {/* 1. HEADER & TOP UTILITY BAR */}
      <Header locale={locale as "en" | "vi"} dict={dict} />

      <main className="flex-1 pt-16 md:pt-20">
        {/* 2. HERO SECTION */}
        <section className="relative w-full min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden bg-primary">
          {/* Full-bleed background image */}
          <Image
            src={siteSettings?.heroBackgroundImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuAC4zySIsBFsCxbPwZoDwuqZtLQWpoTxQeVfs9GkcCOv8krWekpp7w-Sr4GIn4XjONGNLOByEmndm0tLOLyjs8PwH7QRkKbuuMMi34H0gnPxaPMwqQFVlSToJiD5aGeB16_nvb2zbNYsBr_w-OG4ktIRiEp6kaeOBtvN58A62ECHeBxKOEYa4sU7H5HmQaAugC9OSRbuHdHIOXPkFDOyfyHz-acP9xjnkESnozm5pyPzrINXZNh1K03Cg"}
            alt="NS Building - Architectural Renovation & Interior Craftsmanship"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Subtle dark vignette and readability gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/35"></div>

          {/* Content Container */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-20 lg:py-28 flex flex-col justify-center">
            <div className="max-w-2xl space-y-5 sm:space-y-6">
              {/* Star Rating & Trust Proof Tag */}
              <div className="inline-flex items-center gap-2 text-sm">
                <span className="text-[#f59e0b] tracking-wider text-sm sm:text-base font-bold select-none">
                  ★★★★★
                </span>
                <span className="text-surface-bright/90 font-medium tracking-wide text-xs sm:text-sm">
                  {dict.hero.badge}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-white font-extrabold text-3xl sm:text-5xl lg:text-7xl tracking-tight leading-[1.12]">
                {dict.hero.title_line1}
                <br />
                {dict.hero.title_line2}
              </h1>

              {/* Subtitle Description */}
              <p className="text-white/85 text-sm sm:text-lg lg:text-xl font-normal max-w-xl leading-relaxed">
                {dict.hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a
                  href="#quote-section"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#b6824a] hover:bg-[#a6723b] text-white font-bold text-sm sm:text-base tracking-wide transition-all shadow-lg hover:shadow-xl text-center"
                >
                  {dict.hero.cta_quote}
                </a>
                <a
                  href="#work-section"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-white/50 text-white hover:bg-white/10 font-bold text-sm sm:text-base tracking-wide transition-all backdrop-blur-sm text-center"
                >
                  {dict.hero.cta_work}
                </a>
              </div>
            </div>

            {/* Bottom Subtle Spec Badges */}
            <div className="mt-16 pt-8 border-t border-white/15 max-w-xl grid grid-cols-3 gap-4 text-white">
              <div>
                <span className="block text-2xl sm:text-3xl font-bold text-white">
                  {dict.hero.stats_compliance}
                </span>
                <span className="text-xs text-white/75 uppercase tracking-wider font-medium">
                  {dict.hero.stats_compliance_label}
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-bold text-white">
                  {dict.hero.stats_guarantee}
                </span>
                <span className="text-xs text-white/75 uppercase tracking-wider font-medium">
                  {dict.hero.stats_guarantee_label}
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-bold text-white">
                  {dict.hero.stats_area}
                </span>
                <span className="text-xs text-white/75 uppercase tracking-wider font-medium">
                  {dict.hero.stats_area_label}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHAT WE DO: 8 SERVICES GRID */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 lg:py-24" id="services">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-0.5 w-5 bg-secondary"></span>
                <span className="text-xs uppercase tracking-widest text-secondary font-bold">
                  {dict.services.badge}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {dict.services.title}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-lg leading-relaxed">
              {dict.services.subtitle}
            </p>
          </div>

          {/* 8 Distinct Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(dict.services.items).map(([key, item]: [string, any]) => (
              <ServiceCard
                key={key}
                id={key}
                tag={item.tag}
                title={item.title}
                desc={item.desc}
                iconName={item.icon}
                locale={locale as "en" | "vi"}
                viewServiceText={dict.services.view_service}
              />
            ))}
          </div>
        </section>

        {/* 4. FEATURED CAPABILITIES: EDITORIAL EDIT (FLAGSHIPS) */}
        <section className="w-full bg-surface-container-low py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-20 lg:space-y-28">
            {/* Feature 1: Renovations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
                <div className="inline-flex items-center gap-2">
                  <span className="h-0.5 w-6 bg-secondary"></span>
                  <span className="text-xs uppercase tracking-widest text-secondary font-bold">
                    {f1.tag}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">
                  {f1.title}
                </h2>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  {f1.desc}
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-on-surface">
                  {f1.bullets.map((bullet: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <a
                    href="#quote-section"
                    className="inline-flex items-center gap-2 bg-primary text-on-primary font-bold text-xs uppercase sm:text-sm tracking-wide px-7 py-3 rounded-lg hover:bg-slate-800 transition-all shadow-sm"
                  >
                    <span>{f1.cta}</span>
                    <span className="material-symbols-outlined text-[18px]">east</span>
                  </a>
                </div>
              </div>
              <div className="lg:col-span-6 order-1 lg:order-2">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-surface-dim border border-border-light relative">
                  <Image
                    className="object-cover"
                    alt={f1.title}
                    src={f1.image}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* Feature 2: Bathrooms & Wet Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-6">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-surface-dim border border-border-light relative">
                  <Image
                    className="object-cover"
                    alt={f2.title}
                    src={f2.image}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2">
                  <span className="h-0.5 w-6 bg-secondary"></span>
                  <span className="text-xs uppercase tracking-widest text-secondary font-bold">
                    {f2.tag}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">
                  {f2.title}
                </h2>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  {f2.desc}
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-on-surface">
                  {f2.bullets.map((bullet: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <a
                    href="#quote-section"
                    className="inline-flex items-center gap-2 bg-primary text-on-primary font-bold text-xs uppercase sm:text-sm tracking-wide px-7 py-3 rounded-lg hover:bg-slate-800 transition-all shadow-sm"
                  >
                    <span>{f2.cta}</span>
                    <span className="material-symbols-outlined text-[18px]">east</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

          {/* 5. OUR WORK: PORTFOLIO GALLERY WITH FILTER CONTROLS */}
          <PortfolioSection portfolioDict={dict.portfolio} locale={locale as "en" | "vi"} />

        {/* 6. BEFORE & AFTER SHOWCASE (INTERACTIVE SPLIT) */}
        {siteSettings?.toggles?.showBeforeAfter !== false && (
          <section className="w-full bg-surface-container-low py-20 lg:py-24" id="transformation-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-flex items-center justify-center gap-2 mb-2">
                  <span className="h-0.5 w-6 bg-secondary"></span>
                  <span className="text-xs uppercase tracking-widest text-secondary font-bold">
                    {dict.before_after.badge}
                  </span>
                  <span className="h-0.5 w-6 bg-secondary"></span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  {dict.before_after.title}
                </h2>
                <p className="text-sm sm:text-base text-on-surface-variant mt-2">
                  {dict.before_after.subtitle}
                </p>
              </div>

              {/* Interactive Split Slider Component */}
              <BeforeAfterSlider
                beforeImage={dict.before_after.before_img}
                afterImage={dict.before_after.after_img}
                beforeLabel={dict.before_after.before_label}
                afterLabel={dict.before_after.after_label}
                projectName={dict.before_after.project_name}
                duration={dict.before_after.duration}
                dragHint={dict.before_after.drag_hint}
              />
            </div>
          </section>
        )}

        {/* 7. WHY NS BUILDING: TRUST & CREDIBILITY PILLARS */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 lg:py-24" id="about">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <span className="h-0.5 w-6 bg-secondary"></span>
              <span className="text-xs uppercase tracking-widest text-secondary font-bold">
                {pillars.badge}
              </span>
              <span className="h-0.5 w-6 bg-secondary"></span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              {pillars.title}
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              {pillars.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.items.map((p: any, i: number) => (
              <div
                key={i}
                className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-border-light flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[28px]">{p.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 flex items-center gap-2 text-secondary text-xs font-bold border-t border-slate-100">
                  <span className="material-symbols-outlined text-[18px]">{p.badge_icon}</span>
                  <span>{p.badge_text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. CUSTOMER REVIEWS & SOCIAL PROOF */}
        {siteSettings?.toggles?.showReviews !== false && <GoogleReviews dict={dict} />}

        {/* 9. SERVICE AREAS & LOCAL PRESENCE (WITH MAP) */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 lg:py-24" id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="h-0.5 w-6 bg-secondary"></span>
                <span className="text-xs uppercase tracking-widest text-secondary font-bold">
                  {areas.badge}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {areas.title}
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                {areas.subtitle}
              </p>

              {/* Hub Areas Checklist */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {areas.regions.map((reg: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-on-surface font-semibold">
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      location_on
                    </span>
                    <span>{reg}</span>
                  </div>
                ))}
              </div>

              {/* Rapid Site Visits card */}
              <div className="p-4 bg-surface-container-low rounded-xl space-y-1.5 border border-border-light">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-primary font-bold">
                  <span className="material-symbols-outlined text-secondary text-[18px]">schedule</span>
                  <span>{areas.rapid_title}</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {areas.rapid_desc}
                </p>
              </div>
            </div>

            {/* Right Column: Map Display Container */}
            <div className="lg:col-span-7">
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg bg-surface-dim border border-border-light">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${areas.map_image}')` }}
                ></div>

                {/* Overlay Pin Marker Card */}
                <div className="absolute top-6 left-6 bg-surface/95 backdrop-blur-md p-5 rounded-xl shadow-lg max-w-xs border border-border-light">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      business
                    </span>
                    <span>{areas.hub_title}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">{areas.hub_sub}</p>
                  <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-3">
                    <a
                      className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
                      href="tel:0276666510"
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      <span>027 666 6510</span>
                    </a>
                    <span className="text-outline-variant">•</span>
                    <a
                      className="inline-flex items-center gap-1 text-xs text-secondary font-bold hover:underline"
                      href="mailto:contact@nsbuilding.co.nz"
                    >
                      <span className="material-symbols-outlined text-[16px]">mail</span>
                      <span>Email Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. REQUEST A QUOTE (HIGH-CONVERSION INQUIRY FORM) */}
        {siteSettings?.toggles?.showQuoteForm !== false && <QuoteForm dict={dict} />}

        {/* 11. QUICK CONTACT STRIP (DIRECT ACCESS) */}
        <section className="w-full bg-primary-container text-on-primary py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6">
              <a
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-surface-bright hover:underline"
                href="tel:0276666510"
              >
                <span className="material-symbols-outlined text-secondary-fixed text-[20px]">call</span>
                <span>{qc.phone}</span>
              </a>
              <a
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-surface-bright hover:underline"
                href="tel:0211531510"
              >
                <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
                  smartphone
                </span>
                <span>{qc.mobile}</span>
              </a>
              <a
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-surface-bright hover:underline"
                href="mailto:contact@nsbuilding.co.nz"
              >
                <span className="material-symbols-outlined text-secondary-fixed text-[20px]">mail</span>
                <span>{qc.email}</span>
              </a>

              {/* WhatsApp direct */}
              <a
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
                href={formatWhatsAppUrl(
                  siteSettings?.whatsapp || siteSettings?.mobile || "64211531510",
                  locale === "vi"
                    ? "Xin chào NS Building! Tôi cần tư vấn về dịch vụ cải tạo / xây dựng nhà tại New Zealand."
                    : "Kia Ora NS Building! I would like to inquire about renovation and construction services in NZ."
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp: {siteSettings?.whatsapp || "021 153 1510"}</span>
              </a>

              {/* Facebook Messenger direct */}
              <a
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-400 hover:text-sky-300 hover:underline"
                href={siteSettings?.facebookMessenger || siteSettings?.facebook || "https://m.me/nsbuildingnz"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessengerIcon className="w-4 h-4 text-[#0084FF]" />
                <span>Messenger</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-primary-container">
              <span className="material-symbols-outlined text-secondary-fixed text-[18px]">translate</span>
              <span>{qc.bilingual_support}</span>
            </div>
          </div>
        </section>
      </main>

      {/* 12. FOOTER */}
      <Footer locale={locale as "en" | "vi"} dict={dict} />

      {/* 13. FLOATING SOCIAL CHAT BUTTONS (WHATSAPP & FACEBOOK) */}
      <SocialChatButtons locale={locale as "en" | "vi"} />

      {/* 14. 24/7 AI CHAT ASSISTANT WIDGET */}
      {siteSettings?.toggles?.showChatWidget !== false && (
        <AIChatWidget locale={locale as "en" | "vi"} />
      )}

      {/* 15. FIXED MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav locale={locale as "en" | "vi"} dict={dict} />
    </div>
  );
}
