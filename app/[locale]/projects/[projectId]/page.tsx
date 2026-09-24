import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailView from "@/components/ProjectDetailView";
import enDict from "@/content/dictionaries/en.json";
import viDict from "@/content/dictionaries/vi.json";
import projectsDetailData from "@/content/projects_detail.json";

export function generateStaticParams() {
  const locales = ["en", "vi"];
  const projectIds = [
    "remuera-architectural-renovation",
    "takapuna-luxury-bathroom",
    "epsom-custom-kitchen-cabinetry",
  ];

  const params: { locale: string; projectId: string }[] = [];
  locales.forEach((locale) => {
    projectIds.forEach((projectId) => {
      params.push({ locale, projectId });
    });
  });
  return params;
}

interface PageProps {
  params: {
    locale: string;
    projectId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, projectId } = params;
  const project =
    (projectsDetailData as any)[projectId] ||
    (projectsDetailData as any)["remuera-architectural-renovation"];

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

  const project =
    (projectsDetailData as any)[projectId] ||
    (projectsDetailData as any)["remuera-architectural-renovation"];

  if (!project) {
    notFound();
  }

  const dict = locale === "vi" ? viDict : enDict;

  return (
    <ProjectDetailView
      project={project}
      locale={locale as "en" | "vi"}
      dict={dict}
    />
  );
}
