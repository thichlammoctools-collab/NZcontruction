import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === "vi";
  return {
    // Root layout hardcodes lang="en" (html tag cannot be re-rendered per-route
    // in App Router); document the real page language for crawlers/readers.
    other: isVi ? { "content-language": "vi" } : { "content-language": "en" },
    title: isVi
      ? "NS Building | Cải Tạo Nhà Ở Chuyên Nghiệp Auckland & New Zealand"
      : "NS Building | Residential Renovation & Construction Specialists New Zealand",
    description: isVi
      ? "Chuyên gia cải tạo nhà ở cao cấp tại Auckland: phòng tắm, tủ bếp, sàn gỗ, sơn sửa. Thợ được cấp phép LBP #BP128842 và bảo hiểm đầy đủ."
      : "Master residential renovation, luxury bathrooms, custom cabinetry, timber flooring, and property repairs across Auckland & New Zealand. Licensed & insured craftsmen.",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        vi: "/vi",
      },
    },
    openGraph: {
      locale: isVi ? "vi_VN" : "en_NZ",
      url: `https://nsbuilding.co.nz/${locale}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <div lang={locale}>{children}</div>;
}
