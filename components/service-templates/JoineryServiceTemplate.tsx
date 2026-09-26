import React from "react";
import ServiceHero from "@/components/service-blocks/ServiceHero";
import ServicePricingTable from "@/components/service-blocks/ServicePricingTable";
import ServiceCtaSection from "@/components/service-blocks/ServiceCtaSection";
import { CheckCircle2, Wrench, Sparkles, Layers, Box, DoorOpen, ShieldCheck } from "lucide-react";

interface JoineryServiceTemplateProps {
  serviceId: string;
  service: any;
  locale: "en" | "vi";
  dict: any;
  relatedProject?: any;
}

export default function JoineryServiceTemplate({
  serviceId,
  service,
  locale,
  dict,
}: JoineryServiceTemplateProps) {
  const isVi = locale === "vi";
  const title = isVi ? service.title_vi : service.title_en;
  const intro = isVi ? service.intro_vi : service.intro_en;
  const features = isVi ? service.features_vi : service.features_en;
  const pricingList = service.pricing || [];
  const craftHighlights = service.craft_highlights || [];
  const doorSystems = service.door_systems || [];

  return (
    <div>
      {/* 1. HERO */}
      <ServiceHero
        title={title}
        intro={intro}
        heroImage={service.hero_image}
        locale={locale}
        badgeText={
          serviceId === "cabinets"
            ? (isVi ? "Xưởng Mộc May Đo • Phụ Kiện Blum Châu Âu" : "Bespoke Millwork • Austrian Blum Hardware")
            : (isVi ? "Cửa Lùa Âm Tường • Cửa Cách Âm 35dB Chuẩn Xác" : "Pocket Cavity Systems • 35dB Acoustic Doors")
        }
      />

      {/* 2. PRECISION CRAFTSMANSHIP & KEY FEATURES */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
                {isVi ? "Tiêu Chuẩn Kỹ Thuật Dung Sai Milimét" : "Millimeter Precision & Durability"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                {isVi
                  ? `Quy chuẩn vật liệu & cơ khí cho ${title}`
                  : `Custom Engineering & Hardware Performance`}
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {isVi
                ? "Khí hậu tại New Zealand có độ ẩm thay đổi lớn giữa các mùa. Đồ gỗ và hệ thống cửa tại NS Building được gia công bằng vật liệu lõi xanh chống ẩm HMR, nẹp cạnh kháng nước PUR và phụ kiện kim khí chịu tải vượt trội."
                : "Auckland humidity requires superior materials. We engineer cabinetry and door framing with moisture-resistant HMR carcasses, PUR edge-banding, and industrial-grade rolling hardware."}
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
            <div className="p-8 rounded-3xl bg-gradient-to-br from-surface-container-low via-white to-amber-50/40 border border-border-light shadow-lg space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-bronze/15 text-bronze flex items-center justify-center">
                  {serviceId === "cabinets" ? <Box className="w-6 h-6" /> : <DoorOpen className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    {isVi ? "Cam Kết Chất Lượng Độc Quyền" : "Engineered Joinery Promise"}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {isVi ? "Bảo hành phụ kiện trọn đời & ray trượt êm" : "Lifetime smooth glide & Blum hardware warranty"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm space-y-1">
                  <span className="block text-2xl font-extrabold text-primary">200,000</span>
                  <span className="text-xs text-slate-600 block">
                    {isVi ? "Chu kỳ đóng mở test" : "Tested test cycles"}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm space-y-1">
                  <span className="block text-2xl font-extrabold text-primary">E0 / HMR</span>
                  <span className="text-xs text-slate-600 block">
                    {isVi ? "Chuẩn ván kháng ẩm cao" : "High moisture resistant"}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm space-y-1">
                  <span className="block text-2xl font-extrabold text-primary">100%</span>
                  <span className="text-xs text-slate-600 block">
                    {isVi ? "May đo theo kích thước nhà" : "Custom-built on-site"}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm space-y-1">
                  <span className="block text-2xl font-extrabold text-primary">{isVi ? "10 Năm" : "10 Years"}</span>
                  <span className="text-xs text-slate-600 block">
                    {isVi ? "Bảo hành lắp đặt" : "Workmanship guarantee"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3A. CABINETS SPECIALIZED SECTION: CRAFT HIGHLIGHTS */}
      {serviceId === "cabinets" && craftHighlights.length > 0 && (
        <section className="w-full py-16 bg-surface-container-lowest border-t border-border-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-200 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{isVi ? "Chi Tiết Đẳng Cấp" : "Luxury Cabinetry Specifications"}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {isVi ? "Cấu Tạo Vật Liệu & Phụ Kiện Tủ Bếp May Đo" : "Precision Joinery & Hardware Anatomy"}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                {isVi
                  ? "Sự khác biệt nằm ở những chi tiết bên trong: từ phụ kiện ray hộp, bản lề giảm chấn, mặt đá thạch anh vát cạnh đến hệ thống đèn LED âm thanh lịch."
                  : "True luxury is felt in daily use. European tandembox drawer slides, seamless quartz returns, and concealed architectural LED channels."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {craftHighlights.map((item: any, idx: number) => {
                const sTitle = isVi ? item.title_vi : item.title_en;
                const sDesc = isVi ? item.desc_vi : item.desc_en;

                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-border-light shadow-sm hover:shadow-lg transition-all space-y-3 group hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 rounded-xl bg-bronze/10 text-bronze flex items-center justify-center group-hover:bg-bronze group-hover:text-white transition-colors">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-primary group-hover:text-bronze transition-colors">
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

      {/* 3B. DOORS SPECIALIZED SECTION: DOOR SYSTEMS */}
      {serviceId === "doors" && doorSystems.length > 0 && (
        <section className="w-full py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 bg-bronze/20 text-bronze-light px-3.5 py-1.5 rounded-full text-xs font-bold border border-bronze/30 mb-3">
                <DoorOpen className="w-3.5 h-3.5" />
                <span>{isVi ? "Giải Pháp Đóng Mở Hiện Đại" : "Advanced Door Systems"}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isVi ? "Các Hệ Thống Cửa Chuyên Dụng Cho Nhà Ở NZ" : "Architectural Door Configurations"}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                {isVi
                  ? "Tối ưu hóa diện tích sàn bằng cửa lùa âm tường, cách ly tiếng ồn tuyệt đối bằng cửa lõi đặc hoặc mở rộng tối đa tầm nhìn bằng cửa xếp trượt."
                  : "Maximize usable living space with cavity sliding pockets, protect privacy with 35dB solid-core doors, or expand patio views with bifold glass."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doorSystems.map((item: any, idx: number) => {
                const sTitle = isVi ? item.title_vi : item.title_en;
                const sDesc = isVi ? item.desc_vi : item.desc_en;

                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-bronze/50 transition-all space-y-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-bronze/20 text-bronze-light flex items-center justify-center shrink-0">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-bronze transition-colors">
                        {sTitle}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-12">
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
