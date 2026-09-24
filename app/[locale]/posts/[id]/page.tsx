import React from "react";
import Link from "next/link";
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

function getPost(id: string): any | null {
  const posts = readJsonSafe<any[]>(postsFilePath, []);
  return posts.find((p) => p.id === id) || null;
}

function getDictionary(locale: string): any {
  return readJsonSafe<any>(locale === "vi" ? dictViPath : dictEnPath, {});
}

interface PageProps {
  params: { locale: string; id: string };
}

export function generateMetadata({ params }: PageProps) {
  const { locale, id } = params;
  const post = getPost(id);
  if (!post) return { title: "Post Not Found | NS Building" };
  const isVi = locale === "vi";
  const title = isVi ? post.title_vi || post.title_en : post.title_en;
  const desc = isVi ? post.summary_vi || post.summary_en : post.summary_en;
  return {
    title: `${title} | NS Building`,
    description: desc,
    alternates: {
      canonical: `/${locale}/posts/${id}`,
      languages: { en: `/en/posts/${id}`, vi: `/vi/posts/${id}` },
    },
    openGraph: {
      title: `${title} | NS Building`,
      description: desc,
      images: post.image ? [post.image] : undefined,
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

// Split body text into paragraphs by blank/empty lines.
function toParagraphs(text: string | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function PostDetailPage({ params }: PageProps) {
  const { locale, id } = params;
  if (locale !== "en" && locale !== "vi") notFound();
  const isVi = locale === "vi";

  const post = getPost(id);
  if (!post) notFound();

  const dict = getDictionary(locale);
  const cat = CATEGORY_LABELS[post.category] || {
    vi: post.category,
    en: post.category,
  };
  const paragraphs = toParagraphs(isVi ? post.content_vi : post.content_en);
  const fallbackSummary = isVi ? post.summary_vi : post.summary_en;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
      <Header locale={locale as "en" | "vi"} dict={dict} />

      <main className="flex-1 pt-16 md:pt-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-on-surface-variant mb-6">
            <Link href={`/${locale}`} className="hover:text-on-surface transition-colors">
              {dict.nav?.home || (isVi ? "Trang Chủ" : "Home")}
            </Link>
            <span className="text-outline-variant">/</span>
            <Link href={`/${locale}/posts`} className="hover:text-on-surface transition-colors">
              {isVi ? "Cẩm Nang" : "Journal"}
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-semibold truncate">
              {isVi ? post.title_vi || post.title_en : post.title_en}
            </span>
          </nav>

          {/* Category + meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider">
              {isVi ? cat.vi : cat.en}
            </span>
            <span className="text-xs text-on-surface-variant">{post.date}</span>
            <span className="text-xs text-on-surface-variant">
              {isVi ? "bởi" : "by"} {post.author}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-tight">
            {isVi ? post.title_vi || post.title_en : post.title_en}
          </h1>

          {fallbackSummary && (
            <p className="mt-4 text-base sm:text-lg text-on-surface-variant leading-relaxed">
              {fallbackSummary}
            </p>
          )}

          {/* Hero image */}
          {post.image && (
            <div className="mt-8 rounded-2xl overflow-hidden border border-border-light bg-surface-container shadow-sm">
              <img
                src={post.image}
                alt={isVi ? post.title_vi || post.title_en : post.title_en}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Body */}
          <div className="mt-8 space-y-5 text-sm sm:text-base text-on-surface leading-relaxed">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{fallbackSummary}</p>
            )}
          </div>

          {/* Back link */}
          <div className="mt-12 pt-6 border-t border-border-light">
            <Link
              href={`/${locale}/posts`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              {isVi ? "Quay lại danh sách bài viết" : "Back to all articles"}
            </Link>
          </div>
        </article>
      </main>

      <Footer locale={locale as "en" | "vi"} dict={dict} />
      <SocialChatButtons locale={locale as "en" | "vi"} />
      <AIChatWidget locale={locale as "en" | "vi"} />
      <MobileBottomNav locale={locale as "en" | "vi"} dict={dict} />
    </div>
  );
}
