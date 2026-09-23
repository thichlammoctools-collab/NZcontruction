import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import PortfolioSection from "@/components/PortfolioSection";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import GoogleReviews from "@/components/GoogleReviews";
import QuoteForm from "@/components/QuoteForm";
import AIChatWidget from "@/components/AIChatWidget";

import enDict from "@/content/dictionaries/en.json";
import viDict from "@/content/dictionaries/vi.json";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }];
}

interface PageProps {
  params: {
    locale: string;
  };
}

export default function HomePage({ params }: PageProps) {
  const { locale } = params;

  if (locale !== "en" && locale !== "vi") {
    notFound();
  }

  const dict = locale === "vi" ? viDict : enDict;
  const f1 = dict.featured_flagships.feature_01;
  const f2 = dict.featured_flagships.feature_02;
  const pillars = dict.pillars;
  const areas = dict.service_areas;
  const qc = dict.quick_contact;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
      {/* 1. HEADER & TOP UTILITY BAR */}
      <Header locale={locale as "en" | "vi"} dict={dict} />

      <main className="flex-1 pt-20">
        {/* 2. HERO SECTION */}
        <section className="relative w-full min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden bg-primary">
          {/* Full-bleed background image */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC4zySIsBFsCxbPwZoDwuqZtLQWpoTxQeVfs9GkcCOv8krWekpp7w-Sr4GIn4XjONGNLOByEmndm0tLOLyjs8PwH7QRkKbuuMMi34H0gnPxaPMwqQFVlSToJiD5aGeB16_nvb2zbNYsBr_w-OG4ktIRiEp6kaeOBtvN58A62ECHeBxKOEYa4sU7H5HmQaAugC9OSRbuHdHIOXPkFDOyfyHz-acP9xjnkESnozm5pyPzrINXZNh1K03Cg"
            alt="NS Building - Architectural Renovation & Interior Craftsmanship"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Subtle dark vignette and readability gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/35"></div>

          {/* Content Container */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 lg:py-28 flex flex-col justify-center">
            <div className="max-w-2xl space-y-6">
              {/* Star Rating & Trust Proof Tag */}
              <div className="inline-flex items-center gap-2.5 text-sm">
                <span className="text-[#f59e0b] tracking-wider text-base font-bold select-none">
                  ★★★★★
                </span>
                <span className="text-surface-bright/90 font-medium tracking-wide text-xs sm:text-sm">
                  {dict.hero.badge}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-white font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08]">
                {dict.hero.title_line1}
                <br />
                {dict.hero.title_line2}
              </h1>

              {/* Subtitle Description */}
              <p className="text-white/85 text-base sm:text-lg lg:text-xl font-normal max-w-xl leading-relaxed">
                {dict.hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#quote-section"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-[#b6824a] hover:bg-[#a6723b] text-white font-bold text-sm sm:text-base tracking-wide transition-all shadow-lg hover:shadow-xl"
                >
                  {dict.hero.cta_quote}
                </a>
                <a
                  href="#work-section"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-lg border border-white/50 text-white hover:bg-white/10 font-bold text-sm sm:text-base tracking-wide transition-all backdrop-blur-sm"
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
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-surface-dim border border-border-light">
                  <img
                    className="w-full h-full object-cover"
                    alt={f1.title}
                    src={f1.image}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Feature 2: Bathrooms & Wet Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-6">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-surface-dim border border-border-light">
                  <img
                    className="w-full h-full object-cover"
                    alt={f2.title}
                    src={f2.image}
                    loading="lazy"
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
        <PortfolioSection portfolioDict={dict.portfolio} />

        {/* 6. BEFORE & AFTER SHOWCASE (INTERACTIVE SPLIT) */}
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
        <GoogleReviews dict={dict} />

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
        <QuoteForm dict={dict} />

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

      {/* 13. 24/7 AI CHAT ASSISTANT WIDGET */}
      <AIChatWidget locale={locale as "en" | "vi"} />
    </div>
  );
}
