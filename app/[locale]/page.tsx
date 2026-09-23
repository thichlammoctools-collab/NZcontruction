import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import GoogleReviews from "@/components/GoogleReviews";
import QuoteForm from "@/components/QuoteForm";
import AIChatWidget from "@/components/AIChatWidget";

import enDict from "@/content/dictionaries/en.json";
import viDict from "@/content/dictionaries/vi.json";
import projectsData from "@/content/projects.json";

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
  const heroProject = projectsData[0]; // Remuera project

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* HEADER */}
      <Header locale={locale as "en" | "vi"} dict={dict} />

      <main className="flex-1 pt-20">
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden bg-primary">
          {/* BACKGROUND IMAGE WITH TECTONIC OVERLAY */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC4zySIsBFsCxbPwZoDwuqZtLQWpoTxQeVfs9GkcCOv8krWekpp7w-Sr4GIn4XjONGNLOByEmndm0tLOLyjs8PwH7QRkKbuuMMi34H0gnPxaPMwqQFVlSToJiD5aGeB16_nvb2zbNYsBr_w-OG4ktIRiEp6kaeOBtvN58A62ECHeBxKOEYa4sU7H5HmQaAugC9OSRbuHdHIOXPkFDOyfyHz-acP9xjnkESnozm5pyPzrINXZNh1K03Cg"
            alt="NS Building - Architectural Renovation & Interior Craftsmanship"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35"></div>

          {/* HERO CONTENT */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 lg:py-28 flex flex-col justify-center">
            <div className="max-w-2xl space-y-6">
              {/* TRUST BADGE */}
              <div className="inline-flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-white">
                <span className="text-amber-400 font-bold text-sm select-none">★★★★★</span>
                <span className="text-slate-200 font-medium">
                  {dict.hero.badge}
                </span>
              </div>

              {/* HEADLINE */}
              <h1 className="text-white font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08]">
                {dict.hero.title_line1}
                <br />
                <span className="text-bronze">{dict.hero.title_line2}</span>
              </h1>

              {/* SUBTITLE */}
              <p className="text-slate-200 text-base sm:text-lg lg:text-xl font-normal max-w-xl leading-relaxed">
                {dict.hero.subtitle}
              </p>

              {/* ACTION BUTTONS */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <a
                  href="#quote"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-bronze hover:bg-bronze-dark text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl hover:shadow-2xl"
                >
                  {dict.hero.cta_quote}
                </a>
                <a
                  href="#our-work"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/40 text-white hover:bg-white/10 font-bold text-sm uppercase tracking-wider transition-all backdrop-blur-sm"
                >
                  {dict.hero.cta_work}
                </a>
              </div>
            </div>

            {/* BOTTOM STATS STRIP */}
            <div className="mt-16 pt-8 border-t border-white/20 max-w-xl grid grid-cols-3 gap-6 text-white">
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white">
                  {dict.hero.stats_compliance}
                </span>
                <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                  {dict.hero.stats_compliance_label}
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white">
                  {dict.hero.stats_guarantee}
                </span>
                <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                  {dict.hero.stats_guarantee_label}
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white">
                  {dict.hero.stats_area}
                </span>
                <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                  {dict.hero.stats_area_label}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE DO: 8 SILO SERVICES SECTION */}
        <section id="services" className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 lg:py-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-0.5 w-6 bg-bronze"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-bronze">
                  {dict.services.badge}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {dict.services.title}
              </h2>
            </div>
            <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
              {dict.services.subtitle}
            </p>
          </div>

          {/* 8 SERVICE CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(dict.services.items).map(([key, item]: [string, any]) => (
              <ServiceCard
                key={key}
                id={key}
                tag={item.tag}
                title={item.title}
                desc={item.desc}
                locale={locale as "en" | "vi"}
                viewServiceText={dict.services.view_service}
              />
            ))}
          </div>
        </section>

        {/* PROVEN TRANSFORMATION: BEFORE & AFTER VISUALS */}
        <section id="our-work" className="w-full py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-0.5 w-6 bg-bronze"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-bronze">
                  {dict.before_after.badge}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                {dict.before_after.title}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {dict.before_after.subtitle}
              </p>
            </div>

            {/* INTERACTIVE SLIDER COMPONENT */}
            <div className="bg-slate-800/60 p-4 sm:p-6 rounded-3xl border border-slate-700 shadow-2xl">
              <BeforeAfterSlider
                beforeImage={heroProject.before_image}
                afterImage={heroProject.after_image}
                beforeLabel={dict.before_after.before_label}
                afterLabel={dict.before_after.after_label}
                projectName={locale === "vi" ? heroProject.title_vi : heroProject.title_en}
                location={heroProject.suburb}
                scope={locale === "vi" ? heroProject.description_vi : heroProject.description_en}
                dragHint={dict.before_after.drag_hint}
              />
            </div>
          </div>
        </section>

        {/* VERIFIED GOOGLE REVIEWS SECTION */}
        <GoogleReviews dict={dict} />

        {/* DIRECT CONSULTATION & QUOTE REQUEST */}
        <section className="w-full py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* LEFT INTRO COLUMN */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2">
                  <span className="h-0.5 w-6 bg-bronze"></span>
                  <span className="text-xs font-bold uppercase tracking-widest text-bronze">
                    {dict.quote.badge}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  {dict.quote.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {dict.quote.subtitle}
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border-light shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary">
                      1
                    </div>
                    <div>
                      <strong className="block text-sm text-primary">
                        {locale === "vi" ? "Tiếp nhận yêu cầu" : "Initial Consultation"}
                      </strong>
                      <span className="text-xs text-slate-500">
                        {locale === "vi" ? "Chúng tôi liên hệ trong 24 giờ" : "We review your plans and contact you within 24 hours"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border-light shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary">
                      2
                    </div>
                    <div>
                      <strong className="block text-sm text-primary">
                        {locale === "vi" ? "Khảo sát hiện trạng" : "Site Visit & Inspection"}
                      </strong>
                      <span className="text-xs text-slate-500">
                        {locale === "vi" ? "Đo đạc, tư vấn giải pháp tối ưu" : "On-site assessment with accurate measurements"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border-light shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary">
                      3
                    </div>
                    <div>
                      <strong className="block text-sm text-primary">
                        {locale === "vi" ? "Báo giá trọn gói minh bạch" : "Fixed Scope Proposal"}
                      </strong>
                      <span className="text-xs text-slate-500">
                        {locale === "vi" ? "Không phát sinh chi phí ẩn" : "Detailed breakdown with no surprise costs"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT FORM COLUMN */}
              <div className="lg:col-span-7">
                <QuoteForm dict={dict} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer locale={locale as "en" | "vi"} dict={dict} />

      {/* 24/7 AI CHAT ASSISTANT WIDGET */}
      <AIChatWidget locale={locale as "en" | "vi"} />
    </div>
  );
}
