import React from "react";
import ServiceHero from "@/components/service-blocks/ServiceHero";
import ServicePricingTable from "@/components/service-blocks/ServicePricingTable";
import ServiceCtaSection from "@/components/service-blocks/ServiceCtaSection";
import { CheckCircle2, AlertTriangle, ShieldCheck, Clock, Hammer, Check } from "lucide-react";

interface PropertyMaintenanceServiceTemplateProps {
  serviceId: string;
  service: any;
  locale: "en" | "vi";
  dict: any;
  relatedProject?: any;
}

export default function PropertyMaintenanceServiceTemplate({
  service,
  locale,
  dict,
}: PropertyMaintenanceServiceTemplateProps) {
  const isVi = locale === "vi";
  const title = isVi ? service.title_vi : service.title_en;
  const intro = isVi ? service.intro_vi : service.intro_en;
  const features = isVi ? service.features_vi : service.features_en;
  const pricingList = service.pricing || [];
  const remediationMatrix = service.remediation_matrix || [];

  return (
    <div>
      {/* 1. HERO */}
      <ServiceHero
        title={title}
        intro={intro}
        heroImage={service.hero_image}
        locale={locale}
        badgeText={
          isVi
            ? "Xử Lý Gỗ Mục H3.2 • Khắc Phục Dột Nước & Cải Tạo Nhanh"
            : "Rotten Timber Remediation • Weather-tight Repairs"
        }
      />

      {/* 2. OVERVIEW & URGENT PROPERTY CARE */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
                {isVi ? "Cứu Hộ Kết Cấu & Bảo Trì Nhanh" : "Targeted Repairs & Maintenance"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                {isVi
                  ? "Bảo vệ giá trị căn nhà trước rủi ro thấm dột và xuống cấp"
                  : "Preserve Your Property Value & Ensure Structural Longevity"}
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {isVi
                ? "Thời tiết mưa gió ẩm ướt tại New Zealand dễ khiến khung gỗ bị mục âm ỉ nếu tường ngoài hoặc mép cửa bị hở gioăng. Chúng tôi khảo sát định vị chính xác vị trí thấm, thay thế gỗ mục bằng vật liệu tẩm hóa chất đạt chuẩn và phục hồi bề mặt hoàn hảo."
                : "Auckland rain can lead to unseen structural timber rot if cladding fails. Our team performs non-destructive diagnostics, replaces damaged framing with H-treated timber, and seals weatherboards to NZ building code."}
            </p>

            <div className="space-y-3 pt-2">
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

          <div className="lg:col-span-6">
            <div className="p-8 rounded-3xl bg-surface-container-low border border-border-light space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    {isVi ? "Cam Kết Phản Hồi Trong 24 Giờ" : "Fast 24h Site Response"}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {isVi ? "Ưu tiên xử lý sự cố rò rỉ & mất an ninh cửa" : "Priority scheduling for leaks & urgent repairs"}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isVi ? "Khảo sát tận nơi miễn phí khắp khu vực Auckland." : "Free on-site assessment across all Auckland regions."}</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isVi ? "Báo giá sửa chữa cố định (Fixed Price) minh bạch trước khi làm." : "Transparent itemized fixed-price quotes before work starts."}</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isVi ? "Thợ LBP lành nghề, có bảo hiểm trách nhiệm pháp lý đầy đủ." : "Fully insured licensed building practitioners."}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. REMEDIATION DIAGNOSTIC MATRIX */}
      {remediationMatrix.length > 0 && (
        <section className="w-full py-16 bg-surface-container-lowest border-t border-border-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-200 mb-3">
                <Hammer className="w-3.5 h-3.5 text-amber-700" />
                <span>{isVi ? "Chẩn Đoán & Phương Án Khắc Phục" : "Issue & Remediation Matrix"}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {isVi ? "Các Vấn Đề Nhà Cửa Thường Gặp & Giải Pháp Dứt Điểm" : "Common Property Issues & Tailored Solutions"}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                {isVi
                  ? "Đừng để những lỗi nhỏ phát triển thành hư hỏng kết cấu tốn kém hàng chục nghìn đô la."
                  : "Catch minor wear early to prevent severe timber framing decay and costly remedial work."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {remediationMatrix.map((item: any, idx: number) => {
                const sIssue = isVi ? item.issue_vi : item.issue_en;
                const sSolution = isVi ? item.solution_vi : item.solution_en;

                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-border-light shadow-sm hover:shadow-md transition-shadow space-y-3"
                  >
                    <div className="flex items-center gap-2 text-amber-800">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                      <h3 className="text-base font-bold text-primary">
                        {sIssue}
                      </h3>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <strong className="text-primary font-semibold block mb-1">
                        {isVi ? "Giải pháp NS Building:" : "Our Remediation Approach:"}
                      </strong>
                      <span>{sSolution}</span>
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
