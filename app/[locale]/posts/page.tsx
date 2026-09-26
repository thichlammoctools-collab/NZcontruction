import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import path from "path";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import AIChatWidget from "@/components/AIChatWidget";
import SocialChatButtons from "@/components/SocialChatButtons";
import { readJsonSafe } from "@/lib/json-store";

export const dynamic = "force-dynamic";

const postsFilePath = path.join(process.cwd(), "content", "posts.json");
const dictViPath = path.join(process.cwd(), "content", "dictionaries", "vi.json");
const dictEnPath = path.join(process.cwd(), "content", "dictionaries", "en.json");

async function getPosts(): Promise<any[]> {
  return await readJsonSafe<any[]>(postsFilePath, []);
}

async function getDictionary(locale: string): Promise<any> {
  return await readJsonSafe<any>(locale === "vi" ? dictViPath : dictEnPath, {});
}

export function generateStaticParams() {
  return ["en", "vi"].map((locale) => ({ locale }));
}

interface PageProps {
  params: { locale: string };
}

export function generateMetadata({ params }: PageProps) {
  const isVi = params.locale === "vi";
  return {
    title: isVi
      ? "Cẩm Nang & Kinh Nghiệm Xây Dựng | NS Building"
      : "Insights & Renovation Guides | NS Building",
    description: isVi
      ? "Chia sẻ kinh nghiệm cải tạo nhà, xây dựng và bảo trì từ đội ngũ thợ lành nghề LBP #BP128842 tại Auckland."
      : "Practical renovation, construction and maintenance insights from our Licensed Building Practitioner team (LBP #BP128842) across Auckland.",
    alternates: {
      canonical: `/${params.locale}/posts`,
      languages: { en: "/en/posts", vi: "/vi/posts" },
    },
  };
}

const CATEGORY_LABELS: Record<string, { vi: string; en: string }> = {
  renovations: { vi: "Cải Tạo", en: "Renovation" },
  bathrooms: { vi: "Phòng Tắm", en: "Bathroom" },
  cabinets: { vi: "Tủ Bếp & Đồ Gỗ", en: "Joinery" },
  flooring: { vi: "Sàn Nhà", en: "Flooring" },
  doors: { vi: "Cửa & Mộc", en: "Doors" },
  painting: { vi: "Sơn Bả", en: "Painting" },
  hiring: { vi: "Cho Thuê Thiết Bị", en: "Equipment Hire" },
  maintenance: { vi: "Bảo Trì", en: "Maintenance" },
  tips: { vi: "Mẹo Hay", en: "Tips" },
  news: { vi: "Tin Tức", en: "News" },
};

export default async function PostsListPage({ params }: PageProps) {
  const { locale } = params;
  if (locale !== "en" && locale !== "vi") notFound();
  const isVi = locale === "vi";
  const dict = await getDictionary(locale);
  const posts = await getPosts();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
      <Header locale={locale as "en" | "vi"} dict={dict} />

      <main className="flex-1 pt-16 md:pt-20">
        {/* Hero */}
        <section className="w-full bg-surface-container-low py-14 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-0.5 w-5 bg-secondary"></span>
              <span className="text-xs uppercase tracking-widest text-secondary font-bold">
                {isVi ? "Cẩm Nang NS Building" : "NS Building Journal"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
              {isVi ? "Kinh Nghiệm & Cẩm Nang Xây Dựng" : "Renovation Insights & Guides"}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
              {isVi
                ? "Những chia sẻ thực tế từ công trường: cải tạo nhà, chống thấm, sàn gỗ, tủ bếp và bảo trì nhà cửa chuẩn New Zealand."
                : "Field-tested advice from our job sites: renovations, waterproofing, timber flooring, cabinetry and home maintenance to NZ standards."}
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14 lg:py-20">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-on-surface-variant">
              {isVi ? "Chưa có bài viết nào." : "No posts published yet."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const cat = CATEGORY_LABELS[post.category] || {
                  vi: post.category,
                  en: post.category,
                };
                return (
                  <Link
                    key={post.id}
                    href={`/${locale}/posts/${post.id}`}
                    className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border-light flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/9] w-full bg-surface-dim overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-secondary border border-secondary/20">
                        {isVi ? cat.vi : cat.en}
                      </span>
                    </div>
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                        <span>{post.date}</span>
                        <span className="text-outline-variant">&bull;</span>
                        <span>{post.author}</span>
                      </div>
                      <h3 className="text-base font-bold text-primary leading-tight group-hover:text-secondary transition-colors">
                        {isVi ? post.title_vi || post.title_en : post.title_en}
                      </h3>
                      <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed pt-1">
                        {isVi ? post.summary_vi || post.summary_en : post.summary_en}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer locale={locale as "en" | "vi"} dict={dict} />
      <SocialChatButtons locale={locale as "en" | "vi"} />
      <AIChatWidget locale={locale as "en" | "vi"} />
      <MobileBottomNav locale={locale as "en" | "vi"} dict={dict} />
    </div>
  );
}
