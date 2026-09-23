import React from "react";
import ServiceHero from "@/components/service-blocks/ServiceHero";
import ServicePricingTable from "@/components/service-blocks/ServicePricingTable";
import ServiceCtaSection from "@/components/service-blocks/ServiceCtaSection";
import { CheckCircle2, Paintbrush, Layers, Shield, Droplets, Sun, Sparkles } from "lucide-react";

interface SurfaceFinishingServiceTemplateProps {
  serviceId: string;
  service: any;
  locale: "en" | "vi";
  dict: any;
  relatedProject?: any;
}

export default function SurfaceFinishingServiceTemplate({
  serviceId,
  service,
  locale,
  dict,
}: SurfaceFinishingServiceTemplateProps) {
  const isVi = locale === "vi";
  const title = isVi ? service.title_vi : service.title_en;
  const intro = isVi ? service.intro_vi : service.intro_en;
  const features = isVi ? service.features_vi : service.features_en;
  const pricingList = service.pricing || [];
  const comparisonMatrix = service.comparison_matrix || [];
  const surfaceFinishes = service.surface_finishes || [];

  return (
    <div>
      {/* 1. HERO */}
      <ServiceHero
        title={title}
        intro={intro}
        heroImage={service.hero_image}
        locale={locale}
        badgeText={
          serviceId === "flooring"
            ? (isVi ? "Sàn Gỗ Kỹ Thuật • Phục Hồi Gỗ Bản Địa NZ" : "Engineered Oak • Native Heritage Timber Sanding")
            : (isVi ? "Chuẩn Bả GIB Level 5 • Trát Microcement & Sơn UV" : "Level 5 GIB Stopping • Microcement & UV Shield")
        }
      />

      {/* 2. OVERVIEW & SCOPE */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
                {isVi ? "Nghệ Thuật Bề Mặt & Hoàn Thiện" : "Surface Mastery & Durability"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                {isVi
                  ? `Độ bền vượt thời gian & Thẩm mỹ đỉnh cao cho ${title}`
                  : `Flawless Tactile Texture & Long-Lasting Protection`}
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {isVi
                ? "Bề mặt sàn và tường là nơi tiếp xúc thị giác và xúc giác nhiều nhất trong căn nhà. Chúng tôi áp dụng quy trình chà nhám hút bụi không hạt, sơn bả phẳng gương chống tia sáng xiên và lớp phủ bảo vệ chịu ma sát cao."
                : "Floor and wall finishes define the ambiance of your home. We use dust-free vacuum sanding machinery, critical raking light inspections, and premium low-VOC non-toxic coatings."}
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
            <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-bronze/20 rounded-full blur-2xl"></div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-bronze/20 text-bronze-light flex items-center justify-center">
                  {serviceId === "flooring" ? <Layers className="w-6 h-6" /> : <Paintbrush className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isVi ? "Tiêu Chuẩn Bề Mặt NS Building" : "Premium Surface Guarantee"}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {isVi ? "Thợ sơn bả & Lát sàn chuyên môn cao" : "Dedicated master tradesmen & inspection"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-bronze-light text-xs font-bold uppercase">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{isVi ? "Độ bền phủ" : "Wear Layer"}</span>
                  </div>
                  <span className="block text-xl font-bold text-white">15+ Năm</span>
                  <span className="text-[11px] text-slate-400 block">
                    {isVi ? "Chống trầy & bạc màu" : "Scratch & UV resistant"}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-bronze-light text-xs font-bold uppercase">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>{isVi ? "Kháng ẩm" : "Moisture Safe"}</span>
                  </div>
                  <span className="block text-xl font-bold text-white">100%</span>
                  <span className="text-[11px] text-slate-400 block">
                    {isVi ? "Chống mốc & vi khuẩn" : "Anti-mould barrier"}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-bronze-light text-xs font-bold uppercase">
                    <Sun className="w-3.5 h-3.5" />
                    <span>{isVi ? "Ánh sáng rọi" : "Raking Light"}</span>
                  </div>
                  <span className="block text-xl font-bold text-white">Level 5</span>
                  <span className="text-[11px] text-slate-400 block">
                    {isVi ? "Phẳng mịn tuyệt đối" : "Zero seam shadows"}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-bronze-light text-xs font-bold uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isVi ? "An toàn khí" : "Eco Friendly"}</span>
                  </div>
                  <span className="block text-xl font-bold text-white">Low-VOC</span>
                  <span className="text-[11px] text-slate-400 block">
                    {isVi ? "Sơn ít mùi an toàn" : "Dulux & Resene certified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3A. FLOORING SPECIALIZED SECTION: COMPARISON MATRIX */}
      {serviceId === "flooring" && comparisonMatrix.length > 0 && (
        <section className="w-full py-16 bg-surface-container-low border-t border-border-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-200 mb-3">
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                <span>{isVi ? "Bảng So Sánh Vật Liệu" : "Material Comparison Matrix"}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {isVi ? "Chọn Loại Sàn Phù Hợp Nhất Với Ngôi Nhà Của Bạn" : "Find the Ideal Flooring for Your Lifestyle"}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                {isVi
                  ? "Mỗi dòng sàn mang một đặc tính riêng về độ sang trọng, độ bền chịu nước và nhu cầu bảo dưỡng."
                  : "Compare natural timber warmth, engineered oak stability, herringbone luxury, and waterproof hybrid vinyl convenience."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {comparisonMatrix.map((item: any, idx: number) => {
                const sType = isVi ? item.type_vi : item.type_en;
                const sFeel = isVi ? item.finish_feel_vi : item.finish_feel_en;
                const sMaint = isVi ? item.maintenance_vi : item.maintenance_en;

                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-border-light shadow-sm hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-primary pb-2 border-b border-slate-100">
                        {sType}
                      </h3>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">{isVi ? "Độ bền:" : "Durability:"}</span>
                          <span className="text-amber-600 font-bold tracking-widest">{item.durability}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">{isVi ? "Kháng nước:" : "Water Resistance:"}</span>
                          <span className="text-amber-600 font-bold tracking-widest">{item.water_resistance}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          {isVi ? "Cảm giác bề mặt:" : "Tactile Experience:"}
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {sFeel}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        {isVi ? "Bảo dưỡng:" : "Maintenance:"}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {sMaint}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3B. PAINTING SPECIALIZED SECTION: SURFACE FINISHES & GIB STOPPING */}
      {serviceId === "painting" && surfaceFinishes.length > 0 && (
        <section className="w-full py-16 bg-surface-container-low border-t border-border-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-900 px-3.5 py-1.5 rounded-full text-xs font-bold border border-teal-200 mb-3">
                <Paintbrush className="w-3.5 h-3.5 text-teal-700" />
                <span>{isVi ? "Cấp Độ Sơn Bả Hoàn Thiện" : "Finishing Standards & Specialty Finishes"}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {isVi ? "Từ Bột Bả GIB Level 5 Đến Vách Nghệ Thuật Microcement" : "Precision Level 5 Stopping to Microcement Feature Finishes"}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                {isVi
                  ? "Ánh nắng mặt trời New Zealand chiếu xiên qua cửa sổ kính lớn có thể làm lộ mọi vết gợn nếu tường không được bả chuẩn Level 5."
                  : "Severe Kiwi raking sunlight accentuates every minor drywall defect. We ensure mirror-flat Level 5 skim coats and seamless microcement artistry."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {surfaceFinishes.map((item: any, idx: number) => {
                const sTitle = isVi ? item.title_vi : item.title_en;
                const sDesc = isVi ? item.desc_vi : item.desc_en;

                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-border-light shadow-sm hover:shadow-md transition-shadow space-y-2"
                  >
                    <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 px-2.5 py-1 rounded-md text-xs font-bold">
                      <span>{item.level}</span>
                    </div>
                    <h3 className="text-base font-bold text-primary">
                      {sTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {sDesc}
                    </p>
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
