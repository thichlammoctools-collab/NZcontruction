"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";
import ProjectDetailSlider from "@/components/ProjectDetailSlider";
import ConsultationModal from "@/components/ConsultationModal";
import ImageLightbox from "@/components/ImageLightbox";

interface ProjectDetailViewProps {
  project: any;
  locale: "en" | "vi";
  dict: any;
}

export default function ProjectDetailView({ project, locale, dict }: ProjectDetailViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const isVi = locale === "vi";

  const galleryItems = project.gallery?.items || [];
  const primaryItems = galleryItems.slice(0, 3);
  const extraItems = galleryItems.slice(3);
  const hasExtra = extraItems.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
      {/* 1. HEADER */}
      <Header locale={locale} dict={dict} />

      <main className="flex-1 pt-20">
        {/* TOP CONTEXT NAVIGATION & META BAR */}
        <div className="w-full bg-surface-container-low/70 py-6 border-b border-border-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant">
              <Link href={`/${locale}`} className="hover:text-on-surface transition-colors">
                {dict.nav.home}
              </Link>
              <span className="text-outline-variant">/</span>
              <Link href={`/${locale}/#work-section`} className="hover:text-on-surface transition-colors">
                {dict.nav.work}
              </Link>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-semibold truncate">
                {isVi ? project.header.title.vi : project.header.title.en}
              </span>
            </nav>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-highest text-secondary text-xs rounded uppercase tracking-wider font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                {isVi ? project.meta.completed.vi : project.meta.completed.en}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-container text-on-secondary-container text-xs rounded uppercase tracking-wider font-semibold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                {project.meta.lbp}
              </span>
            </div>
          </div>
        </div>

        {/* PROJECT HEADER SECTION */}
        <section className="w-full pt-10 pb-8 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col gap-5 mb-10">
              <div>
                <div className="flex items-center gap-2 text-secondary text-xs uppercase tracking-widest font-bold mb-3">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  <span>{project.header.location}</span>
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.08] max-w-4xl">
                  {isVi ? project.header.title.vi : project.header.title.en}
                </h1>
              </div>

              <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
                {isVi ? project.header.subtitle.vi : project.header.subtitle.en}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="h-12 px-6 bg-primary-container text-on-primary text-xs uppercase sm:text-sm font-bold tracking-wide rounded-lg inline-flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-md active:scale-95"
                >
                  <span>{isVi ? project.header.cta_discuss.vi : project.header.cta_discuss.en}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <a
                  href="/Thoa_Thuan_Du_An_NS_Building_Proposal.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-5 bg-surface-container-high text-on-surface text-xs uppercase sm:text-sm font-bold tracking-wide rounded-lg inline-flex items-center justify-center gap-2 hover:bg-surface-container transition-all border border-border-light"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>{isVi ? project.header.cta_lookbook.vi : project.header.cta_lookbook.en}</span>
                </a>
              </div>
            </div>

            {/* QUICK SPECS TECTONIC STRIP */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4 bg-surface-container-low rounded-xl border border-border-light">
              {project.specs.map((sp: any, i: number) => (
                <div
                  key={i}
                  className={`bg-surface-container-lowest p-4 rounded-lg flex flex-col justify-between shadow-xs ${
                    i === 4 ? "col-span-2 md:col-span-1" : ""
                  }`}
                >
                  <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                    {isVi ? sp.label.vi : sp.label.en}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-on-surface mt-1">
                    {typeof sp.val === "object" ? (isVi ? sp.val.vi : sp.val.en) : sp.val}
                  </span>
                  <span className="text-xs text-on-surface-variant mt-0.5">
                    {isVi ? sp.sub.vi : sp.sub.en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HERO FEATURE SHOWCASE */}
        <section className="w-full pb-16 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="relative w-full rounded-2xl overflow-hidden bg-primary-container shadow-2xl border border-border-light">
              <div className="aspect-[16/9] lg:aspect-[21/10] w-full relative">
                <img
                  alt={isVi ? project.hero_showcase.caption.vi : project.hero_showcase.caption.en}
                  className="w-full h-full object-cover"
                  src={project.hero_showcase.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-black/20"></div>

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-on-primary">
                  <div className="max-w-2xl">
                    <span className="text-xs uppercase tracking-widest text-secondary-fixed font-bold block mb-1">
                      {isVi ? project.hero_showcase.tag.vi : project.hero_showcase.tag.en}
                    </span>
                    <p className="text-lg sm:text-xl font-bold tracking-tight text-white">
                      {isVi ? project.hero_showcase.caption.vi : project.hero_showcase.caption.en}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto bg-surface/15 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-white text-xs font-semibold border border-white/10">
                    <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">
                      photo_camera
                    </span>
                    <span>{isVi ? project.meta.award.vi : project.meta.award.en}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OVERVIEW & INTERACTIVE BEFORE/AFTER SPLIT COMPARISON */}
        <section className="w-full py-16 bg-surface" id="comparison-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-secondary text-xs uppercase tracking-widest font-bold block mb-2">
                  {isVi ? project.comparison.badge.vi : project.comparison.badge.en}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
                  {isVi ? project.comparison.title.vi : project.comparison.title.en}
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container text-xs font-semibold text-on-surface-variant border border-border-light">
                <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
                <span>{isVi ? project.comparison.hint.vi : project.comparison.hint.en}</span>
              </div>
            </div>

            {/* Interactive Split Slider Component */}
            <ProjectDetailSlider
              beforeImage={project.comparison.before_image}
              afterImage={project.comparison.after_image}
              beforeLabel={isVi ? project.comparison.before_label.vi : project.comparison.before_label.en}
              afterLabel={isVi ? project.comparison.after_label.vi : project.comparison.after_label.en}
              hintText={isVi ? project.comparison.hint.vi : project.comparison.hint.en}
            />

            {/* Transformation Metrics */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-surface-container-low rounded-xl border border-border-light">
              {project.comparison.metrics.map((m: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3.5 bg-surface-container-lowest rounded-lg shadow-xs">
                  <span className="material-symbols-outlined text-secondary text-[24px]">
                    {m.icon}
                  </span>
                  <div>
                    <span className="text-[11px] text-on-surface-variant block uppercase font-bold tracking-wider">
                      {isVi ? m.label.vi : m.label.en}
                    </span>
                    <span className="text-sm sm:text-base text-on-surface font-bold">
                      {isVi ? m.val.vi : m.val.en}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SCOPE SUMMARY & KEY SPECIFICATIONS (SPLIT GRID) */}
        <section className="w-full py-16 bg-surface-container-low/50 border-t border-b border-border-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Scope summary */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded text-on-surface text-xs uppercase tracking-wider font-bold">
                  <span>{isVi ? project.scope_summary.tag.vi : project.scope_summary.tag.en}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface leading-tight">
                  {isVi ? project.scope_summary.title.vi : project.scope_summary.title.en}
                </h2>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  {isVi ? project.scope_summary.desc.vi : project.scope_summary.desc.en}
                </p>

                <div className="space-y-3 pt-2">
                  {project.scope_summary.highlights.map((hl: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-surface-container-lowest rounded-xl shadow-xs border border-border-light"
                    >
                      <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <div>
                        <span className="text-sm sm:text-base font-bold text-on-surface block">
                          {isVi ? hl.title.vi : hl.title.en}
                        </span>
                        <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                          {isVi ? hl.desc.vi : hl.desc.en}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Key Specifications */}
              <div className="lg:col-span-6 bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm border border-border-light">
                <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                  <h3 className="text-xl font-bold text-on-surface">
                    {isVi ? "Bảng Thông Số Kỹ Thuật" : "Key Specifications"}
                  </h3>
                  <span className="px-2.5 py-1 bg-secondary-container text-on-secondary-container text-xs rounded uppercase font-bold">
                    {isVi ? "Kiểm Định LBP" : "Verified Spec"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  {project.scope_summary.key_specs.map((spec: any, i: number) => (
                    <div key={i} className="p-4 bg-surface-container-low rounded-xl border border-border-light">
                      <div className="flex items-center gap-2 text-secondary mb-1">
                        <span className="material-symbols-outlined text-[20px]">{spec.icon}</span>
                        <span className="text-[11px] uppercase font-bold tracking-wider">
                          {isVi ? spec.cat.vi : spec.cat.en}
                        </span>
                      </div>
                      <span className="text-base font-bold text-on-surface block mt-1">
                        {isVi ? spec.title.vi : spec.title.en}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {isVi ? spec.sub.vi : spec.sub.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ARCHITECTURAL BENTO GALLERY */}
        <section className="w-full py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-secondary text-xs uppercase tracking-widest font-bold block mb-2">
                  {isVi ? project.gallery.tag.vi : project.gallery.tag.en}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
                  {isVi ? project.gallery.title.vi : project.gallery.title.en}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-md leading-relaxed">
                {isVi ? project.gallery.desc.vi : project.gallery.desc.en}
              </p>
            </div>

            {/* Architectural Bento Gallery */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {primaryItems.map((item: any, i: number) => {
                const span = item.span || (i === 0 ? "lg:col-span-7" : "lg:col-span-5");
                const isThirdItem = i === 2;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setLightboxIndex(i);
                      setLightboxOpen(true);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setLightboxIndex(i);
                        setLightboxOpen(true);
                      }
                    }}
                    className={`${span} rounded-2xl overflow-hidden bg-surface-container shadow-md group relative flex flex-col justify-between border border-border-light cursor-pointer hover:shadow-xl hover:border-secondary/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary`}
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden relative">
                      <img
                        alt={isVi ? item.title.vi : item.title.en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        src={item.image}
                        loading="lazy"
                      />

                      {/* Hover Overlay Hint */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/20 shadow-lg">
                          <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
                            zoom_in
                          </span>
                          <span>{isVi ? "Click để phóng to" : "Click to enlarge"}</span>
                        </span>
                      </div>

                      {/* Badge if > 3 images on the 3rd card when collapsed */}
                      {isThirdItem && hasExtra && !showAllGallery && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-bold border border-white/25 shadow-lg animate-pulse">
                            <span className="material-symbols-outlined text-[15px] text-secondary-fixed">
                              photo_library
                            </span>
                            <span>+{extraItems.length} {isVi ? "ảnh khác" : "more photos"}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 bg-surface-container-lowest flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold text-on-surface block group-hover:text-secondary transition-colors">
                          {isVi ? item.title.vi : item.title.en}
                        </span>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {isVi ? item.desc.vi : item.desc.en}
                        </p>
                      </div>
                      <span
                        className="material-symbols-outlined text-secondary text-[24px] group-hover:scale-110 transition-transform p-1.5 rounded-full group-hover:bg-secondary/10"
                        title={isVi ? "Phóng to xem ảnh" : "Enlarge photo"}
                      >
                        fullscreen
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Material Metrics 4th Bento Box */}
              <div className="lg:col-span-7 p-6 lg:p-8 bg-surface-container-low rounded-2xl flex flex-col justify-center border border-border-light shadow-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {project.gallery.material_metrics.map((mm: any, i: number) => (
                    <div key={i} className="space-y-1">
                      <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                        {isVi ? mm.label.vi : mm.label.en}
                      </span>
                      <p className="text-base font-bold text-on-surface">
                        {isVi ? mm.val.vi : mm.val.en}
                      </p>
                      <span className="text-xs text-on-surface-variant block">
                        {isVi ? mm.sub.vi : mm.sub.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Extended Gallery Grid for items beyond the 3rd image */}
            {hasExtra && showAllGallery && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 transition-all duration-500 ease-out">
                {extraItems.map((item: any, idx: number) => {
                  const originalIndex = idx + 3;
                  return (
                    <div
                      key={originalIndex}
                      onClick={() => {
                        setLightboxIndex(originalIndex);
                        setLightboxOpen(true);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setLightboxIndex(originalIndex);
                          setLightboxOpen(true);
                        }
                      }}
                      className="cursor-pointer rounded-2xl overflow-hidden bg-surface-container shadow-md group relative flex flex-col justify-between border border-border-light hover:shadow-xl hover:border-secondary/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <div className="aspect-[16/10] w-full overflow-hidden relative">
                        <img
                          alt={isVi ? item.title.vi : item.title.en}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          src={item.image}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/20 shadow-lg">
                            <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
                              zoom_in
                            </span>
                            <span>{isVi ? "Click để phóng to" : "Click to enlarge"}</span>
                          </span>
                        </div>
                      </div>
                      <div className="p-5 bg-surface-container-lowest flex items-center justify-between">
                        <div>
                          <span className="text-base font-bold text-on-surface block group-hover:text-secondary transition-colors">
                            {isVi ? item.title.vi : item.title.en}
                          </span>
                          <p className="text-xs text-on-surface-variant mt-0.5">
                            {isVi ? item.desc.vi : item.desc.en}
                          </p>
                        </div>
                        <span
                          className="material-symbols-outlined text-secondary text-[24px] group-hover:scale-110 transition-transform p-1.5 rounded-full group-hover:bg-secondary/10"
                          title={isVi ? "Phóng to xem ảnh" : "Enlarge photo"}
                        >
                          fullscreen
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Gallery Control Bar if there are more than 3 images */}
            {hasExtra && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAllGallery((prev) => !prev)}
                  className="h-11 px-6 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 border border-border-light transition-all shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary">
                    {showAllGallery ? "expand_less" : "photo_library"}
                  </span>
                  <span>
                    {showAllGallery
                      ? (isVi ? "Thu gọn bớt hình ảnh" : "Show fewer photos")
                      : (isVi
                          ? `Xem toàn bộ ${galleryItems.length} hình ảnh dự án (+${extraItems.length})`
                          : `View all ${galleryItems.length} project photos (+${extraItems.length})`)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxIndex(0);
                    setLightboxOpen(true);
                  }}
                  className="h-11 px-5 bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-semibold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 border border-border-light transition-all shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    slideshow
                  </span>
                  <span>{isVi ? "Phóng to trình chiếu tất cả" : "Browse Fullscreen"}</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* RELATED PROJECTS SECTION */}
        <section className="w-full py-20 bg-surface-container-low/40 border-t border-border-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-secondary text-xs uppercase tracking-widest font-bold block mb-2">
                  {isVi ? project.related_projects.tag.vi : project.related_projects.tag.en}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
                  {isVi ? project.related_projects.title.vi : project.related_projects.title.en}
                </h2>
              </div>
              <Link
                href={`/${locale}/#work-section`}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-on-surface hover:text-secondary transition-colors"
              >
                <span>{isVi ? project.related_projects.cta_all.vi : project.related_projects.cta_all.en}</span>
                <span className="material-symbols-outlined text-[18px]">east</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.related_projects.items.map((rel: any, i: number) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between border border-border-light"
                >
                  <div>
                    <div className="aspect-[16/10] w-full overflow-hidden bg-surface-container">
                      <img
                        alt={isVi ? rel.title.vi : rel.title.en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={rel.image}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between text-secondary text-xs uppercase tracking-wider font-semibold mb-2">
                        <span>{rel.location}</span>
                        <span>{rel.year}</span>
                      </div>
                      <h3 className="text-lg font-bold text-on-surface group-hover:text-secondary transition-colors">
                        {isVi ? rel.title.vi : rel.title.en}
                      </h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
                        {isVi ? rel.desc.vi : rel.desc.en}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform"
                    >
                      <span>{isVi ? "Xem Chi Tiết Công Trình" : "View Project Specifications"}</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CONVERSION SECTION */}
        <section className="w-full py-20 bg-surface-container-low" id="consultation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="bg-primary-container text-on-primary rounded-3xl p-8 lg:p-16 shadow-2xl relative overflow-hidden border border-slate-800">
              <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
                <span className="text-tertiary-fixed text-xs uppercase tracking-widest font-bold block mb-3">
                  {isVi ? project.consultation.tag.vi : project.consultation.tag.en}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                  {isVi ? project.consultation.title.vi : project.consultation.title.en}
                </h2>
                <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
                  {isVi ? project.consultation.desc.vi : project.consultation.desc.en}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="h-12 px-8 bg-surface text-primary font-bold text-sm rounded-xl inline-flex items-center justify-center gap-2.5 hover:bg-slate-100 transition-all shadow-md active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px] text-secondary">
                      calendar_today
                    </span>
                    <span>{isVi ? project.consultation.cta_btn.vi : project.consultation.cta_btn.en}</span>
                  </button>
                  <a
                    href="tel:0276666510"
                    className="h-12 px-6 bg-surface/10 hover:bg-surface/20 text-white font-bold text-sm rounded-xl inline-flex items-center justify-center gap-2 backdrop-blur-md transition-all border border-white/20"
                  >
                    <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
                      call
                    </span>
                    <span>Call 027 666 6510</span>
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 text-xs pt-4 border-t border-white/10 w-full">
                  {project.consultation.trust_points.map((tp: any, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        {tp.icon}
                      </span>
                      <span>{isVi ? tp.text.vi : tp.text.en}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer locale={locale} dict={dict} />

      {/* CONSULTATION MODAL */}
      <ConsultationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        locale={locale}
        projectTitle={isVi ? project.header.title.vi : project.header.title.en}
      />

      {/* FULLSCREEN IMAGE LIGHTBOX */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={galleryItems}
        initialIndex={lightboxIndex}
        locale={locale}
      />

      {/* 24/7 AI CHAT WIDGET */}
      <AIChatWidget locale={locale} />
    </div>
  );
}
