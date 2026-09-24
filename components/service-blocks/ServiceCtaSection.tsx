import React from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  Phone,
  ArrowRight,
  Mail,
} from "lucide-react";

interface ServiceCtaSectionProps {
  locale: "en" | "vi";
  dict?: any;
}

export default function ServiceCtaSection({
  locale,
  dict,
}: ServiceCtaSectionProps) {
  const isVi = locale === "vi";
  const pDict = (dict as any)?.pricing_section || {};

  return (
    <section
      id="service-cta"
      className="w-full py-16 lg:py-20 bg-gradient-to-br from-primary-dark via-primary to-slate-900 text-white relative overflow-hidden"
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-bronze/15 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-bronze/20 text-bronze-light px-3.5 py-1.5 rounded-full text-xs font-bold border border-bronze/30">
              <CalendarCheck className="w-3.5 h-3.5 text-bronze-light" />
              <span>
                {pDict.cta_badge ||
                  (isVi ? "Khảo Sát Tận Nơi Miễn Phí" : "Free On-Site Consultation")}
              </span>
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
                <CheckCircle2 className="w-4 h-4 text-bronze-light shrink-0" />
                <span>
                  {pDict.trust_free ||
                    (isVi
                      ? "100% Khảo sát hiện trạng miễn phí tại Auckland"
                      : "100% Free on-site survey across Auckland")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-bronze-light shrink-0" />
                <span>
                  {pDict.trust_fixed ||
                    (isVi
                      ? "Báo giá trọn gói minh bạch, cam kết không phát sinh"
                      : "Transparent itemized contract - No hidden surprises")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-bronze-light shrink-0" />
                <span>
                  {pDict.trust_guarantee ||
                    (isVi
                      ? "Thợ LBP lành nghề & bảo hành kết cấu dài hạn"
                      : "Licensed Building Practitioners & comprehensive warranty")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Fast Direct Action Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 sm:p-8 rounded-3xl shadow-2xl space-y-6">
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
                <a
                  href="tel:0276666510"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-bronze hover:bg-bronze-dark text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-bronze/40 group"
                >
                  <Phone className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>
                    {pDict.cta_call ||
                      (isVi ? "Gọi Ngay: 027 666 6510" : "Call Direct: 027 666 6510")}
                  </span>
                </a>

                <Link
                  href={`/${locale}/#quote-section`}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/20 group"
                >
                  <span>
                    {pDict.cta_request ||
                      (isVi ? "Đặt Lịch Khảo Sát Miễn Phí" : "Book a Free Site Inspection")}
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
                <a
                  href="tel:0211531510"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-bronze-light" />
                  <span>
                    Mobile: <strong>021 153 1510</strong>
                  </span>
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
  );
}
