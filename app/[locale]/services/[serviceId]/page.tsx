import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import AIChatWidget from "@/components/AIChatWidget";

import RenovationServiceTemplate from "@/components/service-templates/RenovationServiceTemplate";
import JoineryServiceTemplate from "@/components/service-templates/JoineryServiceTemplate";
import SurfaceFinishingServiceTemplate from "@/components/service-templates/SurfaceFinishingServiceTemplate";
import EquipmentHireServiceTemplate from "@/components/service-templates/EquipmentHireServiceTemplate";
import PropertyMaintenanceServiceTemplate from "@/components/service-templates/PropertyMaintenanceServiceTemplate";

import enDict from "@/content/dictionaries/en.json";
import viDict from "@/content/dictionaries/vi.json";
import servicesDetailData from "@/content/services_detail.json";
import projectsData from "@/content/projects.json";

export function generateStaticParams() {
  const locales = ["en", "vi"];
  const serviceIds = [
    "renovations",
    "bathrooms",
    "cabinets",
    "flooring",
    "doors",
    "painting",
    "hiring",
    "maintenance",
  ];

  const params: { locale: string; serviceId: string }[] = [];
  locales.forEach((locale) => {
    serviceIds.forEach((serviceId) => {
      params.push({ locale, serviceId });
    });
  });
  return params;
}

interface PageProps {
  params: {
    locale: string;
    serviceId: string;
  };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const { locale, serviceId } = params;
  const service = (servicesDetailData as any)[serviceId];
  if (!service) return {};

  const isVi = locale === "vi";
  const title = isVi ? service.title_vi : service.title_en;
  const intro = isVi ? service.intro_vi : service.intro_en;

  return {
    title: `${title} | NS Building Auckland`,
    description: intro,
    alternates: {
      canonical: `/${locale}/services/${serviceId}`,
      languages: {
        en: `/en/services/${serviceId}`,
        vi: `/vi/services/${serviceId}`,
      },
    },
    openGraph: {
      title: `${title} | NS Building Auckland`,
      description: intro,
      images: [service.hero_image],
    },
  };
}

const TEMPLATE_MAP: Record<string, React.ComponentType<any>> = {
  renovations: RenovationServiceTemplate,
  bathrooms: RenovationServiceTemplate,
  cabinets: JoineryServiceTemplate,
  doors: JoineryServiceTemplate,
  flooring: SurfaceFinishingServiceTemplate,
  painting: SurfaceFinishingServiceTemplate,
  hiring: EquipmentHireServiceTemplate,
  maintenance: PropertyMaintenanceServiceTemplate,
};

export default function ServiceDetailPage({ params }: PageProps) {
  const { locale, serviceId } = params;

  if (locale !== "en" && locale !== "vi") notFound();

  const service = (servicesDetailData as any)[serviceId];
  if (!service) notFound();

  const dict = locale === "vi" ? viDict : enDict;

  // Find related project for this service
  const relatedProject =
    projectsData.find((p) => p.category === serviceId) || projectsData[0];

  const TemplateComponent = TEMPLATE_MAP[serviceId] || RenovationServiceTemplate;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
      <Header locale={locale as "en" | "vi"} dict={dict} />

      <main className="flex-1 pt-16 md:pt-20">
        <TemplateComponent
          serviceId={serviceId}
          service={service}
          locale={locale as "en" | "vi"}
          dict={dict}
          relatedProject={relatedProject}
        />
      </main>

      <Footer locale={locale as "en" | "vi"} dict={dict} />
      <AIChatWidget locale={locale as "en" | "vi"} />
      <MobileBottomNav locale={locale as "en" | "vi"} dict={dict} />
    </div>
  );
}
