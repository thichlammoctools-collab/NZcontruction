import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nsbuilding.co.nz";
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
  const projectIds = [
    "remuera-architectural-renovation",
    "takapuna-luxury-bathroom",
    "epsom-custom-kitchen-cabinetry",
  ];

  const routes: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    });

    serviceIds.forEach((id) => {
      routes.push({
        url: `${baseUrl}/${locale}/services/${id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    });

    projectIds.forEach((id) => {
      routes.push({
        url: `${baseUrl}/${locale}/projects/${id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  });

  return routes;
}
