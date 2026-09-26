import React from "react";
import ServiceHero from "@/components/service-blocks/ServiceHero";
import ServicePricingTable from "@/components/service-blocks/ServicePricingTable";
import ServiceCtaSection from "@/components/service-blocks/ServiceCtaSection";
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

      {/* 2. KEY SCOPE & QUALITY STANDARDS */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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

            <p className="text-sm text-slate-600 leading-relaxed">
              {isVi
                ? (serviceId === "bathrooms"
                    ? "Khu vực ẩm ướt đòi hỏi kỹ thuật chống thấm màng liên tục và kiểm định áp lực nước khắt khe. Chúng tôi mang đến giải pháp trọn gói từ tháo dỡ, gia cố đến lắp đặt thiết bị vệ sinh cao cấp."
                    : "Cải tạo nhà ở tại Auckland đòi hỏi kiểm soát chặt chẽ từ kết cấu dầm chịu lực, đường ống kỹ thuật đến hồ sơ xin phép Council. Chúng tôi cam kết tiến độ rõ ràng và bảo hành toàn diện.")
                : (serviceId === "bathrooms"
                    ? "Wet areas require rigorous membrane waterproofing and pressure testing to NZ building standards. We deliver complete luxury bathroom renovations from demolition to premium fit-offs."
                    : "Home renovations in Auckland demand rigorous structural control, engineering compliance, and seamless council consent management. We deliver on time and to the highest building standards.")}
            </p>

            <div className="space-y-3 pt-2">
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

          <div className="lg:col-span-6">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-surface-container-low via-white to-amber-50/40 border border-border-light shadow-lg space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-bronze/15 text-bronze flex items-center justify-center">
                  {serviceId === "bathrooms" ? <ShieldCheck className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    {isVi ? "Cam Kết Chất Lượng NS Building" : "NS Building Quality Guarantee"}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {serviceId === "bathrooms"
                      ? (isVi ? "Chống thấm chuẩn E3/AS1 & Nghiệm thu PS3 Council" : "E3/AS1 compliance & Council PS3 sign-off")
                      : (isVi ? "Đội ngũ thợ LBP & Nghiệm thu Code Compliance (CCC)" : "LBP certified builders & CCC compliance guarantee")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm space-y-1">
                  <span className="block text-2xl font-extrabold text-primary">100%</span>
                  <span className="text-xs text-slate-600 block">
                    {isVi ? "Chuẩn New Zealand Code" : "NZ Building Code compliant"}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm space-y-1">
                  <span className="block text-2xl font-extrabold text-primary">Fixed</span>
                  <span className="text-xs text-slate-600 block">
                    {isVi ? "Báo giá trọn gói minh bạch" : "Transparent fixed pricing"}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm space-y-1">
                  <span className="block text-2xl font-extrabold text-primary">LBP</span>
                  <span className="text-xs text-slate-600 block">
                    {isVi ? "Thợ chứng chỉ hành nghề" : "Licensed Practitioners"}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm space-y-1">
                  <span className="block text-2xl font-extrabold text-primary">{isVi ? "10 Năm" : "10 Years"}</span>
                  <span className="text-xs text-slate-600 block">
                    {isVi ? "Bảo hành trách nhiệm" : "Workmanship warranty"}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
