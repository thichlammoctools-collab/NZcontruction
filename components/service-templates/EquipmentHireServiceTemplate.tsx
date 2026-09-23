import React from "react";
import ServiceHero from "@/components/service-blocks/ServiceHero";
import ServicePricingTable from "@/components/service-blocks/ServicePricingTable";
import ServiceCtaSection from "@/components/service-blocks/ServiceCtaSection";
import { CheckCircle2, Wrench, Truck, ShieldCheck, Clock, Phone, CalendarCheck } from "lucide-react";

interface EquipmentHireServiceTemplateProps {
  serviceId: string;
  service: any;
  locale: "en" | "vi";
  dict: any;
  relatedProject?: any;
}

export default function EquipmentHireServiceTemplate({
  service,
  locale,
  dict,
}: EquipmentHireServiceTemplateProps) {
  const isVi = locale === "vi";
  const title = isVi ? service.title_vi : service.title_en;
  const intro = isVi ? service.intro_vi : service.intro_en;
  const features = isVi ? service.features_vi : service.features_en;
  const pricingList = service.pricing || [];
  const equipmentCatalog = service.equipment_catalog || [];

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
            ? "Kiểm Định An Toàn Tagged & Tested • Giao Tận Nơi Tại Auckland"
            : "Tagged & Tested Site Certified • Auckland Delivery"
        }
      />

      {/* 2. EQUIPMENT FLEET OVERVIEW */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
                {isVi ? "Kho Máy Móc Chuyên Nghiệp" : "Professional Tool & Plant Hire"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                {isVi
                  ? "Trang thiết bị hiện đại sẵn sàng phục vụ công trình của bạn"
                  : "High-Performance Machinery Ready for Immediate Hire"}
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {isVi
                ? "Dành cho các nhà thầu phụ, thợ tự do và gia chủ tự làm (DIY). Toàn bộ thiết bị được bảo dưỡng định kỳ, kiểm định an toàn điện (Test & Tag), kèm hướng dẫn vận hành chi tiết và hỗ trợ giao nhận tận nơi khắp khu vực Auckland."
                : "Tailored for subcontractors, independent trades, and ambitious DIY renovators. All plant is pre-serviced, electrical safety tagged, and available for flexible short or long-term hire."}
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

          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-6">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <span>{isVi ? "Chính Sách Thuê Minh Bạch" : "Hiring Guarantees"}</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-primary font-bold">
                      {isVi ? "Giao tận công trình:" : "Auckland Site Delivery:"}
                    </strong>
                    <span>{isVi ? "Hỗ trợ vận chuyển giàn giáo & máy móc tận nơi." : "Drop-off and pick-up available across all Auckland suburbs."}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-primary font-bold">
                      {isVi ? "Linh hoạt thời gian:" : "Flexible Rental Periods:"}
                    </strong>
                    <span>{isVi ? "Thuê theo ngày, cuối tuần hoặc gói dài hạn chiết khấu cao." : "Day rates, weekend packages, and discounted monthly contracts."}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-primary font-bold">
                      {isVi ? "Hướng dẫn sử dụng trực tiếp:" : "Hands-On Briefing:"}
                    </strong>
                    <span>{isVi ? "Kỹ thuật viên hướng dẫn vận hành an toàn trước khi bàn giao." : "Full safety briefing and operation tips provided upon handover."}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="tel:0276666510"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isVi ? "Gọi Đặt Máy Ngay: 027 666 6510" : "Call to Reserve: 027 666 6510"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EQUIPMENT CATALOG CARDS */}
      {equipmentCatalog.length > 0 && (
        <section className="w-full py-16 bg-surface-container-low border-t border-border-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-200 mb-3">
                <Wrench className="w-3.5 h-3.5 text-amber-700" />
                <span>{isVi ? "Danh Mục Thiết Bị Cho Thuê" : "Featured Machinery Lineup"}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {isVi ? "Thông Số Kỹ Thuật & Đơn Giá Thuê" : "Machinery Specifications & Hire Rates"}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                {isVi
                  ? "Máy móc công suất cao giúp rút ngắn 50% thời gian thi công và đảm bảo độ an toàn tối đa cho thợ."
                  : "Commercial-grade reliability to dramatically accelerate project timelines and ensure worker safety."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {equipmentCatalog.map((item: any, idx: number) => {
                const sName = isVi ? item.name_vi : item.name_en;
                const sSpecs = isVi ? item.specs_vi : item.specs_en;
                const sBadge = isVi ? item.badge_vi : item.badge_en;

                return (
                  <div
                    key={idx}
                    className="p-6 sm:p-8 rounded-3xl bg-white border border-border-light shadow-sm hover:shadow-xl transition-all space-y-5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          {sBadge}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {isVi ? "Sẵn sàng giao" : "In Stock"}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-primary leading-snug">
                        {sName}
                      </h3>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          {isVi ? "Thông số kỹ thuật:" : "Key Specifications:"}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                          {sSpecs}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-xs text-slate-500 block">{isVi ? "Giá Ngày:" : "Day Rate:"}</span>
                          <span className="text-xl font-extrabold text-primary">{item.rate_day}</span>
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div>
                          <span className="text-xs text-slate-500 block">{isVi ? "Giá Tuần:" : "Week Rate:"}</span>
                          <span className="text-xl font-extrabold text-amber-700">{item.rate_week}</span>
                        </div>
                      </div>

                      <a
                        href="tel:0276666510"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{isVi ? "Thuê máy" : "Book Now"}</span>
                      </a>
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
