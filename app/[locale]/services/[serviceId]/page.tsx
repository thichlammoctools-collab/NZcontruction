import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import AIChatWidget from "@/components/AIChatWidget";
import {
  CheckCircle2,
  ArrowLeft,
  Phone,
  ShieldCheck,
  Sparkles,
  Info,
  CalendarCheck,
  Mail,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

import enDict from "@/content/dictionaries/en.json";
import viDict from "@/content/dictionaries/vi.json";
import servicesDetailData from "@/content/services_detail.json";
import projectsData from "@/content/projects.json";

export function generateStaticParams() {
  const locales = ["en", "vi"];
  const serviceIds = [
    "renovations",
    "bathrooms",
    "cabinets",
    "flooring",
    "doors",
    "painting",
    "hiring",
    "maintenance",
  ];

  const params: { locale: string; serviceId: string }[] = [];
  locales.forEach((locale) => {
    serviceIds.forEach((serviceId) => {
      params.push({ locale, serviceId });
    });
  });
  return params;
}

interface PageProps {
  params: {
    locale: string;
    serviceId: string;
  };
}

export default function ServiceDetailPage({ params }: PageProps) {
  const { locale, serviceId } = params;

  if (locale !== "en" && locale !== "vi") notFound();

  const service = (servicesDetailData as any)[serviceId];
  if (!service) notFound();

  const dict = locale === "vi" ? viDict : enDict;
  const isVi = locale === "vi";
  const pDict = (dict as any).pricing_section || {};

  // Find related project for this service
  const relatedProject =
    projectsData.find((p) => p.category === serviceId) || projectsData[0];

  const title = isVi ? service.title_vi : service.title_en;
  const intro = isVi ? service.intro_vi : service.intro_en;
  const features = isVi ? service.features_vi : service.features_en;
  const pricingList = service.pricing || [];

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header locale={locale as "en" | "vi"} dict={dict} />

      <main className="flex-1 pt-20">
        {/* HERO BANNER FOR SERVICE */}
        <section className="relative w-full min-h-[460px] flex items-center bg-primary overflow-hidden">
          <img
            src={service.hero_image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-16">
            <Link
              href={`/${locale}/#services`}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-bronze hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isVi ? "Tất cả dịch vụ" : "All Capabilities"}</span>
            </Link>

            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-bronze/20 text-bronze px-3 py-1 rounded-full text-xs font-bold border border-bronze/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Licensed Trade Specialist &bull; NZ Code Compliant</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {title}
              </h1>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {intro}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#pricing"
                  className="px-6 py-3 rounded-xl bg-bronze hover:bg-bronze-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-bronze/30"
                >
                  {isVi ? "Xem Bảng Giá Tham Khảo" : "View Reference Pricing"}
                </a>
                <a
                  href="tel:0276666510"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 text-xs font-bold transition-all"
                >
                  <Phone className="w-4 h-4 text-bronze" />
                  <span>027 666 6510</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* KEY SCOPE & SPECIFICATIONS */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
                  {isVi ? "Quy Chuẩn & Chất Lượng" : "Scope & Trade Standards"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                  {isVi
                    ? "Tại sao lựa chọn NS Building cho hạng mục này?"
                    : "Precision Execution, Guaranteed Longevity"}
                </h2>
              </div>

              <div className="space-y-4 pt-2">
                {features.map((feat: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white border border-border-light shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-bronze shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-800 leading-snug">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RELATED BEFORE & AFTER PROJECT */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary block">
                {isVi ? "Công Trình Tiêu Biểu" : "Featured Case Study"}
              </span>
              <div className="bg-white p-4 rounded-2xl border border-border-light shadow-md">
                <BeforeAfterSlider
                  beforeImage={relatedProject.before_image}
                  afterImage={relatedProject.after_image}
                  beforeLabel={dict.before_after.before_label}
                  afterLabel={dict.before_after.after_label}
                  projectName={isVi ? relatedProject.title_vi : relatedProject.title_en}
                  location={relatedProject.suburb}
                  scope={isVi ? relatedProject.description_vi : relatedProject.description_en}
                />
              </div>
            </div>
          </div>
        </section>

        {/* REFERENCE PRICING TABLE SECTION */}
        <section id="pricing" className="w-full py-16 bg-slate-50 border-t border-border-light scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 mb-2 bg-bronze/10 text-bronze px-3 py-1 rounded-full text-xs font-bold border border-bronze/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{pDict.badge || (isVi ? "Minh Bạch Chi Phí" : "Transparent Pricing")}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {pDict.title_prefix || (isVi ? "Bảng Giá Tham Khảo:" : "Reference Price Guide:")}{" "}
                <span className="text-bronze">{title}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                {pDict.subtitle ||
                  (isVi
                    ? "Khung giá tham khảo dựa trên điều kiện thực tế tại Auckland & New Zealand để quý khách dễ dàng dự trù ngân sách."
                    : "Indicative pricing benchmarks based on typical Auckland & New Zealand projects to help you budget with confidence.")}
              </p>
            </div>

            {/* DESKTOP PRICING TABLE */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary text-white text-xs uppercase tracking-wider font-semibold border-b border-primary-light">
                    <th className="py-4 px-6 w-1/4">
                      {pDict.col_item || (isVi ? "Hạng Mục / Quy Mô" : "Scope / Package")}
                    </th>
                    <th className="py-4 px-6 w-5/12">
                      {pDict.col_desc || (isVi ? "Mô Tả Tiêu Chuẩn Thực Hiện" : "Specifications & Quality Standard")}
                    </th>
                    <th className="py-4 px-6 w-1/6">
                      {pDict.col_price || (isVi ? "Mức Giá Tham Khảo (NZD)" : "Estimated Range (NZD)")}
                    </th>
                    <th className="py-4 px-6 w-1/6 text-right">
                      {pDict.col_unit || (isVi ? "Đơn Vị Tính" : "Unit / Scope")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light text-slate-700 text-sm">
                  {pricingList.map((item: any, idx: number) => {
                    const itemName = isVi ? item.name_vi : item.name_en;
                    const itemDesc = isVi ? item.desc_vi : item.desc_en;
                    const itemUnit = isVi ? item.unit_vi : item.unit_en;

                    return (
                      <tr
                        key={idx}
                        className={`transition-colors hover:bg-slate-50/80 ${
                          item.popular ? "bg-amber-50/40" : ""
                        }`}
                      >
                        <td className="py-5 px-6 font-semibold text-primary align-top">
                          <div className="flex flex-col gap-1.5 items-start">
                            <span>{itemName}</span>
                            {item.popular && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-200">
                                <BadgeCheck className="w-3 h-3" />
                                {pDict.popular || (isVi ? "Phổ biến nhất" : "Most popular")}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-5 px-6 text-xs sm:text-sm text-slate-600 leading-relaxed align-top">
                          {itemDesc}
                        </td>
                        <td className="py-5 px-6 align-top">
                          <span className="font-extrabold text-base text-primary whitespace-nowrap">
                            {item.range}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-right align-top">
                          <span className="inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md whitespace-nowrap">
                            {itemUnit}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE PRICING CARDS */}
            <div className="md:hidden space-y-4">
              {pricingList.map((item: any, idx: number) => {
                const itemName = isVi ? item.name_vi : item.name_en;
                const itemDesc = isVi ? item.desc_vi : item.desc_en;
                const itemUnit = isVi ? item.unit_vi : item.unit_en;

                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl bg-white border shadow-sm space-y-3 ${
                      item.popular
                        ? "border-amber-300 ring-1 ring-amber-200"
                        : "border-border-light"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-primary text-base leading-snug">
                        {itemName}
                      </h3>
                      {item.popular && (
                        <span className="shrink-0 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          {pDict.popular || (isVi ? "Phổ biến" : "Popular")}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {itemDesc}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {pDict.col_price || (isVi ? "Mức giá:" : "Price:")}
                      </span>
                      <div className="text-right">
                        <span className="block font-extrabold text-primary text-base">
                          {item.range}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          ({itemUnit})
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PRICING DISCLAIMER NOTE */}
            <div className="mt-8 p-5 rounded-2xl bg-white border border-border-light shadow-sm flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-bronze/10 text-bronze flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-primary">
                  {pDict.disclaimer_title ||
                    (isVi ? "Lưu Ý Quan Trọng Về Báo Giá Tham Khảo:" : "Important Pricing Clarifications:")}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pDict.disclaimer_text ||
                    (isVi
                      ? "Mức giá trên là ước tính tham khảo cho điều kiện thi công tại Auckland, New Zealand (chưa bao gồm GST). Chi phí thực tế sẽ phụ thuộc vào quy mô, hiện trạng cấu trúc, chủng loại vật liệu hoàn thiện và yêu cầu cấp phép Council (nếu có). NS Building cam kết khảo sát tận nơi miễn phí và ký kết hợp đồng cố định giá (Fixed Price) trước khi bắt đầu."
                      : "Prices shown are realistic estimates for Auckland residential conditions (excl. GST). Exact costs depend on site access, existing structural conditions, selected finish materials, and council consent requirements (if applicable). NS Building provides a free on-site survey and a transparent fixed-price contract prior to starting any project.")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HIGH-CONVERTING CTA SECTION UNDERNEATH */}
        <section id="service-cta" className="w-full py-16 lg:py-20 bg-gradient-to-br from-primary-dark via-primary to-slate-900 text-white relative overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-bronze/15 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Heading & Value Proposition */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 bg-bronze/20 text-bronze-light px-3 py-1 rounded-full text-xs font-bold border border-bronze/30">
                  <CalendarCheck className="w-3.5 h-3.5 text-bronze-light" />
                  <span>{pDict.cta_badge || (isVi ? "Khảo Sát Tận Nơi Miễn Phí" : "Free On-Site Consultation")}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {pDict.cta_title ||
                    (isVi
                      ? "Cần Báo Giá Chính Xác & Cố Định Cho Nhà Bạn?"
                      : "Need an Accurate Fixed-Price Quote for Your Project?")}
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {pDict.cta_desc ||
                    (isVi
                      ? "Mỗi ngôi nhà có đặc thù kết cấu và hiện trạng riêng. Hãy liên hệ trực tiếp với anh Nguyễn Sơn để được khảo sát thực tế tận nơi tại Auckland, tư vấn giải pháp tối ưu và nhận báo giá chi tiết hoàn toàn miễn phí."
                      : "Every home has unique structural characteristics. Contact Nguyen Son directly for a complimentary on-site inspection across Auckland, tailored recommendations, and an itemized fixed-price proposal.")}
                </p>

                {/* Trust Points */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-bronze shrink-0" />
                    <span>
                      {pDict.trust_free ||
                        (isVi
                          ? "100% Khảo sát hiện trạng miễn phí tại Auckland"
                          : "100% Free on-site survey across Auckland")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-bronze shrink-0" />
                    <span>
                      {pDict.trust_fixed ||
                        (isVi
                          ? "Báo giá trọn gói minh bạch, cam kết không phát sinh"
                          : "Transparent itemized contract - No hidden surprises")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-bronze shrink-0" />
                    <span>
                      {pDict.trust_guarantee ||
                        (isVi
                          ? "Thợ LBP lành nghề & bảo hành kết cấu 10 năm"
                          : "Licensed Building Practitioners & 10-year warranty")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Impact Direct Action Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-bronze-light block mb-1">
                      {isVi ? "Kết Nối Nhanh" : "Fast Direct Contact"}
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      {isVi ? "Trò Chuyện Cùng Thợ Chính" : "Speak with the Lead Builder"}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {isVi
                        ? "Gặp trực tiếp anh Nguyễn Sơn để trao đổi phương án và hẹn lịch khảo sát thuận tiện nhất."
                        : "Direct technical discussion with Nguyen Son to schedule your on-site assessment."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Primary Button: Hotline Call */}
                    <a
                      href="tel:0276666510"
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-bronze hover:bg-bronze-dark text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-bronze/40 group"
                    >
                      <Phone className="w-5 h-5 transition-transform group-hover:scale-110" />
                      <span>{pDict.cta_call || (isVi ? "Gọi Ngay: 027 666 6510" : "Call Direct: 027 666 6510")}</span>
                    </a>

                    {/* Secondary Button: Link to Quote on Home */}
                    <Link
                      href={`/${locale}/#quote`}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/20 group"
                    >
                      <span>{pDict.cta_request || (isVi ? "Đặt Lịch Khảo Sát Miễn Phí" : "Book a Free Site Inspection")}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>

                  {/* Secondary channels */}
                  <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
                    <a
                      href="tel:0211531510"
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-bronze-light" />
                      <span>Mobile: <strong>021 153 1510</strong></span>
                    </a>
                    <a
                      href="mailto:contact@nsbuilding.co.nz"
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-bronze-light" />
                      <span>contact@nsbuilding.co.nz</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale as "en" | "vi"} dict={dict} />
      <AIChatWidget locale={locale as "en" | "vi"} />
    </div>
  );
}
