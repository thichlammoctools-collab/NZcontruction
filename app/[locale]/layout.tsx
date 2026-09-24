import { Metadata } from "next";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isVi = params.locale === "vi";
  return {
    title: isVi
      ? "NS Building | Cải Tạo Nhà Ở Chuyên Nghiệp Auckland & New Zealand"
      : "NS Building | Residential Renovation & Construction Specialists New Zealand",
    description: isVi
      ? "Chuyên gia cải tạo nhà ở cao cấp tại Auckland: phòng tắm, tủ bếp, sàn gỗ, sơn sửa. Thợ được cấp phép LBP #BP128842 và bảo hiểm đầy đủ."
      : "Master residential renovation, luxury bathrooms, custom cabinetry, timber flooring, and property repairs across Auckland & New Zealand. Licensed & insured craftsmen.",
    alternates: {
      canonical: `/${params.locale}`,
      languages: {
        en: "/en",
        vi: "/vi",
      },
    },
    openGraph: {
      locale: isVi ? "vi_VN" : "en_NZ",
      url: `https://nsbuilding.co.nz/${params.locale}`,
    },
  };
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
