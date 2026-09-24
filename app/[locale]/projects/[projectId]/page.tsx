import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import path from "path";
import ProjectDetailView from "@/components/ProjectDetailView";
import { readJsonSafe } from "@/lib/json-store";
import { normalizeProject } from "@/lib/project-normalize";

export const revalidate = 300; // ISR: admin edits trigger revalidatePath sooner
export const dynamicParams = true; // allow admin-created projects not pre-rendered

const projectsDetailPath = path.join(process.cwd(), "content", "projects_detail.json");
const projectsPath = path.join(process.cwd(), "content", "projects.json");
const dictViPath = path.join(process.cwd(), "content", "dictionaries", "vi.json");
const dictEnPath = path.join(process.cwd(), "content", "dictionaries", "en.json");

function getProjectDetail(projectId: string) {
  // 1. Flagship rich editorials (authored JSON with full schema).
  const detailData = readJsonSafe<Record<string, any>>(projectsDetailPath, {});
  if (detailData[projectId]) return detailData[projectId];

  // 2. Admin-managed simple projects — normalize into the rich shape expected
  // by ProjectDetailView so they render a full detail page.
  const simpleProjects = readJsonSafe<any[]>(projectsPath, []);
  const simple = simpleProjects.find((p) => p.id === projectId);
  if (simple) return normalizeProject(simple);

  return null;
}

function getDictionary(locale: string) {
  return readJsonSafe<any>(locale === "vi" ? dictViPath : dictEnPath, {});
}

interface PageProps {
  params: {
    locale: string;
    projectId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, projectId } = params;
  const project = getProjectDetail(projectId);

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
      title: `${isVi ? project.header.title.vi : project.header.title.en} | NS Building`,
      description: isVi ? project.header.subtitle.vi : project.header.subtitle.en,
      images: [project.hero_showcase.image],
    },
  };
}

export default function ProjectPage({ params }: PageProps) {
  const { locale, projectId } = params;

  if (locale !== "en" && locale !== "vi") {
    notFound();
  }

  const project = getProjectDetail(projectId);

  if (!project) {
    notFound();
  }

  const dict = getDictionary(locale);

  return (
    <ProjectDetailView
      project={project as any}
      locale={locale as "en" | "vi"}
      dict={dict}
    />
  );
}
