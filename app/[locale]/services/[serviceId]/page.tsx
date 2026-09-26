import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import path from "path";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import AIChatWidget from "@/components/AIChatWidget";
import SocialChatButtons from "@/components/SocialChatButtons";
import { readJsonSafe } from "@/lib/json-store";

import RenovationServiceTemplate from "@/components/service-templates/RenovationServiceTemplate";
import JoineryServiceTemplate from "@/components/service-templates/JoineryServiceTemplate";
import SurfaceFinishingServiceTemplate from "@/components/service-templates/SurfaceFinishingServiceTemplate";
import EquipmentHireServiceTemplate from "@/components/service-templates/EquipmentHireServiceTemplate";
import PropertyMaintenanceServiceTemplate from "@/components/service-templates/PropertyMaintenanceServiceTemplate";

export const revalidate = 300; // ISR: admin edits trigger revalidatePath sooner

export function generateStaticParams() {
  const locales = ["en", "vi"];
  const serviceIds = [
    "renovations",
    "bathrooms",
    "cabinets",
    "flooring",
    "doors",
    "painting",
    "plastering",
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

const servicesDetailPath = path.join(process.cwd(), "content", "services_detail.json");
const projectsPath = path.join(process.cwd(), "content", "projects.json");
const dictViPath = path.join(process.cwd(), "content", "dictionaries", "vi.json");
const dictEnPath = path.join(process.cwd(), "content", "dictionaries", "en.json");

async function getServicesDetail(): Promise<Record<string, any>> {
  return await readJsonSafe<Record<string, any>>(servicesDetailPath, {});
}

async function getProjects(): Promise<any[]> {
  return await readJsonSafe<any[]>(projectsPath, []);
}

async function getDictionary(locale: string): Promise<any> {
  return await readJsonSafe<any>(locale === "vi" ? dictViPath : dictEnPath, {});
}

interface PageProps {
  params: {
    locale: string;
    serviceId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, serviceId } = params;
  const services = await getServicesDetail();
  const service = services[serviceId];
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
  plastering: SurfaceFinishingServiceTemplate,
  hiring: EquipmentHireServiceTemplate,
  maintenance: PropertyMaintenanceServiceTemplate,
};

export default async function ServiceDetailPage({ params }: PageProps) {
  const { locale, serviceId } = params;

  if (locale !== "en" && locale !== "vi") notFound();

  const services = await getServicesDetail();
  const service = services[serviceId];
  if (!service) notFound();

  const dict = await getDictionary(locale);
  const projectsData = await getProjects();

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
      <SocialChatButtons locale={locale as "en" | "vi"} />
      <AIChatWidget locale={locale as "en" | "vi"} />
      <MobileBottomNav locale={locale as "en" | "vi"} dict={dict} />
    </div>
  );
}
