"use client";

import React, { useState } from "react";
import Link from "next/link";

interface PortfolioItem {
  id: string;
  category: string;
  category_label: string;
  location: string;
  year: string;
  title: string;
  desc: string;
  image: string;
}

interface PortfolioSectionProps {
  portfolioDict: {
    badge: string;
    title: string;
    subtitle: string;
    filters: {
      all: string;
      renovations: string;
      bathrooms: string;
      flooring: string;
      cabinets: string;
    };
    items: PortfolioItem[];
  };
  locale?: "en" | "vi";
}

export default function PortfolioSection({ portfolioDict, locale = "en" }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const isVi = locale === "vi";

  const pDict = portfolioDict || {
    badge: isVi ? "Dự Án Tiêu Biểu" : "Portfolio",
    title: isVi ? "Công Trình Đã Thực Hiện" : "Featured Projects",
    subtitle: "",
    filters: {
      all: isVi ? "Tất Cả" : "All",
      renovations: isVi ? "Cải Tạo" : "Renovations",
      bathrooms: isVi ? "Phòng Tắm" : "Bathrooms",
      flooring: isVi ? "Sàn Nhà" : "Flooring",
      cabinets: isVi ? "Tủ Bếp" : "Cabinets",
    },
    items: [],
  };

  const filterKeys = [
    { key: "all", label: pDict.filters?.all || (isVi ? "Tất Cả" : "All") },
    { key: "renovations", label: pDict.filters?.renovations || (isVi ? "Cải Tạo" : "Renovations") },
    { key: "bathrooms", label: pDict.filters?.bathrooms || (isVi ? "Phòng Tắm" : "Bathrooms") },
    { key: "flooring", label: pDict.filters?.flooring || (isVi ? "Sàn Nhà" : "Flooring") },
    { key: "cabinets", label: pDict.filters?.cabinets || (isVi ? "Tủ Bếp" : "Cabinets") },
  ];

  const rawItems = Array.isArray(pDict.items) ? pDict.items : [];
  const filteredItems = rawItems.filter((item) => {
    if (!item) return false;
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 lg:py-24" id="work-section">
      <div className="flex flex-col gap-4 sm:gap-5 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-0.5 w-5 bg-secondary"></span>
            <span className="text-xs uppercase tracking-widest text-secondary font-bold">
              {pDict.badge || (isVi ? "Dự Án Tiêu Biểu" : "Portfolio")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            {pDict.title || (isVi ? "Công Trình Đã Thực Hiện" : "Featured Projects")}
          </h2>
        </div>

        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl">
          {pDict.subtitle || ""}
        </p>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-nowrap sm:flex-wrap w-full -mx-4 px-4 sm:mx-0 sm:px-0 pt-1">
          {filterKeys.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border-light flex flex-col justify-between"
          >
            <div className="aspect-[16/10] overflow-hidden relative bg-surface-dim">
              <img
                src={item.image}
                alt={item.title || "Project"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs text-primary font-bold shadow-xs">
                {item.location}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-on-surface-variant text-xs mb-2">
                  <span className="text-secondary font-bold uppercase tracking-wider">
                    {item.category_label}
                  </span>
                  <span className="text-slate-400 font-medium">{item.year}</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-bronze transition-colors">
                  <Link href={`/${locale}/projects/${item.id}`}>
                    {item.title || "Project"}
                  </Link>
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/${locale}/projects/${item.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary group-hover:translate-x-1 transition-all"
                >
                  <span>{locale === "vi" ? "Xem Chi Tiết Dự Án" : "View Case Study"}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
