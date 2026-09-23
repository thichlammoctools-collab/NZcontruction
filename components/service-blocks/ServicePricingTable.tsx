import React from "react";
import { Sparkles, BadgeCheck, Info } from "lucide-react";

interface PricingItem {
  name_en: string;
  name_vi: string;
  desc_en: string;
  desc_vi: string;
  range: string;
  unit_en: string;
  unit_vi: string;
  popular?: boolean;
}

interface ServicePricingTableProps {
  title: string;
  pricingList: PricingItem[];
  locale: "en" | "vi";
  dict?: any;
}

export default function ServicePricingTable({
  title,
  pricingList,
  locale,
  dict,
}: ServicePricingTableProps) {
  const isVi = locale === "vi";
  const pDict = (dict as any)?.pricing_section || {};

  if (!pricingList || pricingList.length === 0) return null;

  return (
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
              {pricingList.map((item, idx) => {
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
          {pricingList.map((item, idx) => {
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
  );
}
