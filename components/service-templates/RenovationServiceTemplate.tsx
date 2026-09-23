import React from "react";
import ServiceHero from "@/components/service-blocks/ServiceHero";
import ServicePricingTable from "@/components/service-blocks/ServicePricingTable";
import ServiceCtaSection from "@/components/service-blocks/ServiceCtaSection";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { CheckCircle2, ShieldCheck, Clock, Award, Hammer } from "lucide-react";

interface RenovationServiceTemplateProps {
  serviceId: string;
  service: any;
  locale: "en" | "vi";
  dict: any;
  relatedProject?: any;
}

export default function RenovationServiceTemplate({
  serviceId,
  service,
  locale,
  dict,
  relatedProject,
}: RenovationServiceTemplateProps) {
  const isVi = locale === "vi";
  const title = isVi ? service.title_vi : service.title_en;
  const intro = isVi ? service.intro_vi : service.intro_en;
  const features = isVi ? service.features_vi : service.features_en;
  const pricingList = service.pricing || [];
  const timelineSteps = service.timeline_steps || [];
  const complianceStandards = service.compliance_standards || [];

  return (
    <div>
      {/* 1. HERO BANNER */}
      <ServiceHero
        title={title}
        intro={intro}
        heroImage={service.hero_image}
        locale={locale}
        badgeText={
          serviceId === "bathrooms"
            ? (isVi ? "Chống Thấm Chuẩn Council NZ (PS3) • Hoàn Thiện Tinh Xảo" : "NZ Code Waterproofing (PS3) • Luxury Finishes")
            : (isVi ? "Thi Công Kết Cấu Dầm Thép • Cấp Phép Council NZ" : "Structural Engineering • Council Consent Support")
        }
      />

      {/* 2. KEY SCOPE & BEFORE-AFTER SHOWCASE */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
                {isVi ? "Tiêu Chuẩn & Năng Lực" : "Scope & Trade Standards"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                {isVi
                  ? `Vì sao khách hàng tin chọn NS Building cho hạng mục ${title}?`
                  : `Architectural Execution & Code-Compliant Craftsmanship`}
              </h2>
            </div>

            <div className="space-y-4 pt-2">
              {features.map((feat: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-border-light shadow-sm hover:shadow-md transition-shadow"
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
          {relatedProject && (
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary block">
                {isVi ? "Công Trình Thực Tế (Trước & Sau)" : "Featured Case Study (Before & After)"}
              </span>
              <div className="bg-white p-4 rounded-2xl border border-border-light shadow-md">
                <BeforeAfterSlider
                  beforeImage={relatedProject.before_image}
                  afterImage={relatedProject.after_image}
                  beforeLabel={dict?.before_after?.before_label || "Trước"}
                  afterLabel={dict?.before_after?.after_label || "Sau"}
                  projectName={isVi ? relatedProject.title_vi : relatedProject.title_en}
                  location={relatedProject.suburb}
                  scope={isVi ? relatedProject.description_vi : relatedProject.description_en}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3A. RENOVATIONS SPECIALIZED SECTION: 4-PHASE TIMELINE */}
      {serviceId === "renovations" && timelineSteps.length > 0 && (
        <section className="w-full py-16 bg-slate-900 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 bg-bronze/20 text-bronze-light px-3 py-1 rounded-full text-xs font-bold border border-bronze/30 mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>{isVi ? "Quy Trình Quản Lý Dự Án" : "Project Lifecycle"}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isVi ? "4 Giai Đoạn Cải Tạo Chuyên Nghiệp" : "4-Phase Architectural Renovation Process"}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                {isVi
                  ? "Tối ưu hóa thời gian thi công, kiểm soát rủi ro phát sinh và đảm bảo vượt qua mọi kỳ nghiệm thu khắt khe của Auckland Council."
                  : "Eliminate unexpected delays, avoid budget overruns, and guarantee full Code Compliance Certificate (CCC) sign-off."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {timelineSteps.map((step: any, idx: number) => {
                const sTitle = isVi ? step.title_vi : step.title_en;
                const sDesc = isVi ? step.desc_vi : step.desc_en;

                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-bronze/50 transition-all space-y-3 relative group hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-extrabold text-bronze-light opacity-80">
                        {step.step}
                      </span>
                      <Hammer className="w-5 h-5 text-slate-400 group-hover:text-bronze transition-colors" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-bronze transition-colors">
                      {sTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {sDesc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3B. BATHROOMS SPECIALIZED SECTION: COUNCIL WATERPROOFING & STANDARDS */}
      {serviceId === "bathrooms" && complianceStandards.length > 0 && (
        <section className="w-full py-16 bg-surface-container-low border-t border-border-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-200 mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>{isVi ? "Chuẩn Mực Kỹ Thuật Chống Thấm NZ" : "NZ Waterproofing Compliance"}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {isVi ? "Cam Kết Không Thấm Dột & Nghiệm Thu PS3" : "Guaranteed Zero Leaks & Council PS3 Producer Statement"}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                {isVi
                  ? "Phòng tắm tại New Zealand đòi hỏi quy chuẩn chống thấm tuyệt đối nghiêm ngặt. Chúng tôi thực hiện đúng từng lớp màng và hỗ trợ cấp chứng chỉ kiểm định."
                  : "Auckland wet areas require strict compliance with E3/AS1 code. Our certified applicators ensure full peace of mind for you and your insurance."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceStandards.map((item: any, idx: number) => {
                const sTitle = isVi ? item.title_vi : item.title_en;
                const sDesc = isVi ? item.desc_vi : item.desc_en;

                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-border-light shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-primary">
                        {sTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {sDesc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. PRICING TABLE */}
      <ServicePricingTable
        title={title}
        pricingList={pricingList}
        locale={locale}
        dict={dict}
      />

      {/* 5. CTA SECTION */}
      <ServiceCtaSection locale={locale} dict={dict} />
    </div>
  );
}
