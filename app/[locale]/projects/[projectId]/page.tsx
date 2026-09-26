import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import path from "path";
import ProjectDetailView from "@/components/ProjectDetailView";
import { readJsonSafe } from "@/lib/json-store";
import { normalizeProject } from "@/lib/project-normalize";

export const dynamic = "force-dynamic";

const projectsDetailPath = path.join(process.cwd(), "content", "projects_detail.json");
const projectsPath = path.join(process.cwd(), "content", "projects.json");
const dictViPath = path.join(process.cwd(), "content", "dictionaries", "vi.json");
const dictEnPath = path.join(process.cwd(), "content", "dictionaries", "en.json");

async function getProjectDetail(projectId: string) {
  const normId = decodeURIComponent(projectId).toLowerCase().trim();

  // 1. Flagship rich editorials (authored JSON with full schema).
  const detailData = await readJsonSafe<Record<string, any>>(projectsDetailPath, {});
  if (detailData[projectId]) return detailData[projectId];
  if (detailData[normId]) return detailData[normId];

  // 2. Admin-managed simple projects — normalize into the rich shape expected
  // by ProjectDetailView so they render a full detail page.
  const simpleProjects = await readJsonSafe<any[]>(projectsPath, []);
  let simple = simpleProjects.find(
    (p) => p.id === projectId || p.id?.toLowerCase() === normId
  );

  // Check aliases
  if (!simple) {
    const aliasMap: Record<string, string> = {
      "epsom-joinery": "epsom-custom-kitchen-cabinetry",
      "epsom-custom-kitchen-cabinetry": "epsom-joinery",
      "takapuna-kitchen": "takapuna-luxury-bathroom",
      "takapuna-luxury-bathroom": "takapuna-kitchen",
      "remuera-flooring": "remuera-architectural-renovation",
    };
    const mappedId = aliasMap[normId];
    if (mappedId) {
      if (detailData[mappedId]) return detailData[mappedId];
      simple = simpleProjects.find((p) => p.id === mappedId);
    }
  }

  // 3. Fallback: check dictionary portfolio items (vi / en)
  if (!simple) {
    const [dictEn, dictVi] = await Promise.all([
      readJsonSafe<any>(dictEnPath, {}),
      readJsonSafe<any>(dictViPath, {}),
    ]);
    const itemEn = dictEn?.portfolio?.items?.find(
      (i: any) => i.id === projectId || i.id?.toLowerCase() === normId
    );
    const itemVi = dictVi?.portfolio?.items?.find(
      (i: any) => i.id === projectId || i.id?.toLowerCase() === normId
    );
    if (itemEn || itemVi) {
      const yearStr = (itemEn?.year || itemVi?.year || "").replace(/\D/g, "");
      simple = {
        id: itemEn?.id || itemVi?.id || projectId,
        title_en: itemEn?.title || itemVi?.title || "NS Building Project",
        title_vi: itemVi?.title || itemEn?.title || "Dự Án NS Building",
        suburb: itemEn?.location || itemVi?.location || "Auckland, New Zealand",
        category: itemEn?.category || itemVi?.category || "renovations",
        completed_year: yearStr || "2024",
        before_image: itemEn?.image || itemVi?.image || "",
        after_image: itemEn?.image || itemVi?.image || "",
        description_en: itemEn?.desc || "",
        description_vi: itemVi?.desc || "",
      };
    }
  }

  if (simple) return normalizeProject(simple);

  return null;
}

async function getDictionary(locale: string) {
  return await readJsonSafe<any>(locale === "vi" ? dictViPath : dictEnPath, {});
}

interface PageProps {
  params: Promise<{
    locale: string;
    projectId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, projectId } = await params;
  const project = await getProjectDetail(projectId);

  if (!project) {
    return {
      title: "Project Detail | NS Building",
    };
  }

  const isVi = locale === "vi";
  return {
    title: `${isVi ? project.header.title.vi : project.header.title.en} | NS Building NZ`,
    description: isVi ? project.header.subtitle.vi : project.header.subtitle.en,
    alternates: {
      canonical: `/${locale}/projects/${projectId}`,
      languages: {
        en: `/en/projects/${projectId}`,
        vi: `/vi/projects/${projectId}`,
      },
    },
    openGraph: {
      title: `${isVi ? project.header.title.vi : project.header.title.en} | NS Building NZ`,
      description: isVi ? project.header.subtitle.vi : project.header.subtitle.en,
      images: [project.hero_showcase.image],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { locale, projectId } = await params;

  if (locale !== "en" && locale !== "vi") {
    notFound();
  }

  const project = await getProjectDetail(projectId);

  if (!project) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <ProjectDetailView
      project={project as any}
      locale={locale as "en" | "vi"}
      dict={dict}
    />
  );
}
