import React from "react";
import Link from "next/link";
import { ArrowLeft, Phone, ShieldCheck } from "lucide-react";

interface ServiceHeroProps {
  title: string;
  intro: string;
  heroImage: string;
  locale: "en" | "vi";
  badgeText?: string;
  accentColor?: string;
}

export default function ServiceHero({
  title,
  intro,
  heroImage,
  locale,
  badgeText,
}: ServiceHeroProps) {
  const isVi = locale === "vi";

  return (
    <section className="relative w-full min-h-[460px] flex items-center bg-primary overflow-hidden">
      <img
        src={heroImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/45"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
        <Link
          href={`/${locale}/#services`}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-bronze hover:text-white transition-colors mb-4 sm:mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{isVi ? "Tất cả dịch vụ" : "All Capabilities"}</span>
        </Link>

        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-bronze/20 text-bronze-light px-3.5 py-1.5 rounded-full text-xs font-bold border border-bronze/30 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-bronze-light shrink-0" />
            <span>
              {badgeText || (isVi ? "Thợ LBP Lành Nghề • Chuẩn NZ Building Code" : "Licensed Trade Specialist • NZ Code Compliant")}
            </span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>

          <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
            {intro}
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-bronze hover:bg-bronze-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-bronze/30 text-center"
            >
              {isVi ? "Xem Bảng Giá Tham Khảo" : "View Reference Pricing"}
            </a>
            <a
              href="tel:0276666510"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-white/30 text-white hover:bg-white/10 text-xs font-bold transition-all backdrop-blur-sm text-center"
            >
              <Phone className="w-4 h-4 text-bronze-light" />
              <span>027 666 6510</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
