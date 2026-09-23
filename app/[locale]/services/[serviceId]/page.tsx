import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import AIChatWidget from "@/components/AIChatWidget";
import { CheckCircle2, ArrowLeft, Phone, ShieldCheck } from "lucide-react";

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

  // Find related project for this service
  const relatedProject =
    projectsData.find((p) => p.category === serviceId) || projectsData[0];

  const title = isVi ? service.title_vi : service.title_en;
  const intro = isVi ? service.intro_vi : service.intro_en;
  const features = isVi ? service.features_vi : service.features_en;

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

              <div className="pt-2 flex items-center gap-4">
                <a
                  href="#service-quote"
                  className="px-6 py-3 rounded-xl bg-bronze hover:bg-bronze-dark text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  {isVi ? "Yêu Cầu Báo Giá Nhanh" : "Get a Free Estimate"}
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

        {/* SERVICE QUOTE FORM */}
        <section id="service-quote" className="w-full py-16 bg-slate-100 border-t border-border-light">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-bronze block mb-2">
                {isVi ? "Khảo Sát Miễn Phí" : "Transparent Pricing"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                {isVi
                  ? `Nhận Báo Giá Dịch Vụ ${title}`
                  : `Request a Quote for ${title}`}
              </h2>
              <p className="text-xs text-slate-600 mt-2">
                {isVi
                  ? "Điền thông tin bên dưới hoặc gọi hotline 027 666 6510 để gặp trực tiếp anh Nguyễn Sơn."
                  : "Fill out the form below or call 027 666 6510 to discuss your requirements directly with Nguyen Son."}
              </p>
            </div>

            <QuoteForm dict={dict} preselectedService={serviceId} />
          </div>
        </section>
      </main>

      <Footer locale={locale as "en" | "vi"} dict={dict} />
      <AIChatWidget locale={locale as "en" | "vi"} />
    </div>
  );
}
