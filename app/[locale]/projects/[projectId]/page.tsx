import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import path from "path";
import ProjectDetailView from "@/components/ProjectDetailView";
import { readJsonSafe } from "@/lib/json-store";

export const dynamic = "force-dynamic";

const projectsDetailPath = path.join(process.cwd(), "content", "projects_detail.json");
const dictViPath = path.join(process.cwd(), "content", "dictionaries", "vi.json");
const dictEnPath = path.join(process.cwd(), "content", "dictionaries", "en.json");

function getProjectDetail(projectId: string) {
  const data = readJsonSafe<Record<string, any>>(projectsDetailPath, {});
  return data[projectId] || data["remuera-architectural-renovation"];
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
      project={project}
      locale={locale as "en" | "vi"}
      dict={dict}
    />
  );
}
